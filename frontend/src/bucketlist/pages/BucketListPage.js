import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BucketList from '../components/BucketList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Switch from '../../shared/components/FormElements/SwitchView';

const BucketListPage = () => {
	const [ loadedPlaces, setLoadedPlaces ] = useState();
	const [ nameOfListOwner, setNameOfListOnwer ] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const userId = useParams().userId;

	useEffect(
		() => {
			const fetchPlaces = async () => {
				try {
					const responseData = await sendRequest(
						`${process.env.REACT_APP_BACKEND_URL}/users/bucketlist/${userId}`
					);
					setLoadedPlaces(responseData.BucketList);
					setNameOfListOnwer(responseData.name);
				} catch (err) {}
			};
			fetchPlaces();
		},
		[ sendRequest, userId ]
	);

	const placeDeletedHandler = (deletedPlaceId) => {
		setLoadedPlaces((prevPlaces) => prevPlaces.filter((place) => place.id._id !== deletedPlaceId));
	};

	return (
		<React.Fragment>
		
			<div className="switchView">
			<Switch to={`/${userId}/bucketList`} className="toBucketList" size="middle" inverse>
				TO THIS USER'S BUCKET LIST
			</Switch>
			<Switch to={`/${userId}/bucketList`} className="toBucketListMobile" size="middle" inverse>
				TO THIS USER'S BUCKET LIST
			</Switch>
			<Switch to={`/${userId}/places`} className="toPlaceList" size="middle" >
				TO THIS USER'S PLACE LIST
			</Switch>
			<Switch to={`/${userId}/places`} className="toPlaceListMobile" size="middle" >
				TO THIS USER'S PLACE LIST
			</Switch>
			</div>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner />
				</div>
			)}
			{!isLoading &&
			loadedPlaces && (
				<BucketList
					items={loadedPlaces}
					onDeletePlace={placeDeletedHandler}
					userId={userId}
					nameOfListOwner={nameOfListOwner}
				/>
			)}
		</React.Fragment>
	);
};

export default BucketListPage;
