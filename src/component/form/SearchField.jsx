import React, { Component } from "react";
import "./SearchField.css";
import { withRouter } from "react-router-dom";
import { getMainAppURL } from "../../utils/env.jsx";

class SearchField extends Component {
	constructor(props) {
		super(props);

		this.onValidation = this.onValidation.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onKeyDown = this.onKeyDown.bind(this);

		this.state = {
			originalValue: props.value === undefined ? null : props.value,
			value: props.value === undefined ? null : props.value,
		};
	}

	componentDidUpdate() {
		if (this.state.originalValue !== this.props.value) {
			this.setState({
				originalValue: this.props.value,
				value: this.props.value,
			});
		}
	}

	onValidation() {
		window.location.replace(getMainAppURL() + "search?r="
			+ (this.state.value === null ? "" : this.state.value));
	}

	onChange(value) {
		this.setState({ value });
	}

	onKeyDown(event) {
		if (event.keyCode === 13) {
			this.onValidation();
		}
	}

	render() {
		return (
			<div className="SearchField">
				<input
					value={this.state.value}
					onChange={(v) => this.onChange(v.target.value)}
					onKeyDown={this.onKeyDown}
				/>
				<button
					className={"small-button"}
					onClick={this.onValidation}>
					<i className="fas fa-search"/>
				</button>
			</div>
		);
	}
}

export default withRouter(SearchField);
