import { createContext } from 'react';

export const SearchContext = createContext({
  searchState: {},
  inputHandler: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
});
