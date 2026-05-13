import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setAuth: (userData) => set({ 
        user: userData, 
        isAuthenticated: !!userData, 
        isLoading: false 
    }),

    logout: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
    }),
}));

export default useAuthStore;