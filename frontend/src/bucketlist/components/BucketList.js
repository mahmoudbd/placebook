import React from 'react';
import Card from '../../shared/components/UIElements/Card';
import BucketListItem from './BucketListItem';

import './BucketList.css';

const BucketList = (props) => {
	const userId = props.userId;
	if (props.items.length === 0) {
		return (
			<div className="place-list center">
				<Card>
					<h2>No bucket list places found.</h2>
				</Card>
			</div>
		);
	}

	return (
		<ul className="place-list">
			<h2 className = "view-title">{` ${props.nameOfListOwner}'s Bucket List`}</h2>
			{props.items.map((place) => (
				<BucketListItem
					key={place.id._id}
					id={place.id._id}
					image={place.id.image}
					title={place.id.title}
					description={place.id.description}
					address={place.id.address}
					creatorId={place.id.creator}
					coordinates={place.id.location}
					ownerId={userId}
					onDelete={props.onDeletePlace}
					isVisited={place.isVisited}
					name={place.createdBy}
				/>
			))}
		</ul>
	);
};

export default BucketList;
