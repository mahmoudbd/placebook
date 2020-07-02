import React, { Fragment } from 'react'

import Card from '../../shared/components/UIElements/Card'
import PlaceItem from './PlaceItem'
import Button from '../../shared/components/FormElements/Button'
import './PlaceList.css'

const PlaceList = ({ items, userPlaces, onDeletePlace, forSearchResults }) => {
  if (items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    )
  }

  return (
    <Fragment>
      <ul className="place-list">
        <h2 className={forSearchResults ? 'unvisibleHeader' : 'view-title'}>
          {userPlaces ? ` ${userPlaces}'s Places` : 'My Place'}
        </h2>
        {items.map((place) => (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={place.image}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            onDelete={onDeletePlace}
            rate={place.rate}
          />
        ))}
      </ul>
    </Fragment>
  )
}

export default PlaceList
