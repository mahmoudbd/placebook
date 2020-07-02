import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { useHttpClient } from '../../shared/hooks/http-hook'
import PlaceDetailItem from '../components/PlaceDetailItem'
import './PlaceDetail.css'

const PlaceDetail = () => {
  const { placeId } = useParams()
  const [loadedPlace, setLoadedPlace] = useState(null)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        )
        setLoadedPlace(responseData.place)
      } catch (err) {}
    }
    fetchPlace()
  }, [sendRequest, placeId])

  return (
    <React.Fragment>
      {loadedPlace && (
        <Helmet>
          <meta property="og:type" content="Social Media APP" />
          <meta property="og:title" content={loadedPlace.title} />
          <meta property="og:description" content={loadedPlace.description} />
          <meta property="og:image" content={loadedPlace.image} />
        </Helmet>
      )}
      <div className="placeDetail-container">
        {loadedPlace && (
          <PlaceDetailItem
            key={loadedPlace.id}
            id={loadedPlace.id}
            image={loadedPlace.image}
            title={loadedPlace.title}
            description={loadedPlace.description}
            address={loadedPlace.address}
            creatorId={loadedPlace.creator}
            coordinates={loadedPlace.location}
            error={error}
            isLoading={isLoading}
            clearError={clearError}
          />
        )}
      </div>
    </React.Fragment>
  )
}

export default PlaceDetail
