import React, { useState, useContext, useEffect } from 'react';

import Review from './Review';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './ReviewList.css';

function ReviewList(props) {
	const auth = useContext(AuthContext);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const userId = auth.userId;
	const placeId = props.placeId;
	const [ reviews, setReviews ] = useState();

	const [ updateReviews, setUpdateReviews ] = useState(0);
	const [ validInput, setValidInput ] = useState(true);
	const [ reviewInput, setReviewInput ] = useState();

	// gets all of the reviews of a place
	useEffect(
		() => {
			const fetchReviews = async () => {
				try {
					const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/reviews/${placeId}`);
					setReviews(responseData.reviews);
				} catch (err) {}
			};
			fetchReviews();
		},
		[ sendRequest, placeId, updateReviews ]
	);
	const inputHandler = (e) => {
		setReviewInput(e.target.value);
	};
	const reviewSubmitHandler = async (event) => {
		event.target.reset();
		reviewInput ? setValidInput(true) : setValidInput(false);
		if (validInput) {
			const reviewDate = new Date();
			try {
				await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/reviews/newReview`,
					'POST',
					JSON.stringify({
						date: reviewDate,
						userId: userId,
						placeId: placeId,
						reviewTxt: reviewInput
					}),
					{
						Authorization: 'Bearer ' + auth.token,
						'Content-Type': 'application/json'
					}
				);
			} catch (err) {}
			setUpdateReviews((prevState) => {
				return prevState + 1;
			});
		}
	};

	const deleteReview = async (deletedReviewId) => {
		setReviews((prevReview) => prevReview.filter((review) => review.id !== deletedReviewId));
		try {
			await sendRequest(
				`${process.env.REACT_APP_BACKEND_URL}/reviews/${deletedReviewId}/${userId}`,
				'DELETE',
				null,
				{
					Authorization: 'Bearer ' + auth.token
				}
			);
		} catch (err) {}
	};

	return (
		<React.Fragment>
			<h2>Comments</h2>
			<ErrorModal error={error} onClear={clearError} />
			{/* <img className="place-photo" src={props.placeUrl} alt={'the place '} /> */}
			{reviews ? (
				reviews.length === 0 && (
					<p>
						<strong>No reviews yet. Be the first to review! </strong>
					</p>
				)
			) : null}
			{reviews &&
				reviews.map((review) => (
					<Review
						key={review.id}
						id={review.id}
						deleteReview={deleteReview}
						image={review.creator? review.creator.image: null }
						reviewBody={review.reviewTxt}
						userId={review.userId}
						date={review.date}
						creator={review.creator}
					/>
				))}
			{isLoading && <LoadingSpinner asOverlay />}
			{auth.isLoggedIn && (
				<form onSubmit={reviewSubmitHandler}>
					<div className={`form-control`}>
						<input onChange={inputHandler} />
					</div>
					<Button inverse type="submit">
						POST REVIEW
					</Button>
				</form>
			)}
		</React.Fragment>
	);
}

export default ReviewList;
