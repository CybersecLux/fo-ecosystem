import React from "react";
import "./PageHome.css";
import { NotificationManager as nm } from "react-notifications";
import Popup from "reactjs-popup";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Analytic from "./box/Analytic.jsx";
import { getRequest } from "../utils/request.jsx";
import RadarClickableTaxonomy from "./chart/RadarClickableTaxonomy.jsx";
import SearchField from "./form/SearchField.jsx";

export default class PageHome extends React.Component {
	constructor(props) {
		super(props);

		this.fetchAnalytics = this.fetchAnalytics.bind(this);
		this.getCounts = this.getCounts.bind(this);
		this.getValueChainDistribution = this.getValueChainDistribution.bind(this);
		this.getLeavesOfNode = this.getLeavesOfNode.bind(this);

		this.state = {
			analytics: null,
			privateSectorCount: null,
			publicSectorCount: null,
			civilSocietyCount: null,
			distribution: null,
		};
	}

	componentDidMount() {
		this.fetchAnalytics();
		this.getCounts();
		this.getValueChainDistribution();
	}

	fetchAnalytics() {
		getRequest.call(this, "public/get_public_analytics", (data) => {
			this.setState({
				analytics: data,
			}, () => {
				this.getValueChainDistribution();
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	getCounts() {
		getRequest.call(this, "public/get_public_companies"
			+ "?count=true&ecosystem_role=ACTOR&entity_type=PRIVATE SECTOR", (data) => {
			this.setState({
				privateSectorCount: data.count,
			});

			getRequest.call(this, "public/get_public_companies"
			+ "?count=true&entity_type=PUBLIC SECTOR", (data2) => {
				this.setState({
					publicSectorCount: data2.count,
				});

				getRequest.call(this, "public/get_public_companies"
					+ "?count=true&ecosystem_role=ACTOR&entity_type=CIVIL SOCIETY", (data3) => {
					this.setState({
						civilSocietyCount: data3.count,
					});
				}, (response) => {
					nm.warning(response.statusText);
				}, (error) => {
					nm.error(error.message);
				});
			}, (response) => {
				nm.warning(response.statusText);
			}, (error) => {
				nm.error(error.message);
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	getValueChainDistribution() {
		if (this.state.analytics
			&& this.state.analytics.taxonomy_values
			&& this.state.analytics.taxonomy_assignments) {
			const distribution = {};

			const values = this.state.analytics.taxonomy_values
				.filter((v) => v.category === "VALUE CHAIN");

			Promise.all(values.map((v) => this.fetchValueChainCount(v.id))).then((data) => {
				data.forEach((d, i) => {
					distribution[values[i].name] = {
						valueId: values[i].id,
						amount: d.count,
					};
				});

				this.setState({ distribution });
			});
		}
	}

	fetchValueChainCount(taxonomyValueId) {
		return new Promise((resolve) => getRequest.call(this, "public/get_public_companies"
			+ "?count=true&ecosystem_role=ACTOR"
			+ "&entity_type=PRIVATE SECTOR"
			+ "&taxonomy_values=" + taxonomyValueId, (data) => {
			resolve(data);
		}, () => {
			resolve(null);
		}, () => {
			resolve(null);
		}));
	}

	getLeavesOfNode(taxonomyValues) {
		if (this.state.analytics === null
			|| this.state.analytics.taxonomy_values === undefined
			|| this.state.analytics.taxonomy_categories === undefined
			|| this.state.analytics.taxonomy_category_hierarchy === undefined
			|| this.state.analytics.taxonomy_value_hierarchy === undefined) {
			return null;
		}

		const valueIds = [...new Set(taxonomyValues.map((v) => v.id))];

		const childValueIds = this.state.analytics.taxonomy_value_hierarchy
			.filter((c) => valueIds.indexOf(c.parent_value) >= 0)
			.map((c) => c.child_value);

		if (childValueIds.length > 0) {
			const childValues = this.state.analytics.taxonomy_values
				.filter((v) => childValueIds.indexOf(v.id) >= 0);
			return this.getLeavesOfNode(childValues);
		}

		return taxonomyValues;
	}

	render() {
		return (
			<div className={"PageHome page max-sized-page"}>
				<div className={"PageHome-polygon-wrapper-blue"}>
					<div className={"PageHome-polygon-blue"}/>

					<div className={"row PageHome-polygon-blue-content"}>
						<div className="col-md-3 col-lg-5"/>

						<div className="col-md-9 col-lg-7 PageHome-polygon-blue-content-col">
							<div className={"row"}>
								<div className="col-md-12 PageHome-title1">
									Looking for a company or entity in the field of cybersecurity in Luxembourg?
								</div>

								<div className="col-md-12 PageHome-title2">
									Search among the <b>300+ players</b> that make up the <b>ecosystem</b>
								</div>

								<div className={"col-md-12"}>
									<Popup
										className={"Popup-full-size"}
										trigger={
											<a className={"PageHome-how-to-use"}>
												How to use the platform?
											</a>
										}
										modal
										open={this.state.isTaxonomyDetailOpen}
									>
										{(close) => (
											<div className={"row PageHome-how-to-use-content"}>
												<div className={"col-md-12"}>
													{// eslint-disable-next-line
													}<h2>HOW TO NAVIGATE THROUGH THE LUXEMBOURG CYBERSECURITY ECOSYSTEM PLATFORM</h2>
													<div className="top-right-buttons">
														<button
															className={"red-background"}
															onClick={close}>
															<i className="fas fa-times"/>
														</button>
													</div>
												</div>

												<div className={"col-md-12"}>
													{// eslint-disable-next-line
													}<p>The Luxembourg cybersecurity ecosystem has been divided into 3 categories of players:</p>
													<ul>
														{// eslint-disable-next-line
														}<li><b>Private Sector:</b> private companies that offer services & solutions in the field of cybersecurity,</li>
														{// eslint-disable-next-line
														}<li><b>Public Sector:</b> authorities and regulators in charge or involved in the application of the regulations applying to the sector, organisations involved in education and research, and sectoral public-private partnerships.</li>
														{// eslint-disable-next-line
														}<li><b>Civil society:</b> organisations that bring together collective strengths to address cybersecurity topics.</li>
													</ul>

													<h3>Private sector</h3>
													{// eslint-disable-next-line
													}<p>Private companies are classified according to the <a target="_blank" rel="noreferrer" href="http://www.ecs-org.eu/documents/uploads/ecso-cybersecurity-market-radar-brochure.pdf">ECSO Cybersecurity Market Radar</a>, which is based on the <a target="_blank" rel="noreferrer" href="https://www.nist.gov/cyberframework">NIST Cybersecurity Framework.</a></p>
													{// eslint-disable-next-line
													}<p>The ECSO Cybersecurity Market Radar serves as a comprehensive visualisation tool of the European cybersecurity market.</p>
													{// eslint-disable-next-line
													}<p>The ECSO Radar indicates 5 capabilities that make the cybersecurity value chain:</p>
													<ul>
														<li>identify,</li>
														<li>protect,</li>
														<li>detect,</li>
														<li>respond,</li>
														<li>recover.</li>
													</ul>
													{// eslint-disable-next-line
													}<p>Each link in the value chain is then divided into groups of services and products that are respectively offered by the member companies of the ecosystem.</p>
													<img
														src="img/cybersecurity-ecso-taxonomy.png"
													/>

													<h3>Public sector</h3>
													{// eslint-disable-next-line
													}<p>Public entities have been classified according to the nature of their missions:</p>
													<ul>
														<li>Authorities & Regulators,</li>
														<li>Education & Research,</li>
														<li>Sectoral Public-Private Partnerships,</li>
													</ul>
													{// eslint-disable-next-line
													}<p>while identifying the legal framework that frames their activities:</p>
													<ul>
														{// eslint-disable-next-line
														}<li>Critical Infrastructure Protection (CIP),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://eur-lex.europa.eu/eli/reg/2016/679/oj">General Data Protection Regulation</a> (GDPR),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016L1148">Network and Information Security</a> (NIS),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://portail-qualite.public.lu/fr/confiance-numerique/archivage-electronique.html">Prestataires de Services de Dématérialisation ou de Conservation</a> (PSDC),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://www.cssf.lu/fr/psf-support/">Professionnels du Secteur Financier de Support</a> (PSF),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32015L2366">Payment services</a> (PSD2),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=uriserv:OJ.L_.2014.257.01.0073.01.ENG">Electronic Identification, Authentification and Trust Services</a> (eIDAS),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://eur-lex.europa.eu/eli/reg/2019/881/oj">Cybersecurity Act</a> (CSA),</li>
														{// eslint-disable-next-line
														}<li><a target="_blank" rel="noreferrer" href="https://digital-strategy.ec.europa.eu/en/policies/european-cybersecurity-competence-network-and-centre">European Cybersecurity Competence Network and Centre</a>.</li>
													</ul>

													<h3>Civil society</h3>
													{// eslint-disable-next-line
													}<p>Civil society organisations are classified according to the industry vertical they belong to.</p>
												</div>
											</div>
										)}
									</Popup>
								</div>

								<div className="col-md-6 navbar">
									<div className="PageHome-menu">
										<Nav.Link className="Menu-item-blue">
											<Link to="/privatesector">
												<div className="Menu-title">Private sector</div>
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
									</div>
								</div>
								<div className="col-md-6 navbar">
									<div className="PageHome-menu">
										<Nav.Link>
											<Link to="/dashboard">
												<div className={"Menu-image"}>
													<img src="/img/network.svg" viewBox="0 0 20 20"/>
												</div>
												<div className={"Menu-image-text"}>
													<div className="Menu-title">Dashboard</div>
													<div className="Menu-description">Global view</div>
												</div>
											</Link>
										</Nav.Link>
										<Nav.Link>
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
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className={"PageHome-polygon-wrapper-red"}>
					<div className={"PageHome-polygon-red"}/>

					<div className={"row PageHome-polygon-red-content"}>
						<div className="col-md-9 col-lg-8 PageHome-polygon-red-content-col">
							<div className={"row"}>
								<div className="col-md-12 PageHome-title1">
									An almost exhaustive range of cybersecurity solutions covering
									the risk management supply chain
								</div>
								<div className="col-md-4">
									<Link to="/privatesector">
										<Analytic
											value={this.state.privateSectorCount || 0}
											desc={"Private<br/>companies"}
										/>
									</Link>
								</div>
								<div className="col-md-4">
									<Link to="/publicsector">
										<Analytic
											value={this.state.publicSectorCount || 0}
											desc={"Public<br/>entities"}
										/>
									</Link>
								</div>
								<div className="col-md-4">
									<Link to="/civilsociety">
										<Analytic
											value={this.state.civilSocietyCount || 0}
											desc={"Civil society<br/>organisations"}
										/>
									</Link>
								</div>
								<div className="col-md-12 PageHome-title2">
									Classification of the private sector
								</div>
								<div className="col-md-1"/>
								<div className="col-md-11">
									{this.state.distribution !== null
										&& <RadarClickableTaxonomy
											data={this.state.distribution}
										/>}
								</div>
							</div>
						</div>

						<div className="col-md-12"/>
						<div className="col-md-3"/>
						<div className="col-md-6 PageHome-search">
							<h3>Search in the ecosystem</h3>
							<SearchField/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
