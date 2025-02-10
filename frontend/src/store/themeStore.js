import { create } from 'zustand';

const themeStore = create((set) => ({
  theme: "dark", // Initial state
  
  changeTheme: () => set((state) => ({

      theme: state.theme === "dark" ? "light" : "dark", // Toggle theme
      
    })),
}));

export default themeStore;
