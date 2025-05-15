import { create } from 'zustand';

const themeStore = create((set) => ({
  theme: "dark", // Initial state
  isSidebarOpen: false,
  
  changeTheme: () => set((state) => ({

      theme: state.theme === "dark" ? "light" : "dark", // Toggle theme
      
    })),

  changeSidebarOpen : () => set((state) => ({
    
    isSidebarOpen : !state.isSidebarOpen

  }))


}));

export default themeStore;
