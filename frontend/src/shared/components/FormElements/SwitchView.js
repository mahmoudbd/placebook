import React from 'react';
import { Link } from 'react-router-dom';

import './SwitchView.css';

const Switch = (props) => {
	if (props.href) {
		return (
			<a
				className={`switch switch--${props.size || 'default'} ${props.inverse &&
					'switch--inverse'} ${props.danger && 'switch--danger'}`}
				href={props.href}
			>
				{props.children}
			</a>
		);
	}
	if (props.to) {
		return (
			<Link
				to={props.to}
				exact={props.exact}
				className={`switch switch--${props.size || 'default'} ${props.inverse &&
					'switch--inverse'} ${props.white && 'switch--white'} ${props.className}`}
				onClick={props.onClick}
			>
				{props.children}
			</Link>
		);
	}
	return (
		<button
			className={`switch button--${props.size || 'default'} ${props.inverse &&
				'switch--inverse'} ${props.danger && 'switch--danger'}`}
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			{props.children}
		</button>
	);
};

export default Switch;
