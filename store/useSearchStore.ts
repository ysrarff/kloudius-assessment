import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SearchStore {
  bears: number;
  increase: (by: number) => void;
}

const useSearchStore = create<SearchStore>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);

export default useSearchStore;
