import React from "react";
import "./Menu.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import SearchField from "../form/SearchField.jsx";
import { getPrivateSpaceURL, getMainAppURL } from "../../utils/env.jsx";

export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showFlyingMenu: false,
		};
	}

	componentDidMount() {
		document.querySelector("#root").addEventListener("scroll", () => {
			const currentScrollPos = document.getElementById("root").scrollTop;

			if (currentScrollPos !== undefined && currentScrollPos !== 0) {
				if (currentScrollPos > 300 && !this.state.showFlyingMenu) {
					this.setState({ showFlyingMenu: true });
				} else if (currentScrollPos < 300) {
					this.setState({ showFlyingMenu: false });
				}
			}
		});
	}

	// eslint-disable-next-line class-methods-use-this
	getNavBar() {
		return <Nav className="mr-sm-2 ml-auto">
			<Nav.Link href={getMainAppURL() + "strategy"}>
				<div className="Menu-title">Strategy</div>
				<div className="Menu-description">National commitment</div>
			</Nav.Link>
			<NavDropdown
				title={
					<div className="Menu-item">
						<div className="Menu-title">What&apos;s up?</div>
						<div className="Menu-description">News, events and jobs</div>
						<i className="fas fa-sort-down"/>
					</div>
				}
				id="basic-nav-dropdown">
				<NavDropdown.Item href={getMainAppURL() + "news"}>
					<div className="Menu-title">News</div>
				</NavDropdown.Item>
				<NavDropdown.Item href={getMainAppURL() + "calendar"}>
					<div className="Menu-title">Events</div>
				</NavDropdown.Item>
				<NavDropdown.Item href={getMainAppURL() + "marketplace"}>
					<div className="Menu-title">Jobs</div>
				</NavDropdown.Item>
			</NavDropdown>
			<NavDropdown
				title={
					<div className="Menu-item">
						<div className="Menu-title">Ecosystem</div>
						<div className="Menu-description">View on the community</div>
						<i className="fas fa-sort-down"/>
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
			<Nav.Link href={getMainAppURL() + "newsletter"}>
				<div className="Menu-title"><i className="fas fa-envelope-open-text"/> Newsletter</div>
				<div className="Menu-description">Our monthly selection</div>
			</Nav.Link>
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
								src="/img/National-platform-logo-subtitle.png"
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

				{this.state.showFlyingMenu
					&& <div className={"Menu-flying-menu-wrapper"}>
						<div className="Menu-flying-menu max-sized-page">
							<Link to="/">
								<img
									className="logo"
									src="/img/ecosystem-logo.jpg"
									alt="CYBERLUX Logo"
								/>
							</Link>
							<div className="navbar navbar-nav">
								{this.getNavBar()}
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}
