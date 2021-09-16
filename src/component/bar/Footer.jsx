import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { getMainAppURL, getPrivateSpaceURL } from "../../utils/env.jsx";

export default class Footer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	// eslint-disable-next-line class-methods-use-this
	render() {
		return (
			<div className="Footer">
				<div className="Footer-content">
					<div className="row">
						<div className="col-md-3">
							<div className="row">
								<div className="col-md-12">
									<div className="Footer-patronage">
										Under the High Patronage of the <br/><b>Ministry of the Economy</b>
									</div>
									<br/>
									<div className="Footer-title">KEY PARTNERS</div>
									<br/>
									<div className="Footer-alinea">
										<a
											href="https://hcpn.gouvernement.lu/en.html"
											rel="noreferrer"
											target="_blank"
											title="HCPN">
											High Commission for National Protection
										</a>
									</div>
									<br/>
									<div className="Footer-alinea">
										<a
											href="https://securitymadein.lu/"
											rel="noreferrer"
											target="_blank"
											title="SECURITYMADEIN.LU GIE"
											className="text-capitalize">
											SECURITYMADEIN.LU
										</a>
									</div>
									<br/>
									<div className="Footer-alinea">
										<a
											href="https://www.luxinnovation.lu/"
											rel="noreferrer"
											target="_blank"
											title="LUXINNOVATION GIE"
											className="text-capitalize">
											Luxinnovation
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<div className="Footer-title">MENU</div>

							<div className="row">
								<div className="col-md-6">
									<div>
										<a
											href={getMainAppURL()}
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											Home
										</a>
									</div>
									<br/>
									<div>
										<a
											href={getMainAppURL() + "strategy"}
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											Strategy
										</a>
									</div>
									<br/>
									<div>
										<a
											href={getMainAppURL() + "news"}
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											What&apos;s up?
										</a>
									</div>
									<div>
										<a
											href={getMainAppURL() + "calendar"}
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											Where to meet?
										</a>
									</div>
									<div>
										<a
											href={getMainAppURL() + "marketplace"}
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											Job marketplace
										</a>
									</div>
									<br/>
									<div>
										<a
											href={getMainAppURL() + "about"}
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											About
										</a>
									</div>
									<div>
										<a
											href={getPrivateSpaceURL()}
											rel="noreferrer"
											target="_blank">
											My CYBERLUX
										</a>
									</div>
								</div>

								<div className="col-md-6">
									<div><b>Ecosystem</b></div>
									<br/>
									<div className="Footer-alinea">
										<a
											href="https://www.c-3.lu/"
											rel="noreferrer"
											target="_blank">
											<Link to="/">Home</Link>
										</a>
									</div>
									<br/>
									<div className="Footer-alinea">
										<a
											href="https://www.circl.lu/"
											rel="noreferrer"
											target="_blank">
											<Link to="/privatesector">Private sector</Link>
										</a>
									</div>
									<div className="Footer-alinea">
										<a
											href="https://www.c-3.lu/"
											rel="noreferrer"
											target="_blank">
											<Link to="/publicsector">Public sector</Link>
										</a>
									</div>
									<div className="Footer-alinea">
										<a
											href="https://www.c-3.lu/"
											rel="noreferrer"
											target="_blank">
											<Link to="/civilsociety">Civil society</Link>
										</a>
									</div>
									<br/>
									<div className="Footer-alinea">
										<a
											href="https://www.c-3.lu/"
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											<Link to="/dashboard">Dashboard</Link>
										</a>
									</div>
									<div className="Footer-alinea">
										<a
											href="https://www.c-3.lu/"
											rel="noreferrer"
											target="_blank"
											className="text-capitalize">
											<Link to="/map">Map</Link>
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-3 Footer-contact">
							<div className="Footer-title">CONTACT</div>

							<div>SECURITYMADEIN.LU g.i.e.</div>
							<div>16, boulevard d&#39;Avranches</div>
							<div>L-1160 Luxembourg</div>
							<br/>
							<div>(+352) 274 00 98 601</div>
							<div>
								<a href="mailto:info@cybersecurity-luxembourg.com">info@cybersecurity-luxembourg.com</a>
							</div>
							<br/>
							<div>Copyright © SECURITYMADEIN.LU g.i.e 2021</div>
						</div>
						<div className="col-md-2">
							<div className="Footer-network">
								<a
									href="https://twitter.com/cyberluxembourg"
									rel="noreferrer"
									target="_blank"
									title="Twitter CYBERLUX"
									className="text-capitalize">
									<i className="fab fa-twitter Footer-network"/>
								</a>
								<a
									href="https://www.linkedin.com/company/cybersecurity-luxembourg/"
									rel="noreferrer"
									target="_blank"
									title="LinkedIn CYBERLUX"
									className="text-capitalize">
									<i className="fab fa-linkedin-in Footer-network"/>
								</a>
								<a
									href="https://github.com/CybersecLux/"
									rel="noreferrer"
									target="_blank"
									title="GitHub CyberLux"
									className="text-capitalize">
									<i className="fab fa-github-alt Footer-network"/>
								</a>
							</div>
							<div className="Footer-documentation-and-terms">
								<a
									href="/pdf/Documentation of the CYBERSECURITY Luxembourg website_release_v1.4.pdf"
									rel="noreferrer"
									target="_blank"
									title="How to use the portal?"
									className="text-capitalize">
									<i className="fas fa-book"/> How to use the portal?
								</a>
								<a
									href={"/pdf/2021-07-08 - Terms of Use CYBERLUX.pdf"}
									rel="noreferrer"
									target="_blank"
									title="Terms of use"
									className="text-capitalize">
									<i className="fas fa-gavel"/> Terms of use
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
