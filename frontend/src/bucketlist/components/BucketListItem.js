import React, { useState, useContext } from 'react'

import Card from '../../shared/components/UIElements/Card'
import Button from '../../shared/components/FormElements/Button'
import Modal from '../../shared/components/UIElements/Modal'
import Map from '../../shared/components/UIElements/Map'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttpClient } from '../../shared/hooks/http-hook'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { faCheckSquare as faCheckSquareS } from '@fortawesome/free-solid-svg-icons'

import './BucketListItem.css'

const BucketListItem = (props) => {
  const ownerId = props.ownerId
  const isVisited = props.isVisited

  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const auth = useContext(AuthContext)

  const [showMap, setShowMap] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [visited, setVisited] = useState(isVisited)
  const [showVisitedModal, setShowVisitedModal] = useState(false)
  const [showCancelVisitedModal, setShowCancelVisitedModal] = useState(false)

  const [showAddedModal, setShowAddedModal] = useState(false)
  const [PlaceAdded, setPlaceAdded] = useState(false)

  const openMapHandler = () => setShowMap(true)

  const closeMapHandler = () => setShowMap(false)

  const addToBucketListHandler = async () => {
    setShowAddedModal(true)
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketList/${props.id}`,
        'PATCH',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      )
      setPlaceAdded(true)
    } catch (err) {}
  }

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true)
  }

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false)
  }

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      )
      props.onDelete(props.id)
    } catch (err) {}
  }

  const visitHandler = async () => {
    setVisited(true)
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${props.id}`,
        'PUT',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      )
      setShowVisitedModal(true)
    } catch (err) {}
  }

  const okHandler = () => {
    setShowVisitedModal(false)
    setShowCancelVisitedModal(false)
    setShowAddedModal(false)
  }

  const cancelVisitHandler = async () => {
    setVisited(false)
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${props.id}`,
        'PUT',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      )
      setShowCancelVisitedModal(true)
    } catch (err) {}
  }

  return (
    <React.Fragment>
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

      {!visited && (
        <Modal
          show={showCancelVisitedModal}
          header={props.address}
          contentClass="place-item__modal-content"
          footerClass="place-item__modal-actions"
          footer={<Button onClick={okHandler}>Okay</Button>}
        >
          <p>Place set to unvisited.</p>
        </Modal>
      )}

      {visited && (
        <Modal
          show={showVisitedModal}
          header={props.address}
          contentClass="place-item__modal-content"
          footerClass="place-item__modal-actions"
          footer={<Button onClick={okHandler}>Okay</Button>}
        >
          <p>Place set to visited.</p>
        </Modal>
      )}

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
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
            <h5>{`Created By ${props.name}`}</h5>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>

            {auth.userId === ownerId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}

            {auth.isLoggedIn && ownerId !== auth.userId && (
              <Button inverse onClick={addToBucketListHandler}>
                ADD TO MY BUCKET LIST
              </Button>
            )}

            {!auth.isLoggedIn && (
              <Button inverse onClick={addToBucketListHandler}>
                ADD TO MY BUCKET LIST
              </Button>
            )}

            {auth.userId === ownerId && !visited && (
              <div className="checkBox">
                <h3>I've been there: </h3>
                <FontAwesomeIcon
                  icon={faCheckSquare}
                  size="2x"
                  className="visit"
                  onClick={visitHandler}
                />
              </div>
            )}
            {auth.userId === ownerId && visited && (
              <div className="checkBox">
                <h3>I've been there: </h3>
                <FontAwesomeIcon
                  icon={faCheckSquareS}
                  size="2x"
                  className="visited"
                  onClick={cancelVisitHandler}
                />
              </div>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  )
}

export default BucketListItem
