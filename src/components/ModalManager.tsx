
"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { api } from "../../convex/_generated/api";
import WelcomeTrialModal from "./WelcomeTrialModal";
import TrialEndedModal from "./TrialEndedModal";

/**
 * This component manages all global modals.
 * 1. It renders the modal components.
 * 2. It triggers the "WelcomeTrialModal" if the user is new.
 */
export default function ModalManager() {
  const { user } = useUser();
  const convexUser = useQuery(
    api.users.getUser,
    user ? { userId: user.id } : "skip"
  );
  const { openTrialWelcome } = useModalStore();

  useEffect(() => {
    // Check if the user is loaded and their modal flag is set to false
    if (convexUser && convexUser.hasSeenTrialModal === false) {
      openTrialWelcome();
    }
  }, [convexUser, openTrialWelcome]);

  return (
    <>
      <WelcomeTrialModal />
      <TrialEndedModal />
    </>
  );
}