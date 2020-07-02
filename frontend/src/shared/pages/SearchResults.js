import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../hooks/http-hook';
import { SearchContext } from '../context/search-context';
import LoadingSpinner from '../components/UIElements/LoadingSpinner';
import ErrorModal from '../components/UIElements/ErrorModal';
import UsersList from '../../user/components/UsersList';
import PlaceList from '../../places/components/PlaceList';
import Card from '../components/UIElements/Card';
import Pagination from '../components/UIElements/Pagination';
import './SearchResults.css';

const SearchResults = (props) => {
  const { searchState, currentPage, setCurrentPage } = useContext(SearchContext);
  const searchInput = searchState.inputs.search.value;
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);

  const [postsPerPage] = useState(5);
  const [categorization, setCategorization] = useState({
    all: true,
    users: false,
    places: false,
  });
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const categorizeResultsHandler = (e) => {
    const id = e.target.id;

    setCategorization({
      all: false,
      users: false,
      places: false,
      [id]: true,
    });
    setCurrentPage(1);
  };
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/search?q=${searchInput}`,
        );
        setUsers(await responseData.users);
        setPlaces(await responseData.places);
      } catch (err) {}
    };
    fetchResults();
  }, [sendRequest, searchInput]);

  let allResults = [...users, ...places];

  allResults.sort((a, b) => (a.id > b.id ? 1 : -1));
  allResults = allResults.slice(indexOfFirstPost, indexOfLastPost);

  const allResultsFilteredUser = allResults.filter((item) => {
    return item.email;
  });
  const allResultsFilteredPlaces = allResults.filter((item) => {
    return item.location;
  });
  const slicedUsers = users.slice(indexOfFirstPost, indexOfLastPost);
  const slicedPlaces = places.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  let results;
  if (searchInput === '') {
    results = (
      <Card className="search-not-found">
        <span> Please enter at least one character! </span>
      </Card>
    );
  } else {
    results = (
      <div>
        {error && <ErrorModal error={error} onClear={clearError} />}
        {!isLoading && !users.length && !places.length && (
          <Card className="search-not-found">
            <span> No users or places found similar to '{searchInput}'!</span>
          </Card>
        )}

        {!isLoading && categorization.all && !!allResultsFilteredUser.length && (
          <UsersList items={allResultsFilteredUser} />
        )}
        {!isLoading && categorization.all && !!allResultsFilteredPlaces.length && (
          <PlaceList items={allResultsFilteredPlaces} forSearchResults={true} />
        )}
        {!isLoading && categorization.users && !!slicedUsers.length && (
          <UsersList items={slicedUsers} />
        )}
        {!isLoading && categorization.places && !!slicedPlaces.length && (
          <PlaceList items={slicedPlaces} forSearchResults={true} />
        )}
      </div>
    );
  }
  return (
    <div className="margin-auto">
      <div className="center padding-y">
        <button
          className={`button ${categorization.all ? 'active' : ''}`}
          id="all"
          onClick={categorizeResultsHandler}
        >
          All ({searchInput === '' ? 0 : users.length + places.length})
        </button>
        <button
          className={`button ${categorization.users ? 'active' : ''}`}
          id="users"
          onClick={categorizeResultsHandler}
        >
          Users
        </button>
        <button
          className={`button ${categorization.places ? 'active' : ''}`}
          id="places"
          onClick={categorizeResultsHandler}
        >
          Places
        </button>
      </div>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {results}
      {searchInput !== '' && categorization.users && (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={users.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
      {searchInput !== '' && categorization.places && (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={places.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
      {searchInput !== '' && categorization.all && (
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={users.length + places.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default SearchResults;
