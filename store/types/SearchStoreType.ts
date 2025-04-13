export type TLocation = {
  latitude: number;
  longitude: number;
};

export interface IPlace {
  id: string;
  formattedAddress: string;
  location: TLocation;
  displayName: {
    text: string;
    languageCode: string;
  };
}

export type TSearchResult = {
  places: IPlace[];
};

interface ISelectedPlace {
  formattedAddress: string;
  displayName: {
    text: string;
    languageCode: string;
  };
}

export type TState = {
  searchText: string;
  searchResult: TSearchResult | undefined;
  selectedCoordinates: TLocation | undefined;
  selectedPlace: ISelectedPlace | undefined;
};

export type TActions = {
  setSearchText: (input: string) => void;
  setSearchResult: (coords: TSearchResult | undefined) => void;
  setSelectedCoordinates: (result: TLocation | undefined) => void;
  setSelectedPlace: (place: ISelectedPlace | undefined) => void;
};

export type TSearchStoreType = TState & TActions;
