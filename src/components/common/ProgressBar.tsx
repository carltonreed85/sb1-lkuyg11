import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  steps: { id: string; title: string }[];
  currentStep: string;
  progress: number;
}

export default function ProgressBar({ steps, currentStep, progress }: ProgressBarProps) {
  return (
    <div>
      <div className="relative">
        {/* Progress bar background */}
        <div className="h-2 bg-gray-200 rounded-full" />
        
        {/* Progress bar fill */}
        <div
          className="absolute top-0 h-2 bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative">
        <div className="mt-4 grid grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const stepIndex = steps.findIndex((s) => s.id === currentStep);
            const isComplete = index < stepIndex;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  isComplete || isCurrent ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isComplete
                      ? 'border-primary bg-primary text-white'
                      : isCurrent
                      ? 'border-primary'
                      : 'border-gray-300'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="mt-2 text-sm font-medium">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}