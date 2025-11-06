

import { create } from "zustand";

type ModalState = {
  isTrialWelcomeModalOpen: boolean;
  isTrialEndedModalOpen: boolean;
  openTrialWelcome: () => void;
  openTrialEnded: () => void;
  closeAllModals: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isTrialWelcomeModalOpen: false,
  isTrialEndedModalOpen: false,
  openTrialWelcome: () =>
    set({
      isTrialWelcomeModalOpen: true,
      isTrialEndedModalOpen: false,
    }),
  openTrialEnded: () =>
    set({
      isTrialWelcomeModalOpen: false,
      isTrialEndedModalOpen: true,
    }),
  closeAllModals: () =>
    set({
      isTrialWelcomeModalOpen: false,
      isTrialEndedModalOpen: false,
    }),
}));