import React from 'react';
import { Compass, Calendar, Globe, ArrowRight } from 'lucide-react';

export const JourneyPreviewSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Discover',
      description: 'Find destinations and experiences that match your interests.',
      icon: Compass,
      detail: 'Explore verified city guides, curated local activities, and estimated daily budgets.'
    },
    {
      number: '02',
      title: 'Plan',
      description: 'Build your multi-city journey with dates, activities and budgets.',
      icon: Calendar,
      detail: 'Reorder stops, organize day-by-day schedules, and allocate transport and stay expenses.'
    },
    {
      number: '03',
      title: 'Explore',
      description: 'Visualize your complete journey and share it with others.',
      icon: Globe,
      detail: 'Access your dynamic road timeline anywhere and publish read-only links for friends.'
    }
  ];

  return (
    <section id="journeys" className="py-20 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 block mb-2">
            The Journey Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            How TheWorldView transforms travel planning
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            From initial inspiration to stepping out on the road, our intuitive system connects every phase seamlessly.
          </p>
        </div>

        {/* 3 Step Flow with connecting path line */}
        <div className="relative">
          {/* Connecting Road Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 -translate-y-6 z-0">
            <div className="w-full h-full border-t-2 border-dashed border-zinc-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-lg backdrop-blur-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono font-bold text-zinc-500 group-hover:text-emerald-400 transition-colors">
                        {step.number} —
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:border-zinc-700 transition-colors">
                        <Icon className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-100 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium text-zinc-300 mb-3 leading-snug">
                      "{step.description}"
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span>Phase {idx + 1}</span>
                    <span className="text-zinc-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                      <span>Explore workflow</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
