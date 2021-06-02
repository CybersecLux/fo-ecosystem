import React, { Component } from "react";
import "./ButtonRegister.css";
import { getPrivateSpaceURL } from "../../utils/env.jsx";

export default class ButtonRegister extends Component {
	// eslint-disable-next-line class-methods-use-this
	render() {
		return (
			<a
				className="nav-link"
				href={getPrivateSpaceURL()}
				rel="noreferrer"
			>
				<button
					className="ButtonRegister">
					<i className="fas fa-file-signature"/> Register your entity here
				</button>
			</a>
		);
	}
}
