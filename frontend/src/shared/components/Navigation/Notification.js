import React, { useState, useEffect, useContext } from 'react';

import Avatar from '../UIElements/Avatar';
import Modal from '../UIElements/Modal';
import Button from '../FormElements/Button';
import ErrorModal from '../UIElements/ErrorModal';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import { NotifContext } from '../../context/notif-context';

import Badge from '@material-ui/core/Badge';
import Notifications from '@material-ui/icons/Notifications';

import './Notification.css';

function Notification() {
    const auth = useContext(AuthContext);
    const { setNotifFollower } = useContext(NotifContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [requestList, setRequestList] = useState([]);
    const [toRender, setTorender] = useState(false);

    useEffect(() => {
        const getFriendsRequest = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/friends/requests/${auth.userId}`
                );

                setRequestList(responseData.friendRequests);
            } catch (err) {}
        };
        getFriendsRequest();
    }, [sendRequest, auth.userId, toRender]);

    const acceptRequest = async (requesterUserId) => {
        try {
            await sendRequest(
                `http://localhost:5000/api/friends/requests/accept`,
                'PATCH',
                JSON.stringify({
                    userId: auth.userId,
                    friendId: requesterUserId,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                }
            );
            setNotifFollower((old) => old + 1);
            setTorender(!toRender);
        } catch (err) {}
    };

    const rejectRequest = async (requesterUserId) => {
        try {
            await sendRequest(
                `http://localhost:5000/api/friends/requests/reject`,
                'DELETE',
                JSON.stringify({
                    userId: auth.userId,
                    friendId: requesterUserId,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                }
            );
            setNotifFollower((old) => old + 1);
            setTorender(!toRender);
        } catch (err) {}
    };

    return (
        <>
            <div className="notif">
                <button
                    className="nav-links__button-not"
                    onClick={() => setShowLoginModal(true)}
                >
                    <Badge color="error" badgeContent={requestList.length}>
                        <abbr title="Notifications">
                            <Notifications className="nav-links__not" />
                        </abbr>
                    </Badge>
                </button>
            </div>
            <ErrorModal error={error} onClear={clearError} />

            <Modal
                className="scroll"
                show={showLoginModal}
                onCancel={() => setShowLoginModal(false)}
                footerClass="place-item__modal-actions"
                header="Friend Requests"
            >
                <div style={{ textAlign: 'center' }}>
                    {isLoading && <LoadingSpinner />}
                </div>

                {requestList.length > 0 ? (
                    requestList.map((request) => (
                        <li className="friendList" key={request.userId}>
                            <Avatar
                                image={request.image}
                                alt={request.name}
                                width="50px"
                            />
                            <p>
                                {request.name.charAt(0).toUpperCase() +
                                    request.name.slice(1) +
                                    ' '}
                                has sent you a friend request
                            </p>
                            <Button
                                inverse
                                onClick={() => {
                                    acceptRequest(request.userId);
                                }}
                            >
                                Confirm
                            </Button>
                            <Button
                                danger
                                onClick={() => {
                                    rejectRequest(request.userId);
                                }}
                            >
                                Reject
                            </Button>
                        </li>
                    ))
                ) : (
                    <p>No Friend Request</p>
                )}
            </Modal>
        </>
    );
}

export default Notification;
