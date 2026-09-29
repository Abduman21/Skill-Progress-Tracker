import { create } from 'zustand';

function readOnboarding() { try { return localStorage.getItem('hasSeenOnboarding') === 'true'; } catch { return false; } }

interface UiState {
    isCreateModalOpen: boolean;
    setCreateModalOpen: (open: boolean) => void;

    // Onboarding state
    hasSeenOnboarding: boolean;
    setHasSeenOnboarding: (seen: boolean) => void;

    // For later: notifications/toasts state
    notification: { message: string; type: 'success' | 'error' } | null;
    setNotification: (notif: { message: string; type: 'success' | 'error' } | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
    isCreateModalOpen: false,
    setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),

    hasSeenOnboarding: readOnboarding(),
    setHasSeenOnboarding: (seen) => {
        set({ hasSeenOnboarding: seen });
        try { localStorage.setItem('hasSeenOnboarding', String(seen)); } catch { /* Memory state remains available. */ }
    },

    notification: null,
    setNotification: (notification) => {
        set({ notification });
        if (notification) {
            setTimeout(() => set({ notification: null }), 3000);
        }
    },
}));
