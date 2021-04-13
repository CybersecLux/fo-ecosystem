import React from "react";
import "./PageDashboard.css";
import { NotificationManager as nm } from "react-notifications";
import { getRequest } from "../utils/request.jsx";
import Loading from "./box/Loading.jsx";
import Message from "./box/Message.jsx";
import { getApiURL } from "../utils/env.jsx";
import VennActorDistribution from "./chart/VennActorDistribution.jsx";
import Analytic from "./box/Analytic.jsx";
import BarVertical from "./chart/BarVertical.jsx";
import DoughnutSimple from "./chart/DoughnutSimple.jsx";
import { getPastDate } from "../utils/date.jsx";
import DashboardBreadcrumbs from "./bar/DashboardBreadcrumbs.jsx";

export default class PageDashboard extends React.Component {
	constructor(props) {
		super(props);

		this.fetchAnalytics = this.fetchAnalytics.bind(this);
		this.fetchActors = this.fetchActors.bind(this);
		this.fetchPublicSector = this.fetchPublicSector.bind(this);
		this.getLegalFrameworks = this.getLegalFrameworks.bind(this);
		this.getTopSolutions = this.getTopSolutions.bind(this);
		this.getFrameworkColorsOfRegulator = this.getFrameworkColorsOfRegulator.bind(this);
		this.getSecinDepartments = this.getSecinDepartments.bind(this);

		this.state = {
			analytics: null,
			actors: null,
			publicSector: null,

			frameworksColors: ["#009fe3", "#e40613", "black", "grey", "#8fddff", "#ffa8b0",
				"#9fe383", "#9f83d4", "#FFD700", "black", "black", "black", "black", "black"],

			secinDepartments: [
				"Computer Incident Response Center Luxembourg",
				"Cybersecurity Competence Center",
				"Cyberworld Awareness and Security Enhancement Services",
			],
			servingPublicSector: [
				"Agence Nationale de la Sécurité des systèmes d'Information",
				"Governmental Computer Emergency Response Team",
			],
		};
	}

