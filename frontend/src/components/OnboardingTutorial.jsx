import { useState, useEffect } from 'react';
import tutorialSteps from '../data/tutorialSteps';

const SEEN_KEY = 'contractiq_tutorial_seen';

export default function OnboardingTutorial() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setVisible(true);
    }
  }, []);

  function handleNext() {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      handleDismiss();
    }
  }

  function handleDismiss() {
    localStorage.setItem(SEEN_KEY, 'true');
    setVisible(false);
  }

  if (!visible) return null;

  const current = tutorialSteps[step];
  const isLast = step === tutorialSteps.length - 1;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 w-full max-w-md text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400/20 to-teal-600/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={current.icon} />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">{current.description}</p>

        <div className="flex items-center gap-2 justify-center mb-6">
          {tutorialSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-teal-400' : 'w-1.5 bg-navy-700'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 rounded-xl border border-navy-700 text-slate-400 hover:text-white hover:bg-navy-800 transition-all text-sm font-medium"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-semibold transition-all text-sm"
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>

        <p className="text-slate-600 text-xs mt-4">
          Step {step + 1} of {tutorialSteps.length}
        </p>
      </div>
    </div>
  );
}
