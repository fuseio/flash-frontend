import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { USER } from '@/lib/config';
import mmkvStorage from '@/lib/mmvkStorage';
import { DepositModal } from '@/lib/types';

interface DepositState {
  depositModal: DepositModal;
  previousDepositModal: DepositModal;
  setDepositModal: (modal: DepositModal) => void;
}

export const useDepositStore = create<DepositState>()(
  persist(
    (set, get) => ({
      depositModal: DepositModal.CLOSE,
      previousDepositModal: DepositModal.CLOSE,

      setDepositModal: (modal) => set({
        previousDepositModal: get().depositModal,
        depositModal: modal
      }),
    }),
    {
      name: USER.depositStorageKey,
      storage: createJSONStorage(() => mmkvStorage(USER.depositStorageKey)),
    }
  )
);
