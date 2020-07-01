import React, { useEffect, useState, useContext } from "react";

import "../../index.css";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { SearchContext } from "../../shared/context/search-context";
import { NotifContext } from "../../shared/context/notif-context";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const { inputHandler } = useContext(SearchContext);
  const { notifFollower } = useContext(NotifContext);

  useEffect(() => {
    inputHandler("search", "", false);
  }, [inputHandler]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`
        );
        setLoadedUsers(responseData.users);

      } catch (err) {}
  };
    fetchUsers();
  }, [sendRequest, notifFollower]);

  
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
