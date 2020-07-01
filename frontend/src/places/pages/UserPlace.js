import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { SearchContext } from '../../shared/context/search-context';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';

const UserPlace = () => {
    const [loadedPlace, setLoadedPlace] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const { inputHandler } = useContext(SearchContext);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);
    const history = useHistory();
    useEffect(() => {
        inputHandler('search', '', false);
    }, [inputHandler]);

    const placeId = useParams().placeId;

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
                );
                setLoadedPlace([responseData.place]);
            } catch (err) {}
        };

        fetchPlace();
    }, [sendRequest, placeId]);

    const placeDeletedHandler = (deletedPlaceId) => {
        // setLoadedPlace((prevPlaces) =>
        //     prevPlaces.filter((place) => place.id !== deletedPlaceId)
        // );
        setShowDeleteMessage(true);
    };

    const clearDeleteMessageHandler = () => {
        setShowDeleteMessage(false);
        history.goBack();
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showDeleteMessage}
                header="Delete Notification"
                footer={
                    <Button onClick={clearDeleteMessageHandler}>Okay</Button>
                }
            >
                <p>Your Place is deleted!</p>
            </Modal>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlace && (
                <PlaceList
                    items={loadedPlace}
                    onDeletePlace={placeDeletedHandler}
                />
            )}
        </React.Fragment>
    );
};

export default UserPlace;
