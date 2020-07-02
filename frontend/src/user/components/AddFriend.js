import React, { useState, useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const AddFriend = ({ receivedRequestId, getRequests, sentRequests }) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [getRequest, setGetRequest] = useState(
    getRequests.some((request) => request.user === auth.userId)
  );
  const [sentRequest] = useState(
    sentRequests.some((request) => request.user === auth.userId)
  );

  const makeRequest = async () => {
    setGetRequest(true);

    try {
      await sendRequest(
        `http://localhost:5000/api/friends/`,
        "PATCH",
        JSON.stringify({
          userId: auth.userId,
          friendId: receivedRequestId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };
  const cancelRequest = async () => {
    setGetRequest(false);

    try {
      await sendRequest(
        `http://localhost:5000/api/friends/requests/reject`,
        "DELETE",
        JSON.stringify({
          userId: receivedRequestId,
          friendId: auth.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <>
        {auth.userId !== receivedRequestId ? (
          getRequest && !sentRequest ? (
            <button className="button--danger" onClick={cancelRequest}>
              {isLoading ? <LoadingSpinner /> : "Requested"}
            </button>
          ) : (
            <button className="button--turquoise" onClick={makeRequest}>
              {isLoading ? <LoadingSpinner /> : "Add Friend"}
            </button>
          )
        ) : (
          <p>My Profile</p>
        )}
      </>
    </>
  );
};

export default AddFriend;
