import React from "react";
import "./Menu.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavDropdown } from "react-bootstrap";
import SearchField from "../form/SearchField.jsx";
import { getPrivateSpaceURL, getMainAppURL } from "../../utils/env.jsx";

export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	// eslint-disable-next-line class-methods-use-this
	getNavBar() {
		return <Nav className="mr-sm-2 ml-auto">
			<a className="nav-link" href={getMainAppURL() + "news"}>
				<div className="Menu-title">What&apos;s up?</div>
				<div className="Menu-description">Latest news</div>
			</a>
			<a className="nav-link" href={getMainAppURL() + "calendar"}>
				<div className="Menu-title">Where to meet?</div>
				<div className="Menu-description">Cybersecurity events</div>
			</a>
			{/* <a className="nav-link" href={getMainAppURL() + "strategy"}>
				<div className="Menu-title">National strategy</div>
				<div className="Menu-description">For a secure environment</div>
			</a> */}
			<NavDropdown
				title={
					<div>
						<div className="Menu-title">Ecosystem</div>
						<div className="Menu-description">View on the community</div>
					</div>
				}
				id="basic-nav-dropdown">
				<NavDropdown.Item href={"/"}>
					<div className="Menu-title">Ecosystem home</div>
				</NavDropdown.Item>
				<NavDropdown.Divider />
				<NavDropdown.Item href={"/privatesector"}>
					<div className="Menu-title">Private sector</div>
					<div className="Menu-description">Solution and service providers</div>
				</NavDropdown.Item>
				<NavDropdown.Item href={"/publicsector"}>
					<div className="Menu-title">Public sector</div>
					<div className="Menu-description">Authorities and regulators</div>
				</NavDropdown.Item>
				<NavDropdown.Item href={"/civilsociety"}>
					<div className="Menu-title">Civil society</div>
					<div className="Menu-description">Collective strengths</div>
				</NavDropdown.Item>
				<NavDropdown.Divider />
				<NavDropdown.Item href={"/dashboard"}>
					<div className={"Menu-image"}>
						<img src="/img/network.svg" viewBox="0 0 20 20"/>
					</div>
					<div className={"Menu-image-text"}>
						<div className="Menu-title">Dashboard</div>
						<div className="Menu-description">Global view</div>
					</div>
				</NavDropdown.Item>
				<NavDropdown.Item href={"/map"}>
					<div className={"Menu-image"}>
						<img src="/img/luxembourg.png"/>
					</div>
					<div className={"Menu-image-text"}>
						<div className="Menu-title">Map</div>
						<div className="Menu-description">Geographic view</div>
					</div>
				</NavDropdown.Item>
			</NavDropdown>
			{/* eslint-disable no-script-url */}
			<a href="javascript:;"
				className="nav-link nav-link-blue"
				onClick={() => this.props.ml_account("webforms", "3328240", "r1e0z6", "show")}>
				<div className="Menu-title"><i className="fas fa-envelope-open-text"/> Newsletter</div>
				<div className="Menu-description">Our monthly selection</div>
			</a>
		</Nav>;
	}

	// eslint-disable-next-line class-methods-use-this
	render() {
		return (
			<div className={"Menu page max-sized-page"}>
				<Navbar expand="lg">
					<Navbar.Brand>
						<a href={getMainAppURL()}>
							<img
								className={"Menu-logo"}
								src="/img/ecosystem-logo-subtitle.jpg"
								alt="CYBERSECURITY LUXEMBOURG Logo"
							/>
						</a>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						{this.getNavBar()}
					</Navbar.Collapse>
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="Menu-top-right-about mr-sm-2 ml-auto">
							<SearchField/>
							<a className="nav-link" href={getMainAppURL() + "about"}>
								<div className="Menu-title">About</div>
								<div className="Menu-description">What is CYBERLUX?</div>
							</a>
							<a
								className="nav-link"
								href={getPrivateSpaceURL()}
								rel="noreferrer"
							>
								<div className="Menu-title">My CYBERLUX</div>
								<div className="Menu-description">Login or subscribe</div>
							</a>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</div>
		);
	}
}
