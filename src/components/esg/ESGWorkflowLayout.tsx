import React from "react";
import { AssessmentStep, ESGAssessmentData } from "@/types/esg";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { loadAssessmentData } from "@/lib/esg/storage";

interface ESGWorkflowLayoutProps {
    currentStep: AssessmentStep;
    children: React.ReactNode;
    onNext?: () => void;
    onBack?: () => void;
    isNextDisabled?: boolean;
}

const STEPS: { id: AssessmentStep; label: string; phase: string }[] = [
    { id: "region-selection", label: "1. Region & Framework", phase: "Strategy" },
    { id: "purpose-selection", label: "2. Assessment Purpose", phase: "Strategy" },
    { id: "materiality-assessment", label: "3. Materiality Assessment", phase: "Strategy" },
    { id: "policy-input", label: "4. Policy Review", phase: "Gap Analysis" },
    { id: "gap-analysis", label: "5. Gap Analysis", phase: "Gap Analysis" },
    { id: "risk-opportunity", label: "6. Risks & Opportunities", phase: "Gap Analysis" },
    { id: "data-process-review", label: "7. Process Review", phase: "Data Collection" },
    { id: "stakeholder-engagement", label: "8. Stakeholder Engagement", phase: "Data Collection" },
    { id: "data-gathering", label: "9. Data Gathering", phase: "Data Collection" },
    { id: "disclosure-mapping", label: "10. Disclosure Mapping", phase: "Reporting" },
    { id: "evaluation", label: "11. Strength/Weakness", phase: "Reporting" },
    { id: "scoring", label: "12. Scoring", phase: "Reporting" },
    { id: "report-generation", label: "13-15. Final Report", phase: "Reporting" },
];

export const ESGWorkflowLayout: React.FC<ESGWorkflowLayoutProps> = ({
    currentStep,
    children,
    onNext,
    onBack,
    isNextDisabled = false,
}) => {
    const navigate = useNavigate();
    // In a real app we might load this to check completion status of previous steps
    // const assessmentData = loadAssessmentData(); 

    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar */}
            <aside className="w-80 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full overflow-y-auto">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="font-bold text-xl text-primary">ESG Diligence</h2>
                    <p className="text-xs text-muted-foreground mt-1">Comprehensive Assessment</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {STEPS.map((step, index) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = index < currentStepIndex;
                        const isFuture = index > currentStepIndex;

                        return (
                            <div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : isCompleted
                                            ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                                            : "text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                )}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                ) : isActive ? (
                                    <div className="w-4 h-4 rounded-full border-2 border-primary shrink-0 relative">
                                        <div className="absolute inset-1 rounded-full bg-primary animate-pulse" />
                                    </div>
                                ) : (
                                    <Circle className="w-4 h-4 shrink-0" />
                                )}
                                <span className="truncate">{step.label}</span>
                            </div>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
                        Save & Exit
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-80 flex flex-col h-full min-h-screen">
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-lg font-semibold">{STEPS[currentStepIndex]?.label}</h1>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of {STEPS.length}</span>
                    </div>
                </header>

                <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
                    <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 min-h-[500px]">
                        {children}
                    </div>
                </div>

                <footer className="h-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-8 sticky bottom-0 z-10">
                    <Button
                        variant="outline"
                        onClick={onBack}
                        disabled={currentStepIndex === 0}
                    >
                        Back
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            onClick={onNext}
                            disabled={isNextDisabled}
                            className="min-w-[100px]"
                        >
                            {currentStepIndex === STEPS.length - 1 ? "Finish" : "Next Step"}
                        </Button>
                    </div>
                </footer>
            </main>
        </div>
    );
};