	componentDidMount() {
		if (this.props.taxonomy !== null) {
			this.fetchAnalytics();
			this.fetchActors();
			this.fetchPublicSector();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.taxonomy !== prevProps.taxonomy) {
			this.fetchAnalytics();
			this.fetchActors();
			this.fetchPublicSector();
		}
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

	fetchActors() {
		getRequest.call(this, "public/get_public_companies"
			+ "?ecosystem_role=ACTOR", (data) => {
			this.setState({
				actors: data,
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	fetchPublicSector() {
		getRequest.call(this, "public/get_public_companies?entity_type=PUBLIC SECTOR", (data) => {
			this.setState({
				publicSector: data,
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	getAuthorities() {
		if (this.getLegalFrameworks() === null
			|| this.state.analytics === null
			|| this.state.analytics.taxonomy_assignments === undefined) {
			return null;
		}

		const tv = this.getLegalFrameworks()
			.map((v) => v.id)
			.join();

		const assignedCompanies = this.state.analytics.taxonomy_assignments
			.filter((a) => tv.indexOf(a.taxonomy_value) >= 0)
			.map((a) => a.company);

		return this.state.publicSector
			.filter((p) => assignedCompanies.indexOf(p.id) >= 0)
			.filter((p) => this.state.secinDepartments.indexOf(p.name) < 0)
			.filter((p) => this.state.servingPublicSector.indexOf(p.name) < 0);
	}

	getFrameworkColorsOfRegulator(regulatorId) {
		if (this.getLegalFrameworks() === null
			|| this.state.analytics === null
			|| this.state.analytics.taxonomy_assignments === undefined) {
			return [];
		}

		const frameworksID = this.getLegalFrameworks()
			.map((v) => v.id);

		const assignFrameworkColors = this.state.analytics.taxonomy_assignments
			.filter((a) => a.company === regulatorId)
			.filter((a) => frameworksID.indexOf(a.taxonomy_value) >= 0)
			.map((a) => this.state.frameworksColors[frameworksID.indexOf(a.taxonomy_value)]);

		return assignFrameworkColors;
	}

	getEducation() {
		if (this.state.actors === null
			|| this.state.analytics === null
			|| this.state.analytics.taxonomy_assignments === undefined
			|| this.state.analytics.taxonomy_values === undefined) {
			return null;
		}

		const tv = this.state.analytics.taxonomy_values
			.filter((v) => ["Education", "Academic and Research"].indexOf(v.name) >= 0)
			.map((v) => v.id)
			.join();

		const assignedCompanies = this.state.analytics.taxonomy_assignments
			.filter((a) => tv.indexOf(a.taxonomy_value) >= 0)
			.map((a) => a.company);

		return this.state.publicSector
			.filter((p) => assignedCompanies.indexOf(p.id) >= 0);
	}

	getCybersecurityCoreCount() {
		if (this.state.actors === null) {
			return null;
		}

		return this.state.actors
			.filter((a) => a.is_cybersecurity_core_business === 1)
			.length;
	}

	getCybersecurityCoreEmployeeCount() {
		if (this.state.actors === null
			|| this.state.analytics === null
			|| this.state.analytics.workforces === undefined) {
			return null;
		}

		const actors = this.state.actors
			.filter((a) => a.is_cybersecurity_core_business === 1)
			.map((a) => a.id);

		const workforces = this.state.analytics.workforces
			.filter((w) => actors.indexOf(w.company) >= 0)
			.map((w) => w.workforce);

		return workforces.reduce((a, b) => a + b);
	}

	getStartupCount() {
		if (this.state.actors === null) {
			return null;
		}

		return this.state.actors
			.filter((a) => a.is_startup === 1)
			.length;
	}

	getLegalFrameworks() {
		if (this.props.taxonomy === null
			|| this.props.taxonomy.values === undefined) {
			return null;
		}

		return this.props.taxonomy.values.filter((v) => v.category === "LEGAL FRAMEWORK");
	}

	getValueChainDistribution() {
		const getLeavesOfNode = (taxonomyValues) => {
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
				return getLeavesOfNode(childValues);
			}

			return taxonomyValues;
		};

		if (this.state.analytics === null
			|| this.state.analytics.taxonomy_values === undefined
			|| this.state.analytics.taxonomy_assignments === undefined) {
			return null;
		}

		const distribution = {};

		const values = this.state.analytics.taxonomy_values
			.filter((v) => v.category === "VALUE CHAIN");

		for (let i = 0; i < values.length; i++) {
			const leaves = getLeavesOfNode([values[i]]).map((v) => v.id);
			let concernedCompanies = this.state.analytics.taxonomy_assignments
				.filter((a) => leaves.indexOf(a.taxonomy_value) >= 0)
				.map((a) => a.company);
			concernedCompanies = [...new Set(concernedCompanies)];
			distribution[values[i].name] = concernedCompanies.length;
		}

		return distribution;
	}

	getInterMinisterialCommitee() {
		if (this.state.publicSector === null) {
			return null;
		}

		return this.state.publicSector
			.filter((p) => [
				"Haut-Commissariat à la Protection Nationale",
				"Directorate of Defence",
				"Service de Renseignement de l'Etat",
				"Ministry of the Economy",
				"Institut Luxembourgeois de Régulation",
				"Centre des Technologies de l'Information de l'Etat",
				"Departement of Media, Telecommunications and Digital Policy",
				"Ministry of Foreign and European Affairs",
			].indexOf(p.name) >= 0);
	}

	getServingThePublicSector() {
		if (this.state.publicSector === null) {
			return null;
		}

		return this.state.publicSector
			.filter((p) => this.state.servingPublicSector.indexOf(p.name) >= 0);
	}

	getSectoralPPPs() {
		if (this.state.publicSector === null) {
			return null;
		}

		return this.state.publicSector
			.filter((p) => [
				"InCert GIE",
				"Infrachain a.s.b.l",
				"LU-CIX",
				"LUXITH",
			].indexOf(p.name) >= 0);
	}

	getTopSolutions() {
		if (this.state.analytics === null
			|| this.state.analytics.taxonomy_categories === undefined
			|| this.state.analytics.taxonomy_values === undefined
			|| this.state.analytics.taxonomy_assignments === undefined) {
			return null;
		}

		const serviceGroupValues = this.state.analytics.taxonomy_values
			.filter((v) => v.category === "SERVICE GROUP")
			.map((v) => v.id);

		const occurences = {};

		serviceGroupValues.forEach((v) => {
			occurences[v] = 0;
		});

		const serviceGroupAssignments = this.state.analytics.taxonomy_assignments
			.filter((a) => serviceGroupValues.indexOf(a.taxonomy_value) >= 0);

		serviceGroupAssignments.forEach((v) => {
			occurences[v.taxonomy_value] += 1;
		});

		const orderedOccurences = Object.values(occurences).sort((a, b) => b - a);

		const minOccurence = orderedOccurences[Math.min(7, orderedOccurences.length - 1)];

		Object.keys(occurences).forEach((k) => {
			if (occurences[k] < minOccurence) {
				delete occurences[k];
			}
		});

		const result = {};

		Object.keys(occurences).forEach((k) => {
			result[this.state.analytics.taxonomy_values
				.filter((v) => v.id === parseInt(k, 10))[0].name] = occurences[k];
		});

		return result;
	}

	getTopSolutionsForStartup() {
		if (this.state.actors === null
			|| this.state.analytics === null
			|| this.state.analytics.taxonomy_categories === undefined
			|| this.state.analytics.taxonomy_values === undefined
			|| this.state.analytics.taxonomy_assignments === undefined) {
			return null;
		}

		const startupIDs = this.state.actors
			.filter((a) => a.is_startup === 1)
			.map((a) => a.id);

		const serviceGroupValues = this.state.analytics.taxonomy_values
			.filter((v) => v.category === "SERVICE GROUP")
			.map((v) => v.id);

		const occurences = {};

		serviceGroupValues.forEach((v) => {
			occurences[v] = 0;
		});

		const serviceGroupAssignments = this.state.analytics.taxonomy_assignments
			.filter((a) => startupIDs.indexOf(a.company) >= 0)
			.filter((a) => serviceGroupValues.indexOf(a.taxonomy_value) >= 0);

		serviceGroupAssignments.forEach((v) => {
			occurences[v.taxonomy_value] += 1;
		});

		const orderedOccurences = Object.values(occurences).sort((a, b) => b - a);

		const minOccurence = orderedOccurences[Math.min(2, orderedOccurences.length - 1)];

		Object.keys(occurences).forEach((k) => {
			if (occurences[k] < minOccurence) {
				delete occurences[k];
			}
		});

		const result = {};

		Object.keys(occurences).forEach((k) => {
			result[this.state.analytics.taxonomy_values
				.filter((v) => v.id === parseInt(k, 10))[0].name] = occurences[k];
		});

		return result;
	}

	getCoreBusinessPercentForStartup() {
		if (this.state.actors === null) {
			return null;
		}

		const startups = this.state.actors
			.filter((a) => a.is_startup === 1);

		const numberOfStartup = startups.length;
		const numberOfCB = startups.filter((a) => a.is_cybersecurity_core_business === 1).length;

		return Math.round((numberOfCB * 100) / numberOfStartup);
	}

	getLessThanFiveYearsCoreBusinessCompanyCount() {
		if (this.state.actors === null) {
			return null;
		}

		return this.state.actors
			.filter((a) => a.is_cybersecurity_core_business === 1)
			.filter((a) => a.creation_date >= getPastDate(5))
			.length;
	}

	getStartupWithCoreBusinessCompanyCount() {
		if (this.state.actors === null) {
			return null;
		}

		return this.state.actors
			.filter((a) => a.is_cybersecurity_core_business === 1)
			.filter((a) => a.is_startup === 1)
			.length;
	}

	getSecinDepartments() {
		if (this.state.publicSector === null) {
			return [];
		}

		return this.state.publicSector
			.filter((a) => this.state.secinDepartments.indexOf(a.name) >= 0);
	}

	render() {
		return (
			<div id={"PageDashboard-wrapper"}>

				<DashboardBreadcrumbs/>

				<div id={"PageDashboard"}>
					<div id="PageDashboard-companies" className={"row PageDashboard-companies"}>
						<div className={"col-md-12"}>
							<h1><i className="fas fa-city"/> Companies</h1>
						</div>

						<div className={"col-md-3 col-xl-3"}>
							<h2>{this.getCybersecurityCoreCount()} companies with cybersecurity as a core business
							</h2>

							<div className={"blue-bordered"}>
								{this.getCybersecurityCoreEmployeeCount() !== null
									? <Analytic
										value={this.getCybersecurityCoreEmployeeCount()}
										desc={"Total employees"}
									/>
									: <Loading
										height={80}
									/>
								}

								{this.getLessThanFiveYearsCoreBusinessCompanyCount() !== null
									? <Analytic
										value={this.getLessThanFiveYearsCoreBusinessCompanyCount()}
										desc={"Created during the last 5 years"}
									/>
									: <Loading
										height={80}
									/>
								}

								{this.getStartupWithCoreBusinessCompanyCount() !== null
									? <Analytic
										value={this.getStartupWithCoreBusinessCompanyCount()}
										desc={"Start-ups"}
									/>
									: <Loading
										height={80}
									/>
								}
							</div>
						</div>

						<div className={"col-md-6 col-xl-6"}>
							<div className={"PageDashboard-actor-distribution"}>
								<VennActorDistribution
									actors={this.state.actors !== null ? this.state.actors : []}
								/>
							</div>
						</div>

						<div className={"col-md-3 col-xl-3"}>
							<h2>Diversified solutions</h2>

							<div className={"blue-bordered"}>
								{this.getValueChainDistribution() !== null
									? <BarVertical
										data={this.getValueChainDistribution()}
									/>
									: <Loading
										height={200}
									/>
								}
							</div>
						</div>

						<div className={"col-md-4"}>
							<h2>Top solutions</h2>

							<div className={"blue-bordered"}>
								{this.getTopSolutions() !== null
									? <BarVertical
										data={this.getTopSolutions()}
										fontSize={13}
										minHeight={750}
									/>
									: <Loading
										height={200}
									/>
								}
							</div>
						</div>

						<div className={"col-md-8"}>
							<h2>{this.getStartupCount()} Start-ups</h2>

							<div className={"blue-bordered"}>
								<div className="row">
									<div className={"col-md-12"}>
										<h3 className={"blue-font"}>START-UPS REPRESENT MORE THAN
											20% OF THE NATIONAL CYBERSECURITY ECOSYSTEM</h3>
									</div>

									<div className={"col-md-8"}>
										<div className="row">
											<div className={"col-md-12"}>
												<h3>Core business</h3>

												{this.getCoreBusinessPercentForStartup() !== null
													? <DoughnutSimple
														data={this.getCoreBusinessPercentForStartup()}
													/>
													: <Loading
														height={200}
													/>
												}

												{this.getCoreBusinessPercentForStartup() !== null
													? <h4 className="centered">{this.getCoreBusinessPercentForStartup()}% of the Start-ups
													have cybersecurity as a core business</h4>
													: ""
												}
											</div>
										</div>
									</div>

									<div className={"col-md-4"}>
										<h3>Top offered solutions</h3>

										{this.getTopSolutionsForStartup() !== null
											? <BarVertical
												data={this.getTopSolutionsForStartup()}
												fontSize={13}
											/>
											: <Loading
												height={200}
											/>
										}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div id="PageDashboard-national-strategy" className={"row PageDashboard-national-strategy"}>
						<div className={"col-md-12"}>
							<h1><i className="fas fa-chess"/> National strategy & governance</h1>

							<div className={"row"}>
								{this.getInterMinisterialCommitee() !== null
									? this.getInterMinisterialCommitee().map((m) => <div
										className={"col-sm-6 col-lg-3 col-xl-2"}
										key={m.id}>
										<div className="PageDashboard-national-strategy-actor">
											<h3>{m.name}</h3>
										</div>
									</div>)
									: <Loading
										height={200}
									/>
								}
							</div>
						</div>

						<div className={"col-md-6 col-lg-4 PageDashboard-national-strategy-serving"}>
							<h2>Serving the public sector</h2>

							{this.getServingThePublicSector() !== null
								? this.getServingThePublicSector().map((m) => <div className={"row"} key={m.id}>
									<div className={"col-12 col-md-2 col-lg-2"}/>
									<div className={"col-12 col-md-8 col-lg-8 PageDashboard-national-strategy-actor"}>
										<div className={"PageDashboard-authorities-and-regulators-bookmarks"}>
											{this.getFrameworkColorsOfRegulator(m.id).map((f) => <i
												key={f}
												className="fas fa-bookmark"
												style={{ color: f }}
											/>)}
										</div>

										<img
											src={getApiURL() + "public/get_image/" + m.image}
											alt={m.name}
										/>
									</div>
								</div>)
								: <Loading
									height={100}
								/>
							}
						</div>

						<div className={"col-md-12 col-lg-4"}/>

						<div className={"col-md-6 col-lg-4 PageDashboard-national-strategy-serving"}>
							<h2>Serving the private sector</h2>

							<div className={"row"}>
								<div className={"col-12 col-md-3 col-lg-3"}/>
								<div className={"col-12 col-md-6 col-lg-6"}>
									<img
										src={"img/secin-logo.png"}
										alt={"SECURITYMADEIN.LU"}
									/>
								</div>
								<div className={"col-12 col-md-3 col-lg-3"}/>
							</div>
							<div className={"row"}>
								{this.getSecinDepartments().map((d) => <div
									key={d.id}
									className={"col-12 col-md-4 col-lg-4"}>
									<div className={"PageDashboard-authorities-and-regulators-bookmarks"}>
										{this.getFrameworkColorsOfRegulator(d.id).map((f) => <i
											key={f}
											className="fas fa-bookmark"
											style={{ color: f }}
										/>)}
									</div>

									<img
										src={getApiURL() + "public/get_image/" + d.image}
										alt={d.name}
									/>
								</div>)
								}
							</div>
						</div>
					</div>

					<div id="PageDashboard-national-actors" className={"row PageDashboard-national-actors"}>
						<div className={"col-md-12"}>
							<h1>National actors <i className="fas fa-landmark"/></h1>
						</div>

						<div className={"col-md-6"}>
							<h2>Authorities & Regulators</h2>

							<div className={"red-bordered PageDashboard-authorities-and-regulators"}>
								<div className={"row"}>
									{this.getAuthorities() !== null && this.getAuthorities().length > 0
									&& this.getAuthorities().map((c) => <div className={"col-md-6 col-lg-6 col-xl-4"} key={c.id}>
										<div className={"PageDashboard-authorities-and-regulators-bookmarks"}>
											{this.getFrameworkColorsOfRegulator(c.id).map((f) => <i
												key={f}
												className="fas fa-bookmark"
												style={{ color: f }}
											/>)}
										</div>

										<img
											src={getApiURL() + "public/get_image/" + c.image}
											alt={c.name}
										/>
									</div>)}

									{this.getAuthorities() !== null && this.getAuthorities().length === 0
									&& <div className={"col-md-12"}>
										<Message
											text={"No item found"}
											height={200}
										/>
									</div>}

									{this.getAuthorities() === null
									&& <div className={"col-md-12"}>
										<Loading
											height={200}
										/>
									</div>}
								</div>
							</div>
						</div>

						<div className={"col-md-6"}>
							<h2><i className="fas fa-balance-scale"/> Specific legal frameworks</h2>

							<div className={"row PageDashboard-national-actors-legal"}>
								{this.getLegalFrameworks() !== null && this.getLegalFrameworks().length > 0
								&& this.getLegalFrameworks().map((f, i) => <div className={"col-md-12"} key={f.id}>
									<h4>
										<i
											className="fas fa-bookmark"
											style={{ color: this.state.frameworksColors[i] }}
										/>
										{f.name}
									</h4>
								</div>)}

								{this.getLegalFrameworks() !== null && this.getLegalFrameworks().length === 0
								&& <div className={"col-md-12"}>
									<Message
										text={"No item found"}
										height={200}
									/>
								</div>}

								{this.getLegalFrameworks() === null
								&& <div className={"col-md-12"}>
									<Loading
										height={200}
									/>
								</div>}
							</div>
						</div>

						<div className={"col-md-6"}>
							<h2>Education & Research</h2>

							<div className={"red-bordered"}>
								<div className={"row"}>
									{this.getEducation() !== null && this.getEducation().length > 0
									&& this.getEducation().map((c) => <div className={"col-md-6 col-lg-6 col-xl-4"} key={c.id}>
										<img
											src={getApiURL() + "public/get_image/" + c.image}
											alt={c.name}
										/>
									</div>)}

									{this.getEducation() !== null && this.getEducation() === 0
									&& <div className={"col-md-12"}>
										<Message
											text={"No item found"}
											height={200}
										/>
									</div>}

									{this.getEducation() === null
									&& <div className={"col-md-12"}>
										<Loading
											height={200}
										/>
									</div>}
								</div>
							</div>
						</div>

						<div className={"col-md-6"}>
							<h2>Sectoral PPPs</h2>

							<div className={"red-bordered"}>
								<div className={"row"}>
									{this.getSectoralPPPs() !== null
										? this.getSectoralPPPs().map((m) => <div
											className={"col-md-6 col-lg-6 col-xl-4"}
											key={m.id}>
											<img
												src={getApiURL() + "public/get_image/" + m.image}
												alt={m.name}
											/>
										</div>)
										: <Loading
											height={100}
										/>
									}
								</div>
							</div>
						</div>
					</div>

					<div className={"PageDashboard-back-button"}>
						<button
							className={"blue-background"}
							onClick={this.props.history.goBack}
						>
							<i className="fas fa-arrow-circle-left"/> Go back
						</button>
					</div>
				</div>
			</div>
		);
	}
}
