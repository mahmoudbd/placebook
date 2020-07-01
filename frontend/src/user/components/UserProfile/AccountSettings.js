import React, { useState, useEffect, useContext } from 'react';
import { useForm } from '../../../shared/hooks/form-hook';
import Card from '../../../shared/components/UIElements/Card';
import Avatar from '../../../shared/components/UIElements/Avatar';
import ImageUpload from '../../../shared/components/FormElements/ImageUpload';
import Button from '../../../shared/components/FormElements/Button';
import Input from '../../../shared/components/FormElements/Input';
import { useParams, useHistory } from 'react-router-dom';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../../shared/util/validators';
import { useHttpClient } from '../../../shared/hooks/http-hook';
import LoadingSpinner from '../../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../../shared/components/UIElements/Modal';
import { AuthContext } from '../../../shared/context/auth-context';

export default function AccountSettings() {
    const auth = useContext(AuthContext);
    const userId = useParams().userId;
    const [uploadCtrl, setUploadCtrl] = useState(false);
    const [loadedData, setLoadedData] = useState();
    const [getUpdateValue, setGetUpdateValue] = useState(0);
    const [deleteMessage, setDeleteMessage] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const history = useHistory();
    const [formState, inputHandler] = useForm(
        {
            name: {
                value: '',
                isValid: false,
            },
            email: {
                value: '',
                isValid: false,
            },
            image: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
            confirmPassword: {
                value: '',
                isValid: false,
            },
        },
        false
    );
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/profile/${userId}`
                );
                setLoadedData(responseData.user);
                console.log(responseData.user);
            } catch (err) {}
        };
        fetchUser();
    }, [sendRequest, userId, getUpdateValue]);

    const userUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            if (formState.inputs.email.isValid)
                formData.append('email', formState.inputs.email.value);
            if (formState.inputs.name.isValid)
                formData.append('name', formState.inputs.name.value);
            if (formState.inputs.image.isValid)
                formData.append('image', formState.inputs.image.value);
            if (
                formState.inputs.password.isValid &&
                formState.inputs.password.value ===
                    formState.inputs.confirmPassword.value
            )
                formData.append('password', formState.inputs.password.value);

            const responseData = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/profile/${userId}`,
                'PATCH',
                formData
            );
            setLoadedData(responseData.user);
            setGetUpdateValue(getUpdateValue + 1);
            setUploadCtrl(false);
        } catch (err) {}
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const cancelHandler = () => {
        setGetUpdateValue(getUpdateValue + 1);
    };
    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
                'DELETE',
                null,
                {
                    Authorization: 'Bearer ' + auth.token,
                }
            );
            setDeleteMessage(true);
        } catch (err) {}
    };

    const clearDeleteMessage = () => {
        setDeleteMessage(false);
        auth.logout();
        history.push('/');
    };

    return (
        <React.Fragment>
            {isLoading && <LoadingSpinner />}
            {!deleteMessage && (
                <Modal
                    onCancel={clearError}
                    header="An Error Occurred!"
                    show={!!error}
                    footer={<Button onClick={clearError}>Okay</Button>}
                >
                    <p>Could not loaded User Account Settings </p>
                </Modal>
            )}
            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button danger onClick={confirmDeleteHandler}>
                            DELETE
                        </Button>
                        <Button inverse onClick={cancelDeleteHandler}>
                            CANCEL
                        </Button>
                    </React.Fragment>
                }
            >
                <p>
                    Do you want to proceed and delete your profile? Please note
                    that it can't be undone thereafter.
                </p>
            </Modal>
            <Modal
                onCancel={clearError}
                header="Delete Notification"
                show={deleteMessage}
                footer={<Button onClick={clearDeleteMessage}>Okay</Button>}
            >
                <p>Your account is deleted!</p>
            </Modal>
            {!isLoading && loadedData && (
                <Card className="profile-card">
                    <h2>Profile</h2>
                    <hr />
                    <form
                        className="profile"
                        onSubmit={userUpdateSubmitHandler}
                    >
                        {!uploadCtrl && (
                            <Avatar
                                image={loadedData.image}
                                alt={loadedData.name}
                            />
                        )}
                        {uploadCtrl && (
                            <ImageUpload
                                center
                                id="image"
                                onInput={inputHandler}
                                errorText="Please provide an image."
                            />
                        )}
                        {!uploadCtrl && (
                            <Button
                                inverse
                                onClick={(e) => {
                                    e.preventDefault();
                                    setUploadCtrl(true);
                                }}
                            >
                                Change Photo
                            </Button>
                        )}
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name."
                            initialValue={loadedData.name}
                            onInput={inputHandler}
                            onBlur={true}
                        />

                        <Input
                            element="input"
                            id="password"
                            type="password"
                            label="Password"
                            validators={[VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter a valid password, at least 6 characters."
                            onInput={inputHandler}
                            placeholder="Enter your new password"
                            onBlur={true}
                        />
                        <Input
                            element="input"
                            id="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            validators={[VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter a valid password, at least 6 characters."
                            onInput={inputHandler}
                            placeholder="Confirm your new password "
                            onBlur={true}
                        />
                        <Input
                            element="input"
                            id="email"
                            type="email"
                            label="E-Mail"
                            validators={[VALIDATOR_EMAIL()]}
                            errorText="Please enter a valid email address."
                            initialValue={loadedData.email}
                            onInput={inputHandler}
                            onBlur={true}
                        />

                        <Button
                            type="submit"
                            disabled={
                                !(
                                    formState.inputs.name.isValid ||
                                    formState.inputs.email.isValid ||
                                    formState.inputs.image.isValid ||
                                    (formState.inputs.password.isValid &&
                                        formState.inputs.confirmPassword
                                            .isValid &&
                                        formState.inputs.password.value ===
                                            formState.inputs.confirmPassword
                                                .value)
                                )
                            }
                        >
                            SAVE
                        </Button>
                        <Button
                            inverse
                            type="button"
                            onClick={cancelHandler}
                            disabled={
                                !(
                                    formState.inputs.name.isValid ||
                                    formState.inputs.email.isValid ||
                                    formState.inputs.image.isValid ||
                                    formState.inputs.password.isValid
                                )
                            }
                        >
                            CANCEL
                        </Button>
                    </form>
                    <Button danger onClick={() => setShowConfirmModal(true)}>
                        DELETE ACCOUNT
                    </Button>
                </Card>
            )}
        </React.Fragment>
    );
}
