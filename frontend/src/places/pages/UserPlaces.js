import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { SearchContext } from "../../shared/context/search-context";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Switch from "../../shared/components/FormElements/SwitchView";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./UserPlaces.css";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [userPlaces, setUserPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { inputHandler } = useContext(SearchContext);

  useEffect(() => {
    inputHandler("search", "", false);
  }, [inputHandler]);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );

        setLoadedPlaces(responseData.places);
        setUserPlaces(responseData.name);
      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <div className='userPlaces-container'>
      <div className="switchView">
        <Switch
          to={`/${userId}/bucketList`}
          className="toBucketList"
          size="middle"
        >
          TO THIS USER'S BUCKET LIST
        </Switch>
        <Switch
          to={`/${userId}/bucketList`}
          className="toBucketListMobile"
          size="middle"
        >
          TO THIS USER'S BUCKET LIST
        </Switch>
        <Switch
          to={`/${userId}/places`}
          className="toPlaceList"
          size="middle"
          inverse
        >
          TO THIS USER'S PLACE LIST
        </Switch>
        <Switch
          to={`/${userId}/places`}
          className="toPlaceListMobile"
          size="middle"
          inverse
        >
          TO THIS USER'S PLACE LIST
        </Switch>
      </div>

      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList
          items={loadedPlaces}
          userPlaces={userPlaces}
          onDeletePlace={placeDeletedHandler}
        />
      )}
      </div>
    </React.Fragment>
  );
};

export default UserPlaces;
