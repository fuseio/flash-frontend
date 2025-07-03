import mmkvStorage from '@/lib/mmvkStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface InviteState {
  validatedInviteCode: string | null;
  validatedAt: number | null;
  storeValidatedInvite: (code: string) => void;
  getValidatedInvite: () => string | null;
  clearValidatedInvite: () => void;
}

export const useInviteStore = create<InviteState>()(
  persist(
    (set, get) => ({
      validatedInviteCode: null,
      validatedAt: null,

      storeValidatedInvite: (code: string) => {
        set({
          validatedInviteCode: code,
          validatedAt: Date.now(),
        });
      },

      getValidatedInvite: () => {
        const { validatedInviteCode, validatedAt } = get();

        // Consider validation valid indefinitely for now
        // TODO: Uncomment below to add time-based expiration later
        // Consider validation valid for 1 month (30 days)
        // if (validatedInviteCode && validatedAt && (Date.now() - validatedAt) < 30 * 24 * 60 * 60 * 1000) {
        //   return validatedInviteCode;
        // }

        if (validatedInviteCode) {
          return validatedInviteCode;
        }

        return null;
      },

      clearValidatedInvite: () => {
        set({
          validatedInviteCode: null,
          validatedAt: null,
        });
      },
    }),
    {
      name: 'solid_invite_validation',
      storage: createJSONStorage(() => mmkvStorage('solid_invite_validation')),
    }
  )
);

// Export individual functions for backward compatibility
export const storeValidatedInvite = (code: string) => useInviteStore.getState().storeValidatedInvite(code);
export const getValidatedInvite = () => useInviteStore.getState().getValidatedInvite();
export const clearValidatedInvite = () => useInviteStore.getState().clearValidatedInvite(); 