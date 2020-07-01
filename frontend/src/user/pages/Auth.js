import React, { useState, useContext } from 'react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
	const auth = useContext(AuthContext);

	const [ isLoginMode, setIsLoginMode ] = useState(true);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [ formState, inputHandler, setFormData ] = useForm(
		{
			email: {
				value: '',
				isValid: false
			},
			password: {
				value: '',
				isValid: false
			}
		},
		false
	);

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
					image: undefined
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: '',
						isValid: false
					},
					image: {
						value: null,
						isValid: false
					}
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	const authSubmitHandler = async (event) => {
		event.preventDefault();
		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/users/login`,
					'POST',
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value
					}),
					{
						'Content-Type': 'application/json'
					}
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		} else {
			try {
				const formData = new FormData();
				formData.append('email', formState.inputs.email.value);
				formData.append('name', formState.inputs.name.value);
				formData.append('password', formState.inputs.password.value);
				formData.append('image', formState.inputs.image.value);
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/users/signup`,
					'POST',
					formData
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		}
	};

	const fbLoginHandler = async (response) => {
		let pic;
		try {
			pic = response.picture.data.url;
		} catch (err) {}

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/socialMedia/login`,
					'POST',
					JSON.stringify({
						email: response.email,
						password: response.userID
					}),
					{
						'Content-Type': 'application/json'
					}
				);

				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		} else {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/socialMedia/signup`,
					'POST',
					JSON.stringify({
						image: pic,
						name: response.name,
						email: response.email,
						password: response.userID
					}),
					{
						'Content-Type': 'application/json'
					}
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		}
	};

	const responseGoogle = async (response) => {
		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/socialMedia/login`,
					'POST',
					JSON.stringify({
						email: response.profileObj.email,
						password: response.profileObj.googleId
					}),
					{
						'Content-Type': 'application/json'
					}
				);

				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		} else {
			try {
				const responseData = await sendRequest(
					`${process.env.REACT_APP_BACKEND_URL}/socialMedia/signup`,
					'POST',
					JSON.stringify({
						image: response.profileObj.imageUrl,
						name: response.profileObj.name,
						email: response.profileObj.email,
						password: response.profileObj.googleId
					}),
					{
						'Content-Type': 'application/json'
					}
				);
				auth.login(responseData.userId, responseData.token);
			} catch (err) {}
		}
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card className="authentication">
				{isLoading && <LoadingSpinner asOverlay />}
				{isLoginMode ? <h2>LOGIN</h2> : <h2>SIGN UP</h2>}
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							element="input"
							id="name"
							type="text"
							label="Your Name"
							validators={[ VALIDATOR_REQUIRE() ]}
							errorText="Please enter a name."
							onInput={inputHandler}
						/>
					)}
					{!isLoginMode && (
						<ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image." />
					)}
					<Input
						element="input"
						id="email"
						type="email"
						label="E-Mail"
						validators={[ VALIDATOR_EMAIL() ]}
						errorText="Please enter a valid email address."
						onInput={inputHandler}
					/>
					<Input
						element="input"
						id="password"
						type="password"
						label="Password"
						validators={[ VALIDATOR_MINLENGTH(6) ]}
						errorText="Please enter a valid password, at least 6 characters."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? 'LOGIN' : 'SIGNUP'}
					</Button>
					<pre />
					<FacebookLogin
						appId="288763052265295"
						fields="name,email,picture"
						onClick={fbLoginHandler}
						callback={fbLoginHandler}
						cssClass="my-facebook-button-class"
					/>
					<pre />
					<GoogleLogin
						clientId="524135467780-l6ng9s692tp2le5iidlardar8uo34ull.apps.googleusercontent.com"
						render={(renderProps) => (
							<button
								className="my-google-button-class"
								onClick={renderProps.onClick}
								disabled={renderProps.disabled}
							>
								LOGIN WITH GOOGLE
							</button>
						)}
						//buttonText="Login using Google"
						onSuccess={responseGoogle}
						onFailure={responseGoogle}
						cookiePolicy={'single_host_origin'}
					/>
				</form>
				<Button inverse onClick={switchModeHandler}>
					SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
