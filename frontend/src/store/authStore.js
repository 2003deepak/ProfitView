import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      // Initial state
      isLoggedIn: false,
      role: null,
      user: null,

      // Function to log in the user
      setLogIn: (user) =>
        set(() => ({
          isLoggedIn: true,
          role: user.role,
          user: user,
        })),

      // Function to log out the user
      setLogOut: () =>
        set(() => ({
          isLoggedIn: false,
          role: null,
          user: null,
        })),
    }),
    {
      name: "auth-storage", // Key name in localStorage
      getStorage: () => localStorage, // Use localStorage to persist the data
    }
  )
);

export default useAuthStore;
