import { path } from "@/constants/path";
import { createCard } from "@/lib/api";
import { KycStatus } from "@/lib/types";
import { withRefreshToken } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCustomer } from "./useCustomer";

interface Step {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  buttonText?: string;
  onPress?: () => void;
  status?: "pending" | "under_review" | "completed";
}

export function useCardSteps(manualKycStatus?: KycStatus) {
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const [cardActivated, setCardActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [persistedManualKycStatus, setPersistedManualKycStatus] =
    useState<KycStatus | null>(null);

  const router = useRouter();

  // Use TanStack Query for customer data
  const {
    data: customer,
    refetch: refetchCustomer,
    isRefetching,
  } = useCustomer();

  const backendKycStatus = customer?.kycStatus || KycStatus.NOT_STARTED;

  // Set the manual status when it's first provided
  useEffect(() => {
    if (manualKycStatus && !persistedManualKycStatus) {
      setPersistedManualKycStatus(manualKycStatus);
    }
  }, [manualKycStatus, persistedManualKycStatus]);

  // Clear the persisted manual status when backend catches up or exceeds it
  useEffect(() => {
    if (persistedManualKycStatus && backendKycStatus) {
      // If backend status is equal to or better than manual status, use backend
      const statusHierarchy: Record<string, number> = {
        [KycStatus.NOT_STARTED]: 0,
        [KycStatus.UNDER_REVIEW]: 1,
        [KycStatus.APPROVED]: 2,
      };

      if (
        statusHierarchy[backendKycStatus] >=
        statusHierarchy[persistedManualKycStatus]
      ) {
        setPersistedManualKycStatus(null);
      }
    }
  }, [backendKycStatus, persistedManualKycStatus]);

  // Use persisted manual status if available, otherwise use backend status
  const kycStatus = persistedManualKycStatus || backendKycStatus;

  const handleProceedToKyc = useCallback(async () => {
    router.push(path.CARD_USER_INFO_MOBILE);
  }, [router]);

  const handleActivateCard = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("Activating card...");

      // const card = await withRefreshToken(() => createCard());

      // if (!card) throw new Error("Failed to create card");

      // console.log("Card created:", card);
      setCardActivated(true);

      // Navigate to card details
      router.replace(path.CARD_DETAILS_MOBILE);
    } catch (error) {
      console.error("Error activating card:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const steps: Step[] = useMemo(
    () => [
      {
        id: 1,
        title: "Complete KYC",
        description: "Identity verification required for us to issue your card",
        completed: kycStatus === KycStatus.APPROVED || cardActivated,
        status:
          kycStatus === KycStatus.UNDER_REVIEW
            ? "under_review"
            : kycStatus === KycStatus.APPROVED
            ? "completed"
            : "pending",
        buttonText:
          kycStatus === KycStatus.UNDER_REVIEW
            ? "Under Review"
            : "Complete KYC",
        onPress:
          kycStatus === KycStatus.UNDER_REVIEW ? undefined : handleProceedToKyc,
      },
      {
        id: 2,
        title: "Order your card",
        description:
          'All is set! now click on the "Create card" button to issue your new card',
        completed: cardActivated,
        status: cardActivated ? "completed" : "pending",
        buttonText: "Order card",
        onPress: handleActivateCard,
      },
      {
        id: 3,
        title: "Start spending :)",
        description: "Congratulations! your card is ready",
        buttonText: "To the card",
        completed: cardActivated,
        status: cardActivated ? "completed" : "pending",
        onPress: () => router.push(path.CARD_DETAILS_MOBILE),
      },
    ],
    [kycStatus, cardActivated, handleProceedToKyc, handleActivateCard, router]
  );

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
  }, [steps]);

  // Check if a step's button should be enabled
  const isStepButtonEnabled = (stepIndex: number) => {
    // Return true for now since we're on Sandbox.
    return true;
    // return steps.slice(0, stepIndex).every((step) => step.completed);
  };

  const toggleStep = (stepId: number) => {
    setActiveStepId(activeStepId === stepId ? null : stepId);
  };

  return {
    steps,
    activeStepId,
    isStepButtonEnabled,
    toggleStep,
    isLoading,
    refetchCustomer,
    isRefetching,
  };
}
