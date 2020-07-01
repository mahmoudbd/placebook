import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import Avatar from '../../shared/components/UIElements/Avatar';
import Modal from '../../shared/components/UIElements/Modal';
import { AuthContext } from '../../shared/context/auth-context';

const FriendListItem = (props) => {
	const auth = useContext(AuthContext);
	const [ isModalOpen, setIsModalOpen ] = useState(false);
	const [ friendName, setFriendName ] = useState('');

	const closeModal = () => {
		setIsModalOpen(false);
	};
	const onConfirm = () => {
		props.deleteFriend(auth.userId, props.id);
		setIsModalOpen(false);
	};
	return (
		<React.Fragment>
			<li className="friend-item">
				<Card className="friend-item__content">
					<Link to={`/${props.id}/places`}>
						<div className="friend-item__image">
							<Avatar image={`${props.image}`} alt={props.name} />
						</div>
						<div className="friend-item__info">
							<h2>{props.name}</h2>
							<h3>
								{props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
							</h3>
						</div>
					</Link>
					<div className="friend-item__button">
						<Button
							onClick={() => {
								setFriendName(props.name);
								setIsModalOpen(true);
							}}
						>
							DELETE
						</Button>
					</div>
				</Card>
			</li>
			<Modal show={isModalOpen} header="Are you sure?" onCancel={closeModal}>
				<p> Are you sure you want to remove {friendName} as your friend? </p>
				<div className="right-aligned">
					<Button inverse onClick={closeModal}>
						Cancel
					</Button>
					<Button onClick={onConfirm}> Confirm </Button>
				</div>
			</Modal>
		</React.Fragment>
	);
};

export default FriendListItem;
