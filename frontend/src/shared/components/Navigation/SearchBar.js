import React, { useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { SearchContext } from '../../context/search-context';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SearchBar.css';

const SearchBar = ({ isMobile, closeSearchBarHandler }) => {
  const history = useHistory();
  const { searchState, inputHandler, setCurrentPage } = useContext(SearchContext);
  const changeHandler = useCallback(
    (e) => {
      const value = e.target.value;
      const isValid = value.length > 0;
      inputHandler('search', value, isValid);
      setCurrentPage(1);
    },
    [inputHandler, setCurrentPage],
  );
  const submitHandler = useCallback(
    (e) => {
      e.preventDefault();
      history.push('/search');
      if (closeSearchBarHandler) {
        closeSearchBarHandler();
      }
    },
    [history, closeSearchBarHandler],
  );
  return (
    <form className={isMobile ? 'searchMobileForm' : 'searchForm'}>
      <input
        className="search-input"
        value={searchState.inputs.search.value}
        type="text"
        placeholder="Search..."
        onChange={changeHandler}
      ></input>
      <button
        className="search"
        type="submit"
        onClick={submitHandler}
        disabled={!searchState.isValid}
      >
        <span className="search-emoji" role="img" aria-label="emoji">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </button>
    </form>
  );
};

export default SearchBar;
