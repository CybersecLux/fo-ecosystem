import React from "react";
import "./DialogConfirmation.css";
import Popup from "reactjs-popup";

export default class DialogConfirmation extends React.Component {
	constructor(props) {
		super(props);

		this.afterConfirmation = this.afterConfirmation.bind(this);

		this.state = {
			open: false,
		};
	}

	afterConfirmation(close) {
		this.props.afterConfirmation();
		close();
	}

	render() {
		return (
			<Popup
				trigger={this.props.trigger}
				modal
				closeOnDocumentClick
				className={"DialogConfirmation"}
				open={this.state.open}
			>
				{(close) => (
					<div className={"DialogConfirmation-wrapper"}>
						<h2>{this.props.text}</h2>
						<div className={"bottom-right-buttons"}>
							<button
								className={"grey-background"}
								data-hover="Cancel"
								data-active=""
								onClick={close}>
								<span><i className="far fa-times-circle"/> Cancel</span>
							</button>
							<button
								data-hover="Yes"
								data-active=""
								onClick={() => this.afterConfirmation(close)}>
								<span><i className="far fa-check-circle"/> Yes</span>
							</button>
						</div>
					</div>
				)}
			</Popup>
		);
	}
}
