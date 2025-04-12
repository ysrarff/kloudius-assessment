import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface ISearchedCoordinates {
  latitude: number;
  longitude: number;
}

type State = {
  searchedCoordinates: ISearchedCoordinates | null;
};

type Actions = {
  setSearchedCoordinates: (coords: ISearchedCoordinates) => void;
};

type AppStoreType = State & Actions;

const initialState: State = {
  searchedCoordinates: null,
};

export const useAppStore = create<AppStoreType>()(
  immer((set) => ({
    ...initialState,
    setSearchedCoordinates: (val) =>
      set((state) => {
        state.searchedCoordinates = val;
      }),
  }))
);
