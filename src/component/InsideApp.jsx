import React from "react";
import "./InsideApp.css";
import { Route, Switch } from "react-router-dom";
import { NotificationManager as nm } from "react-notifications";
import GovBar from "./bar/GovBar.jsx";
import Menu from "./bar/Menu.jsx";
import Footer from "./bar/Footer.jsx";
import PageHome from "./PageHome.jsx";
import PageAbout from "./PageAbout.jsx";
import PageDashboard from "./PageDashboard.jsx";
import PagePrivateSector from "./PagePrivateSector.jsx";
import PageMap from "./PageMap.jsx";
import PageCompany from "./PageCompany.jsx";
import PagePublic from "./PagePublic.jsx";
import PageCivilSociety from "./PageCivilSociety.jsx";
import PageLogin from "./PageLogin.jsx";
import PagePrivateSpace from "./PagePrivateSpace.jsx";
import PageSearch from "./PageSearch.jsx";
import { getRequest } from "../utils/request.jsx";

export default class InsideApp extends React.Component {
	constructor(props) {
		super(props);

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.changeState = this.changeState.bind(this);

		this.state = {
			taxonomy: null,
			logged: false,
			email: null,
		};
	}

	componentDidMount() {
		getRequest.call(this, "privatespace/is_logged", (data) => {
			if (data !== null) {
				this.setState({
					logged: data.is_logged,
					email: data.email,
				});
			}
		}, () => {
		}, () => {
		});

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

	login(token, email) {
		// import { withCookies } from "react-cookie";
		// TODO
		// this.props.cookies.set('access_token_cookie', token/*, { httpOnly: true }*/);
		window.token = token;

		this.setState({
			logged: true,
			email,
		});
	}

	logout() {
		// TODO
		// this.props.cookies.remove('access_token_cookie');
		window.token = undefined;

		this.setState({
			logged: false,
			email: null,
		});
	}

	changeState(field, value) {
		this.setState({ [field]: value });
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
							path="/privatesector"
							render={(props) => <PagePrivateSector {...props} taxonomy={this.state.taxonomy} />}
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
							path="/dashboard"
							render={(props) => <PageDashboard {...props} taxonomy={this.state.taxonomy} />}
						/>
						<Route
							path="/map"
							render={(props) => <PageMap {...props} taxonomy={this.state.taxonomy}/>}
						/>
						<Route
							path="/search"
							render={(props) => <PageSearch {...props} taxonomy={this.state.taxonomy}/>}
						/>
						<Route path="/login" render={(props) => <PageLogin
							login={this.login}
							{...props}
						/>}
						/>
						<Route path="/privatespace" render={(props) => <PagePrivateSpace
							logout={this.logout}
							{...props}
						/>}
						/>

						<Route path="/" render={(props) => <PageHome {...props} />}/>
					</Switch>
				</div>
				<Footer/>
			</div>
		);
	}
}
