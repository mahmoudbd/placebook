import React from 'react';
import './Home-page.css';

import Avatar from '../UIElements/Avatar';
import Find from '../images/Find.png';
import Share from '../images/Share.png';
import Plan from '../images/Plan.png';

const HomePageText = () => {
	return (
		<div className="home-container">
			<h1> Placebook help you connect and share your places with people</h1>
			<div className="home-container__divAvatar">
				<div className="home-container__avatar">
					<Avatar image={Find} alt="" className="home-container__avatarImg" />
					<p>Find people and communicate with each other</p>
				</div>
				<div className="home-container__avatar">
					<Avatar image={Share} alt="" className="home-container__avatarImg" />
					<p>Share your experience with your friends</p>
				</div>
				<div className="home-container__avatar">
					<Avatar image={Plan} alt="" className="home-container__avatarImg" />
					<p>Plan your future trips</p>
				</div>
			</div>
		</div>
	);
};

export default HomePageText;
