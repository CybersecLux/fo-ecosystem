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
		this.getEcosystemRoleCount = this.getEcosystemRoleCount.bind(this);
		this.getValueChainDistribution = this.getValueChainDistribution.bind(this);
		this.getLeavesOfNode = this.getLeavesOfNode.bind(this);

		this.state = {
			analytics: null,
		};
	}

	componentDidMount() {
		this.fetchAnalytics();
	}

	fetchAnalytics() {
		getRequest.call(this, "public/get_public_analytics", (data) => {
			this.setState({
				analytics: data,
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	getEcosystemRoleCount(category, value) {
		if (this.state.analytics === null
			|| this.state.analytics.taxonomy_values === undefined
			|| this.state.analytics.taxonomy_assignments === undefined) {
			return null;
		}

		const values = this.state.analytics.taxonomy_values
			.filter((v) => v.category === category && v.name === value);

		if (values.length === 0) {
			return null;
		}

		return this.state.analytics.taxonomy_assignments
			.filter((a) => a.taxonomy_value === values[0].id)
			.length;
	}

	getValueChainDistribution() {
		if (this.state.analytics === null
			|| this.state.analytics.taxonomy_values === undefined
			|| this.state.analytics.taxonomy_assignments === undefined) {
			return null;
		}

		const distribution = {};

		const values = this.state.analytics.taxonomy_values
			.filter((v) => v.category === "VALUE CHAIN");

		for (let i = 0; i < values.length; i++) {
			const leaves = this.getLeavesOfNode([values[i]]).map((v) => v.id);
			let concernedCompanies = this.state.analytics.taxonomy_assignments
				.filter((a) => leaves.indexOf(a.taxonomy_value) >= 0)
				.map((a) => a.company);
			concernedCompanies = [...new Set(concernedCompanies)];
			distribution[values[i].name] = {
				valueId: values[i].id,
				amount: concernedCompanies.length,
			};
		}

		return distribution;
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

						<div className="col-md-9 col-lg-7">
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
													}<h2>HOW TO NAVIGATE THROUGH THE LUXEMBOURG CYBERSECURITY ECOSYSTEM APP</h2>
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
													}<p>The Luxembourg cybersecurity ecosystem mapping has been divided into 3 categories of players:</p>
													<ul>
														{// eslint-disable-next-line
														}<li><b>Private companies</b> that offer services & solutions in the field of cybersecurity,</li>
														{// eslint-disable-next-line
														}<li><b>Public entities</b> (authorities and regulators) that are in charge or involved in the application of the regulations applying to the sector,</li>
														{// eslint-disable-next-line
														}<li><b>Civil society organisations</b> that bring together collective strengths to address cybersecurity topics.</li>
													</ul>
													{// eslint-disable-next-line
													}<p>The companies’ directory has been categorised upon the <a target="_blank" rel="noreferrer" href="http://www.ecs-org.eu/documents/uploads/ecso-cybersecurity-market-radar-brochure.pdf">ECSO Cybersecurity Market Radar</a>.</p>
													{// eslint-disable-next-line
													}<p>The ECSO Cybersecurity Market Radar serves as a comprehensive visualisation tool, marking a significant step forward in ensuring the transparency of the European cybersecurity market and boosting the visibility of its deployment-ready cybersecurity solutions and capabilities.</p>
													{// eslint-disable-next-line
													}<p>The Radar presents a market-oriented taxonomy of cybersecurity capabilities, developed by the ECSO working groups, dealing with market analysis, investments, cybersecurity companies and regions. The ECSO Radar indicates 5 capabilities: identify, protect, detect, respond, recover.</p>		
												</div>

												<div className={"col-md-12"}>
													<img
														src="img/cybersecurity-ecso-taxonomy.png"
													/>
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
						<div className="col-md-9 col-lg-7">
							<div className={"row"}>
								<div className="col-md-12 PageHome-title1">
									An almost exhaustive range of cybersecurity solutions covering
									the risk management supply chain
								</div>
								<div className="col-md-4">
									<Link to="/privatesector">
										<Analytic
											value={this.getEcosystemRoleCount("ECOSYSTEM ROLE", "ACTOR")}
											desc={"Private companies"}
										/>
									</Link>
								</div>
								<div className="col-md-4">
									<Link to="/publicsector">
										<Analytic
											value={this.getEcosystemRoleCount("ENTITY TYPE", "PUBLIC SECTOR")}
											desc={"Public entities"}
										/>
									</Link>
								</div>
								<div className="col-md-4">
									<Link to="/civilsociety">
										<Analytic
											value={this.getEcosystemRoleCount("ENTITY TYPE", "CIVIL SOCIETY")}
											desc={"Civil society organisations"}
										/>
									</Link>
								</div>
								<div className="col-md-12 PageHome-title2">
									Classification of the private sector
								</div>
								<div className="col-md-1"/>
								<div className="col-md-11">
									{this.getValueChainDistribution() !== null
										&& <RadarClickableTaxonomy
											data={this.getValueChainDistribution()}
										/>}
								</div>
							</div>
						</div>

						<div className="col-md-12"/>
						<div className="col-md-3"/>
						<div className="col-md-6 PageHome-search">
							<h3>Search on the website</h3>
							<SearchField/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
