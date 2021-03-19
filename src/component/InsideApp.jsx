import React from "react";
import "./InsideApp.css";
import { Route, Switch } from "react-router-dom";
import { NotificationManager as nm } from "react-notifications";
import Particles from "react-particles-js";
import GovBar from "./bar/GovBar.jsx";
import Menu from "./bar/Menu.jsx";
import Footer from "./bar/Footer.jsx";
import PageAbout from "./PageAbout.jsx";
import PageEcosystem from "./PageEcosystem.jsx";
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
				<Menu
					logged={this.state.logged}
					email={this.state.email}
				/>
				<div id="InsideApp-content">
					<Particles
						params={{
							particles: {
								number: {
									value: 50,
								},
								size: {
									value: 4,
								},
								color: {
									value: ["#009fe3", "#e40613"],
								},
								shape: {
									type: "images",
									stroke: {
										width: 0,
										color: "black",
									},
									images: [
										{
											src: "/favicon.ico",
											width: 1000,
											height: 1000,
										},
									],
								},
								move: {
									enable: true,
									speed: 0.2,
								},
								opacity: {
									value: 0.1,
									anim: {
										enable: false,
									},
								},
								line_linked: {
									enable: true,
									distance: 150,
									color: {
										value: "#000000",
									},
									opacity: 0.1,
									width: 1,
								},
							},
						}}
					/>
					<Switch>
						<Route
							path="/company/:id"
							render={(props) => <PageCompany {...props} taxonomy={this.state.taxonomy} />}
						/>
						<Route
							path="/cyberactors"
							render={(props) => <PageEcosystem {...props} taxonomy={this.state.taxonomy} />}
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
							path="/map"
							render={(props) => <PageMap {...props} taxonomy={this.state.taxonomy}/>}
						/>

						<Route path="/" render={(props) => <PageEcosystem {...props} />}/>
					</Switch>
				</div>
				<Footer/>
			</div>
		);
	}
}
