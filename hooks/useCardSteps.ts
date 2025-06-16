import { useEffect, useState } from "react";

interface Step {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  buttonText?: string;
  onPress?: () => void;
}

export function useCardSteps() {
  const [activeStepId, setActiveStepId] = useState<number | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      title: "Complete KYC",
      description: "Identity verification required for us to issue your card",
      completed: true,
      buttonText: "Complete KYC",
    },
    {
      id: 2,
      title: "Order your card",
      description:
        'All is set! now click on the "Create card" button to issue your new card',
      completed: false,
      buttonText: "Order card",
      onPress: () => {
        console.log("Order card pressed");
      },
    },
    {
      id: 3,
      title: "Start spending :)",
      description: "Congradulations! your card is ready",
      buttonText: "To the card",
      completed: false,
    },
  ];

  // Set default active step on mount
  useEffect(() => {
    const firstIncompleteStep = steps.find((step, index) => {
      const allPrecedingCompleted = steps
        .slice(0, index)
        .every((s) => s.completed);
      return !step.completed && allPrecedingCompleted;
    });

    if (firstIncompleteStep) {
      setActiveStepId(firstIncompleteStep.id);
    }
  }, []);

  // Check if a step's button should be enabled
  const isStepButtonEnabled = (stepIndex: number) => {
    return steps.slice(0, stepIndex).every((step) => step.completed);
  };

  const toggleStep = (stepId: number) => {
    setActiveStepId(activeStepId === stepId ? null : stepId);
  };

  return {
    steps,
    activeStepId,
    isStepButtonEnabled,
    toggleStep,
  };
}
