import React, { useState, useContext } from 'react'
import { Helmet } from 'react-helmet'


import StarRating from "../../shared/components/UIElements/StarRating";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ReviewList from './ReviewList';

import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [ showReviews, setShowReviews ] = useState(false);
	const [ showConfirmModal, setShowConfirmModal ] = useState(false);
	const [ showAddedModal, setShowAddedModal ] = useState(false);
	const [ PlaceAdded, setPlaceAdded ] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false)

	const openReviews = () => setShowReviews(true);
	const closeReviews = () => setShowReviews(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true)

  const addToBucketListHandler = async () => {
    setShowAddedModal(true);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketList/${props.id}`,
        "PATCH",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      setPlaceAdded(true);
    } catch (err) {}
  };

  const okHandler = () => {
    setPlaceAdded(false);
    setShowAddedModal(false);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      )
      props.onDelete(props.id)
    } catch (err) {}
  }

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:type" content="Social Media APP" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image} />
      </Helmet>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal className="reviewsModal" show={showReviews} onCancel={closeReviews} header={'Reviews'}>
				<div>
					<ReviewList
						placeUrl={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
						placeId={props.id}
						className="review-list"
					/>
				</div>
			</Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      {PlaceAdded && (
        <Modal
          show={showAddedModal}
          header={props.address}
          contentClass="place-item__modal-content"
          footerClass="place-item__modal-actions"
          footer={<Button onClick={okHandler}>Okay</Button>}
        >
          <p>Place added to your bucket list.</p>
        </Modal>
      )}

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}

          <div className="place-item__image">
            <img src={`${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <StarRating placeId={props.id} rate={props.rate} />
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>

            <Button to={`/places/${props.creatorId}/${props.id}/`}>
              DETAILS
            </Button>
            <Button onClick={openReviews}>REVIEWS</Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}

            {auth.userId !== props.creatorId && auth.isLoggedIn && (
              <Button inverse onClick={addToBucketListHandler}>
                ADD TO MY BUCKET LIST
              </Button>
            )}

            {!auth.isLoggedIn && (
              <Button inverse onClick={addToBucketListHandler}>
                ADD TO MY BUCKET LIST
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  )
}

export default PlaceItem
