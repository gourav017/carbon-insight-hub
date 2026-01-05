import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentStep: "profile" | "environmental" | "social" | "governance" | "results";
  completionStatus: {
    profile: boolean;
    environmental: boolean;
    social: boolean;
    governance: boolean;
  };
}

const steps = [
  { key: "profile", label: "Profile" },
  { key: "environmental", label: "Environmental" },
  { key: "social", label: "Social" },
  { key: "governance", label: "Governance" },
  { key: "results", label: "Results" }
];

export function ProgressTracker({ currentStep, completionStatus = { profile: false, environmental: false, social: false, governance: false } }: ProgressTrackerProps) {
  const getCurrentIndex = () => steps.findIndex(s => s.key === currentStep);
  const currentIndex = getCurrentIndex();

  return (
    <div className="w-full py-6 px-4 bg-card border-b border-border">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completionStatus[step.key as keyof typeof completionStatus] || false;
            const isCurrent = step.key === currentStep;
            const isAccessible = index <= currentIndex;

            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent && !isCompleted && "bg-accent text-accent-foreground border-2 border-primary",
                      !isCompleted && !isCurrent && isAccessible && "bg-muted text-muted-foreground",
                      !isAccessible && "bg-muted/50 text-muted-foreground/50"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 font-medium",
                      isCurrent && "text-foreground",
                      !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 transition-colors",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
