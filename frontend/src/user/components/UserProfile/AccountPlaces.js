import React, { useEffect, useState } from 'react'
import Card from '../../../shared/components/UIElements/Card'
import { Link, useParams } from 'react-router-dom'
import { useHttpClient } from '../../../shared/hooks/http-hook'
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner'
import Modal from '../../../shared/components/UIElements/Modal'
import Button from '../../../shared/components/FormElements/Button'

export default function AccountPlaces() {
  const userId = useParams().userId
  const [loadedPlaces, setLoadedPlaces] = useState()
  const [startFrom, setStartFrom] = useState(0)
  const [limitTo, setLimitTo] = useState(5)
  const [showPlaces, setShowPlaces] = useState()

  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        )

        setLoadedPlaces(responseData.places)

        await showUserHandler(responseData.places, startFrom, limitTo)
      } catch (err) {}
    }
    fetchPlaces()
  }, [sendRequest, userId, limitTo, startFrom])

  // const placeDeletedHandler = (deletedPlaceId) => {
  //     setLoadedPlaces((prevPlaces) =>
  //         prevPlaces.filter((place) => place.id !== deletedPlaceId)
  //     );
  // };

  let places

  if (showPlaces) {
    places = (
      <ul className="users-list">
        {showPlaces.map((place) => (
          <li key={place.id} className="user-item">
            <Card className="user-item__content">
              <Link to={`/${place.id}`}>
                <div className="user-item__info">
                  <h2>{place.title}</h2>
                </div>
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    )
  }

  const showUserHandler = (users, startFrom, limitTo) => {
    setShowPlaces(users.slice(startFrom, limitTo))
  }

  const loadMoreHandler = () => {
    setStartFrom(startFrom + 5)
    setLimitTo(limitTo + 5)
  }

  const loadPrevHandler = () => {
    setStartFrom(startFrom - 5)
    setLimitTo(limitTo - 5)
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      <Modal
        onCancel={clearError}
        header="An Error Occurred!"
        show={!!error}
        footer={<Button onClick={clearError}>Okay</Button>}
      >
        <p>{error}</p>
      </Modal>
      {!isLoading && loadedPlaces && (
        <Card className="profile-card">
          <h2>Places</h2>
          <hr />
          {places}
          {loadedPlaces.length > 5 && (
            <div>
              <Button
                className={'prev'}
                onClick={loadPrevHandler}
                disabled={limitTo < 6}
              >
                Prev
              </Button>
              <Button
                className={'next'}
                onClick={loadMoreHandler}
                disabled={limitTo >= loadedPlaces.length}
              >
                Next
              </Button>
            </div>
          )}
        </Card>
      )}
    </React.Fragment>
  )
}
