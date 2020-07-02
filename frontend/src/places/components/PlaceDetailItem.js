import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { faShareAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookSquare,
  faTwitterSquare,
  faPinterestSquare,
} from '@fortawesome/free-brands-svg-icons'

import Card from '../../shared/components/UIElements/Card'
import Modal from '../../shared/components/UIElements/Modal'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'

import './PlaceDetailItem.css'

const PlaceDetailItem = (props) => {
  const [showShareModal, setShowShareModal] = useState(false)

  const { description } = props
  const url = window.document.location.href

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `${props.title}`,
        text: `${props.title} is a great place to visit`,
        url: url,
      })
    } else {
      setShowShareModal(true)
    }
  }
  const closeShowHandler = () => setShowShareModal(false)

  const shareOnFacebook = () => {
    setShowShareModal(false)
    return false
  }

  const shareOnTwitter = () => {
    window.open(
      `http://www.twitter.com/share?u=${url}&via=PlaceSharer&text=${description}`,
      'Twitter Share',
      'width=620, height=620'
    )
    setShowShareModal(false)
    return false
  }

  const shareOnPinterest = () => {
    setShowShareModal(false)
  }

  return (
    <React.Fragment>
      <Helmet>
        <meta property="og:type" content="Social Media APP" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={props.image} />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:site" content={'PlaceSharer'} />
      </Helmet>
      <ErrorModal error={props.error} onClear={props.clearError} />
      <Modal
        show={showShareModal}
        onCancel={closeShowHandler}
        header={'Share place on social media'}
      >
        <div className="place-item__actions">
          <div className="share-button-container">
            <div
              className="share-icon fb-share-button"
              data-href="http://localhost:3000/places/5eedf3e0a5f4a1c34519c8d9/5eee37b7bc24faca4cc36452/"
              data-layout="button_count"
              data-size="small"
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.facebook.com/sharer/sharer.php?u=${url}&amp;src=sdkpreparse`}
                class="fb-xfbml-parse-ignore"
              >
                <FontAwesomeIcon
                  icon={faFacebookSquare}
                  color="#3b5998"
                  size="4x"
                  onClick={shareOnFacebook}
                />
              </a>
            </div>
            <div className="share-icon">
              <FontAwesomeIcon
                icon={faTwitterSquare}
                color="#38A1F3"
                size="4x"
                onClick={shareOnTwitter}
              />
            </div>

            <div className="share-icon">
              <a
                data-pin-do="buttonPin"
                href={`https://www.pinterest.com/pin/create/button/?url=${url}&media=${props.image}&description=${description}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faPinterestSquare}
                  color="#c8232c"
                  size="4x"
                  onClick={shareOnPinterest}
                />
              </a>
            </div>
          </div>
        </div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {props.isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <div className="title-block">
              <h2>{props.title}</h2>
              <div className="font-awesome__share" onClick={handleShareClick}>
                <FontAwesomeIcon icon={faShareAlt} size="2x" />
              </div>
            </div>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
        </Card>
      </li>
    </React.Fragment>
  )
}

export default PlaceDetailItem
