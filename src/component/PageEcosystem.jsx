import React from "react";
import "./PageEcosystem.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import Message from "./box/Message.jsx";
import { getUrlParameter } from "../utils/url.jsx";

export default class PageEcosystem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			civilSociety: null,
			filters: {
				name: "",
				taxonomy_values: getUrlParameter("taxonomy_values") !== null
					? getUrlParameter("taxonomy_values").split(",").map((v) => parseInt(v, 10)) : [],
			},
		};
	}

	render() {
		return (
			<div className={"PageEcosystem page max-sized-page"}>
				<div className="row">
					<div className="col-md-12">
						<Breadcrumb>
							<Breadcrumb.Item><Link to="/">CYBERSECURITY LUXEMBOURG</Link></Breadcrumb.Item>
							<Breadcrumb.Item><Link to="/ecosystem">ECOSYSTEM</Link></Breadcrumb.Item>
						</Breadcrumb>
					</div>
				</div>

				<Message
					text={"Don't be too curious. I am working on it ;)" + this.state.filters.name}
					height={500}
				/>
			</div>
		);
	}
}
