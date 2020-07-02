
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import Moment from 'react-moment';
import dots from '../../shared/components/UIElements/icons/three dots.png';

import './Review.css';

function Review(props) {
	const auth = useContext(AuthContext);
	const [ showDropList, setShowDropList ] = useState(false);
	const date = props.date;
	const imageToRender = props.image[0] === 'h' ? props.image : `${process.env.REACT_APP_ASSET_URL}/${props.image}`;
	
	const canDelete = auth.userId === props.userId ? false : true;

	
	return (
		<React.Fragment>
			<div className="container">
				<div className="review">
					<img
						className="userImage"
						src={imageToRender || 'https://bit.ly/3f7YYNi'}
						alt={'user'}
					/>
					<p className="userName"> {props.creator ? props.creator.name : null}</p>
					<p className="reviewBody"> {props.reviewBody} </p>
					{showDropList && (
						<div className="dropList">
							<button
								disabled={canDelete}
								className={canDelete ? 'btn-notActive' : 'btn-active'}
								onClick={() => {
									props.deleteReview(props.id);
									setShowDropList(false);
								}}
							>
								Delete
							</button>
						</div>
					)}
					<img
						id="closeButton"
						src={dots}
						alt={'X'}
						onMouseEnter={() => {
							setShowDropList((prevState) => !prevState);
							setTimeout(() => {
								setShowDropList(false);
							}, 3000);
						}}
					/>
				</div>
				<Moment className="date" format="YYYY/MM/DD HH:mm">
					{date}
				</Moment>
			</div>
		</React.Fragment>
	);
}
export default Review;

