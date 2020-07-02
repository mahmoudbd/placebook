import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../shared/context/auth-context';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import AddFriend from './AddFriend';

import './UserItem.css';


const UserItem = (props) => {
	const { sentRequests, getRequests, friends } = props;
	const auth = useContext(AuthContext);
	const imageToRender = props.image[0] === 'h' ? props.image : `${process.env.REACT_APP_ASSET_URL}/${props.image}`;
	return (
		<li className="user-item">
			<Card className="user-item__content">
				<Link to={`/${props.id}/places`}>
					<div className="user-item__image">
						<Avatar image={imageToRender} alt={props.name} />
					</div>
					<div className="user-item__info">
						<h2>{props.name}</h2>
						<h3>
							{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
						</h3>
					</div>
				</Link>
				<div className="user-item__addfriend">
					{friends.some((friend) => friend.user === auth.userId) ? (
						<p>Friend</p>
					) : sentRequests.some((friend) => friend.user === auth.userId) ? (
						<p>Sent you a request</p>
					) : (
						<AddFriend receivedRequestId={props.id} getRequests={getRequests} sentRequests={sentRequests} />
					)}
				</div>
			</Card>
		</li>
	);
};

export default UserItem
