// import { create } from "zustand";

// const useAuthStore = create((set) => ({
//     user: null,
//     isAuthenticated: false,
//     isLoading: true,

//     setAuth: (userData) => set({ 
//         user: userData, 
//         isAuthenticated: !!userData, 
//         isLoading: false 
//     }),

//     logout: () => set({ 
//         user: null, 
//         isAuthenticated: false, 
//         isLoading: false 
//     }),
// }));

// export default useAuthStore;

import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    isAuthenticated: !!localStorage.getItem("user"),
    isLoading: true,

    setAuth: (userData) => {
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            localStorage.removeItem("user");
        }
        set({ 
            user: userData, 
            isAuthenticated: !!userData, 
            isLoading: false 
        });
    },

    logout: () => {
        localStorage.removeItem("user");
        set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
        });
    },
}));

export default useAuthStore;