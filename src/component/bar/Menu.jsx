import React from "react";
import "./Menu.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export default class Menu extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	// eslint-disable-next-line class-methods-use-this
	render() {
		return (
			<div className={"page max-sized-page"}>
				<Navbar expand="lg">
					<Navbar.Brand>
						<Link to="/">
							<img
								className={"Menu-logo"}
								src="/img/ecosystem-logo.jpg"
								alt="CYBERSECURITY LUXEMBOURG Logo"
							/>
						</Link>
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="Menu-left mr-sm-2 ml-auto">
							<Nav.Link className="Menu-item-blue">
								<Link to="/companies">
									<div className="Menu-title">Companies</div>
									<div className="Menu-description">Solution and service providers</div>
								</Link>
							</Nav.Link>
							<Nav.Link className="Menu-item-red">
								<Link to="/publicsector">
									<div className="Menu-title">Public sector</div>
									<div className="Menu-description">Authorities and regulators</div>
								</Link>
							</Nav.Link>
							<Nav.Link className="Menu-item-black">
								<Link to="/civilsociety">
									<div className="Menu-title">Civil society</div>
									<div className="Menu-description">Collective strengths</div>
								</Link>
							</Nav.Link>
						</Nav>
						<Nav className="Menu-right mr-sm-2 ml-auto">
							<Nav.Link eventKey="4.1">
								<Link to="/ecosystem">
									<div className={"Menu-image"}>
										<img src="/img/network.svg" viewBox="0 0 20 20"/>
									</div>
									<div className={"Menu-image-text"}>
										<div className="Menu-title">Ecosystem</div>
										<div className="Menu-description">Global view</div>
									</div>
								</Link>
							</Nav.Link>
							<Nav.Link eventKey="4.1">
								<Link to="/map">
									<div className={"Menu-image"}>
										<img src="/img/luxembourg.png" viewBox="0 0 20 20"/>
									</div>
									<div className={"Menu-image-text"}>
										<div className="Menu-title">Map</div>
										<div className="Menu-description">Geographic view</div>
									</div>
								</Link>
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="Menu-top-right mr-sm-2 ml-auto">
							<Nav.Link eventKey="4.1">
								<Link to="/about">
									<div className="Menu-title">About</div>
									<div className="Menu-description">What is CYBERLUX</div>
								</Link>
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</div>
		);
	}
}
