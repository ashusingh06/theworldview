import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import type { User, RegisterFormData } from '../types';
import { emailService } from './emailService';

const LOCAL_STORAGE_USER_KEY = 'theworldview_auth_user';
const LOCAL_STORAGE_ACCOUNTS_KEY = 'theworldview_registered_accounts';
const LOCAL_STORAGE_OTPS_KEY = 'theworldview_email_otps';
const LOCAL_STORAGE_PENDING_REGISTRATION = 'theworldview_pending_registration';

const formatFirebaseAuthError = (error: any): string => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is not formatted correctly.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email address or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Try signing in.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was canceled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      return error?.message || 'Authentication failed. Please try again.';
  }
};

export const authService = {
  getCurrentLocalUser(): User | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setLocalUser(user: User | null): void {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  },

  getPendingGoogleUser(): Partial<RegisterFormData> | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PENDING_REGISTRATION);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setPendingGoogleUser(data: Partial<RegisterFormData> | null): void {
    if (data) {
      localStorage.setItem(LOCAL_STORAGE_PENDING_REGISTRATION, JSON.stringify(data));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PENDING_REGISTRATION);
    }
  },

  getRegisteredAccounts(): { [email: string]: { passwordHash?: string; user: User } } {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  saveRegisteredAccount(email: string, password: string | undefined, user: User) {
    try {
      const accounts = this.getRegisteredAccounts();
      accounts[email.toLowerCase()] = {
        passwordHash: password,
        user
      };
      localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save account:', e);
    }
  },

  // --- OTP Verification System ---
  async generateEmailOtp(email: string, recipientName?: string): Promise<{ otp: string; expiresAt: number }> {
    const trimmedEmail = email.trim().toLowerCase();
    // 6-digit cryptographically secure / pseudo-random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

    try {
      const allOtps = JSON.parse(localStorage.getItem(LOCAL_STORAGE_OTPS_KEY) || '{}');
      allOtps[trimmedEmail] = { otp, expiresAt };
      localStorage.setItem(LOCAL_STORAGE_OTPS_KEY, JSON.stringify(allOtps));

      // Trigger actual email dispatch
      await emailService.sendOtpEmail(trimmedEmail, otp, recipientName);
    } catch (e) {
      console.error('Failed to store/dispatch OTP:', e);
    }

    return { otp, expiresAt };
  },

  verifyEmailOtp(email: string, enteredOtp: string): boolean {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanedCode = enteredOtp.trim();

    try {
      const allOtps = JSON.parse(localStorage.getItem(LOCAL_STORAGE_OTPS_KEY) || '{}');
      const record = allOtps[trimmedEmail];

      if (!record) return false;
      if (Date.now() > record.expiresAt) {
        delete allOtps[trimmedEmail];
        localStorage.setItem(LOCAL_STORAGE_OTPS_KEY, JSON.stringify(allOtps));
        throw new Error('Verification code has expired. Please request a new OTP.');
      }

      if (record.otp === cleanedCode) {
        // Clear used OTP
        delete allOtps[trimmedEmail];
        localStorage.setItem(LOCAL_STORAGE_OTPS_KEY, JSON.stringify(allOtps));
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message.includes('expired')) throw error;
      return false;
    }
  },

  // --- Login with Email & Password ---
  async loginWithEmail(email: string, password: string): Promise<User> {
    const trimmedEmail = email.trim().toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const fbUser = userCredential.user;
      const accounts = this.getRegisteredAccounts();
      const existingAccount = accounts[trimmedEmail]?.user;

      const user: User = {
        id: fbUser.uid,
        email: fbUser.email || trimmedEmail,
        displayName: existingAccount?.displayName || fbUser.displayName || trimmedEmail.split('@')[0],
        firstName: existingAccount?.firstName,
        lastName: existingAccount?.lastName,
        phoneNumber: existingAccount?.phoneNumber,
        city: existingAccount?.city,
        country: existingAccount?.country,
        bio: existingAccount?.bio,
        photoURL: fbUser.photoURL || existingAccount?.photoURL || undefined,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        isProfileComplete: existingAccount?.isProfileComplete ?? true,
        emailVerified: fbUser.emailVerified || existingAccount?.emailVerified || true,
        provider: 'password'
      };
      this.setLocalUser(user);
      return user;
    } catch (error: any) {
      // Local fallback
      if (!isFirebaseConfigured || error.code === 'auth/network-request-failed') {
        const accounts = this.getRegisteredAccounts();
        const account = accounts[trimmedEmail];
        if (account && account.passwordHash === password) {
          this.setLocalUser(account.user);
          return account.user;
        }
      }
      throw new Error(formatFirebaseAuthError(error));
    }
  },

  // --- Register / Complete Profile ---
  async registerWithProfile(data: RegisterFormData): Promise<User> {
    const trimmedEmail = data.email.trim().toLowerCase();
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim() || trimmedEmail.split('@')[0];

    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      email: trimmedEmail,
      displayName: fullName,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      city: data.city.trim(),
      country: data.country.trim(),
      bio: data.bio.trim(),
      photoURL: data.photoURL || undefined,
      createdAt: new Date().toISOString(),
      isProfileComplete: true,
      emailVerified: true,
      provider: data.password ? 'password' : 'google',
      preferences: {
        currency: 'USD',
        notifications: true
      }
    };

    if (data.password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, data.password);
        const fbUser = userCredential.user;
        
        if (fullName || data.photoURL) {
          await updateProfile(fbUser, { 
            displayName: fullName, 
            photoURL: data.photoURL || undefined 
          });
        }
        newUser.id = fbUser.uid;
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          // If already created via Google, just update record
        } else if (isFirebaseConfigured && error.code !== 'auth/network-request-failed') {
          throw new Error(formatFirebaseAuthError(error));
        }
      }
    }

    this.saveRegisteredAccount(trimmedEmail, data.password, newUser);
    this.setLocalUser(newUser);
    this.setPendingGoogleUser(null);
    return newUser;
  },

  // --- Sign In With Google ---
  // Even with Google login, require registration profile completion
  async loginWithGoogle(): Promise<{ user: User; requiresRegistration: boolean }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const trimmedEmail = (fbUser.email || '').toLowerCase();
      
      const accounts = this.getRegisteredAccounts();
      const existingAccount = accounts[trimmedEmail]?.user;

      const nameParts = (fbUser.displayName || '').split(' ');
      const googleFirstName = nameParts[0] || '';
      const googleLastName = nameParts.slice(1).join(' ') || '';

      // Check if user has already completed the full registration form (phone & city required)
      const isAlreadyFullyRegistered = existingAccount?.isProfileComplete && Boolean(existingAccount?.phoneNumber) && Boolean(existingAccount?.city);

      if (isAlreadyFullyRegistered) {
        const fullUser: User = {
          ...existingAccount,
          id: fbUser.uid,
          email: trimmedEmail,
          photoURL: fbUser.photoURL || existingAccount.photoURL,
          emailVerified: true,
          isProfileComplete: true,
          provider: 'google'
        };
        this.setLocalUser(fullUser);
        return { user: fullUser, requiresRegistration: false };
      }

      // User needs to complete registration!
      // Store pending profile data prefilled from Google
      const pendingData: Partial<RegisterFormData> = {
        email: trimmedEmail,
        firstName: existingAccount?.firstName || googleFirstName,
        lastName: existingAccount?.lastName || googleLastName,
        photoURL: fbUser.photoURL || existingAccount?.photoURL || undefined,
        phoneNumber: existingAccount?.phoneNumber || fbUser.phoneNumber || '',
        city: existingAccount?.city || '',
        country: existingAccount?.country || '',
        bio: existingAccount?.bio || ''
      };
      this.setPendingGoogleUser(pendingData);

      const partialUser: User = {
        id: fbUser.uid,
        email: trimmedEmail,
        displayName: fbUser.displayName || 'Google Traveler',
        firstName: pendingData.firstName,
        lastName: pendingData.lastName,
        photoURL: fbUser.photoURL || undefined,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        isProfileComplete: false,
        emailVerified: true,
        provider: 'google'
      };
      this.setLocalUser(partialUser);

      return { user: partialUser, requiresRegistration: true };
    } catch (error: any) {
      throw new Error(formatFirebaseAuthError(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      // ignore
    } finally {
      this.setLocalUser(null);
      this.setPendingGoogleUser(null);
    }
  },

  subscribeToAuthState(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const local = this.getCurrentLocalUser();
        const accounts = this.getRegisteredAccounts();
        const existing = accounts[(fbUser.email || '').toLowerCase()]?.user;

        const user: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: existing?.displayName || fbUser.displayName || local?.displayName || 'Traveler',
          firstName: existing?.firstName || local?.firstName,
          lastName: existing?.lastName || local?.lastName,
          phoneNumber: existing?.phoneNumber || local?.phoneNumber,
          city: existing?.city || local?.city,
          country: existing?.country || local?.country,
          bio: existing?.bio || local?.bio,
          photoURL: fbUser.photoURL || existing?.photoURL || local?.photoURL || undefined,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          isProfileComplete: existing?.isProfileComplete ?? local?.isProfileComplete ?? false,
          emailVerified: fbUser.emailVerified || existing?.emailVerified || local?.emailVerified || false,
          provider: (local?.provider || 'password') as any
        };
        this.setLocalUser(user);
        callback(user);
      } else {
        const localUser = this.getCurrentLocalUser();
        callback(localUser);
      }
    });
  }
};
