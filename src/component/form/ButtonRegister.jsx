import React, { Component } from "react";
import "./ButtonRegister.css";
import { withRouter } from "react-router-dom";

class ButtonRegister extends Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		this.props.history.push("/login");
	}

	render() {
		return (
			<button
				onClick={this.onClick}>
				<i className="fas fa-file-signature"/> Register your entity here
			</button>
		);
	}
}

export default withRouter(ButtonRegister);
