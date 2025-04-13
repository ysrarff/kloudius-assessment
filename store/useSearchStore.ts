import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { TSearchStoreType, TState } from "./types/SearchStoreType";

const initialState: TState = {
  searchText: "",
  searchResult: undefined,
  selectedCoordinates: undefined,
  selectedPlace: undefined,
};

export const useSearchStore = create<TSearchStoreType>()(
  immer((set) => ({
    ...initialState,
    setSearchText: (input) =>
      set((state) => {
        state.searchText = input;
      }),
    setSearchResult: (result) =>
      set((state) => {
        state.searchResult = result;
      }),
    setSelectedCoordinates: (coords) =>
      set((state) => {
        state.selectedCoordinates = coords;
      }),
    setSelectedPlace: (place) =>
      set((state) => {
        state.selectedPlace = place;
      }),
  }))
);
