import React, { Component } from "react";
import "./Request.css";
import { NotificationManager as nm } from "react-notifications";
import _ from "lodash";
import dompurify from "dompurify";
import { postRequest } from "../../utils/request.jsx";

export default class Request extends Component {
	constructor(props) {
		super(props);

		this.delete = this.delete.bind(this);
		this.getPrettyRequestContent = this.getPrettyRequestContent.bind(this);

		this.state = {
		};
	}

	delete() {
		const params = {
			id: this.props.info.id,
		};

		postRequest.call(this, "privatespace/delete_my_request", params, () => {
			if (this.props.afterDelete !== undefined) {
				this.props.afterDelete();
			}

			nm.info("The request has been deleted");
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	getPrettyRequestContent() {
		if (this.props.info === undefined
			|| this.props.info === null
			|| this.props.info.request === undefined
			|| this.props.info.request === null) {
			return "No content";
		}

		let request = _.cloneDeep(this.props.info.request);

		const matches = request.match(/\{([^]+)\}/g);
		console.log(matches);
		if (matches !== null) {
			request = matches.reduce((json, match) => {
				console.log();
				return json.replace(
					match,
					match
						.replaceAll("\"", "")
						.replaceAll("[", "")
						.replaceAll("]", "")
						.replaceAll(/{\n/g, "\n")
						.replaceAll(/}(,)?(\n)?/g, "\n")
						.replaceAll(",\n", "\n"),
				);
			}, request);
		}

		console.log(request);

		return dompurify.sanitize(
			request
				.replaceAll("\n\n", "\n", "g")
				.replaceAll("\n", "<br />", "g"),
		);
	}

	render() {
		return (
			<div className="Request card">
				<div className="card-horizontal">
					<div className="card-body">
						<div className="card-date">{this.props.info.submission_date}</div>
						<div className="card-type">STATUS: {this.props.info.status}</div>
						<p className="card-text">
							<div dangerouslySetInnerHTML={
								{
									__html:
									this.getPrettyRequestContent(),
								}
							}/>
						</p>
						<button
							className={"red-background"}
							onClick={this.delete}
							disabled={this.props.info.link === null}
						>
							<i className="fas fa-trash-alt"/> Delete the request
						</button>
					</div>
				</div>
			</div>
		);
	}
}
