import React from "react";
import "./InsideApp.css";
import { Route, Switch } from "react-router-dom";
import { NotificationManager as nm } from "react-notifications";
import GovBar from "./bar/GovBar.jsx";
import Menu from "./bar/Menu.jsx";
import Footer from "./bar/Footer.jsx";
import PageHome from "./PageHome.jsx";
import PageAbout from "./PageAbout.jsx";
import PageEcosystem from "./PageEcosystem.jsx";
import PageCompanies from "./PageCompanies.jsx";
import PageMap from "./PageMap.jsx";
import PageCompany from "./PageCompany.jsx";
import PagePublic from "./PagePublic.jsx";
import PageCivilSociety from "./PageCivilSociety.jsx";
import { getRequest } from "../utils/request.jsx";

export default class InsideApp extends React.Component {
	constructor(props) {
		super(props);

		this.changeState = this.changeState.bind(this);

		this.state = {
			taxonomy: null,
		};
	}

	changeState(field, value) {
		this.setState({ [field]: value });
	}

	componentDidMount() {
		getRequest.call(this, "public/get_public_taxonomy", (data) => {
			this.setState({
				taxonomy: data,
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	render() {
		return (
			<div id="InsideApp">
				<GovBar/>
				<Route
					render={(props) => <Menu
						logged={this.state.logged}
						email={this.state.email}
						{...props}
					/>}
				/>
				<div id="InsideApp-content">
					<Switch>
						<Route
							path="/company/:id"
							render={(props) => <PageCompany {...props} taxonomy={this.state.taxonomy} />}
						/>
						<Route
							path="/companies"
							render={(props) => <PageCompanies {...props} taxonomy={this.state.taxonomy} />}
						/>
						<Route
							path="/publicsector"
							render={(props) => <PagePublic {...props} taxonomy={this.state.taxonomy} />}
						/>
						<Route
							path="/civilsociety"
							render={(props) => <PageCivilSociety {...props} taxonomy={this.state.taxonomy} />}
						/>
						<Route
							path="/about"
							render={(props) => <PageAbout {...props} />}
						/>
						<Route
							path="/ecosystem"
							render={(props) => <PageEcosystem {...props} taxonomy={this.state.taxonomy} />}
						/>
						<Route
							path="/map"
							render={(props) => <PageMap {...props} taxonomy={this.state.taxonomy}/>}
						/>

						<Route path="/" render={(props) => <PageHome {...props} />}/>
					</Switch>
				</div>
				<Footer/>
			</div>
		);
	}
}
