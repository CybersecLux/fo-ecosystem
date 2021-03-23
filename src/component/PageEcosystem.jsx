import React from "react";
import "./PageEcosystem.css";
import { NotificationManager as nm } from "react-notifications";
import { getRequest } from "../utils/request.jsx";
import Loading from "./box/Loading.jsx";
import Message from "./box/Message.jsx";
import { getApiURL } from "../utils/env.jsx";
import VennActorDistribution from "./chart/VennActorDistribution.jsx";
import Analytic from "./box/Analytic.jsx";

export default class PageEcosystem extends React.Component {
	constructor(props) {
		super(props);

		this.fetchAnalytics = this.fetchAnalytics.bind(this);
		this.fetchActors = this.fetchActors.bind(this);
		this.fetchPublicSector = this.fetchPublicSector.bind(this);
		this.getLegalFrameworks = this.getLegalFrameworks.bind(this);

		this.state = {
			analytics: null,
			actors: null,
			publicSector: null,

			frameworksColors: ["#009fe3", "#e40613", "black", "grey", "#8fddff", "#ffa8b0"],
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
			.filter((p) => assignedCompanies.indexOf(p.id) >= 0);
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

	getInterMinisterialCommitee() {
		if (this.state.publicSector === null) {
			return null;
		}

		return this.state.publicSector
			.filter((p) => [
				"High Commission for National Protection",
				"Directorate of Defence",
				"State Intelligence Service",
				"Ministry of the Economy",
				"Institut Luxembourgeois de Régulation",
				"Centre des Technologies de l'Information de l'Etat",
			].indexOf(p.name) >= 0);
	}

	getTopSolutions() {
		if (this.state.actors === null
			|| this.props.taxonomy === null
			|| this.props.taxonomy.taxonomy_categories === undefined
			|| this.props.taxonomy.taxonomy_values === undefined) {
			return null;
		}

		return this.state.publicSector
			.filter((p) => [
				"High Commission for National Protection",
				"Directorate of Defence",
				"State Intelligence Service",
				"Ministry of the Economy",
				"Institut Luxembourgeois de Régulation",
				"Centre des Technologies de l'Information de l'Etat",
			].indexOf(p.name) >= 0);
	}

	render() {
		return (
			<div id={"PageEcosystem-wrapper"}>
				<div id={"PageEcosystem"}>
					<div className={"row PageEcosystem-national-actors"}>
						<div className={"col-md-12"}>
							<h1><i className="fas fa-landmark"/> National actors</h1>
						</div>

						<div className={"col-md-6"}>
							<h2>Education & Research</h2>

							<div className={"row black-bordered"}>
								{this.getEducation() !== null && this.getEducation().length > 0
								&& this.getEducation().map((c) => <div className={"col-md-4 col-lg-3 col-xl-2"} key={c.id}>
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

						<div className={"col-md-6"}>
							<h2>Sectoral PPPs</h2>

							<Loading
								height={200}
							/>
						</div>

						<div className={"col-md-6"}>
							<h2>Authorities and regulators</h2>

							<div className={"row black-bordered"}>
								{this.getAuthorities() !== null && this.getAuthorities().length > 0
								&& this.getAuthorities().map((c) => <div className={"col-md-4 col-lg-3 col-xl-2"} key={c.id}>
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

						<div className={"col-md-6"}>
							<h2><i className="fas fa-balance-scale"/> Specific legal framworks</h2>

							<div className={"row"}>
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
					</div>

					<div className={"row PageEcosystem-national-strategy"}>
						<div className={"col-md-6 col-lg-4 PageEcosystem-national-strategy-serving"}>
							<h2>Serving the public sector</h2>

							<Loading
								height={100}
							/>
						</div>

						<div className={"col-md-12"}>
							<h1>National strategy & governance</h1>

							<div className={"row"}>
								{this.getInterMinisterialCommitee() !== null
									? this.getInterMinisterialCommitee().map((m) => <div
										className={"col-sm-6 col-md-3 col-lg-2 PageEcosystem-national-strategy-actor"}
										key={m.id}>
										<h3>{m.name}</h3>
									</div>)
									: <Loading
										height={200}
									/>
								}
							</div>
						</div>

						<div className={"col-md-6 col-lg-8"}/>
						<div className={"col-md-6 col-lg-4 PageEcosystem-national-strategy-serving"}>
							<h2>Serving the private sector</h2>

							<div className={"row"}>
								<div className={"col-md-6 col-lg-3"}>
									<img
										src={"img/cases-logo.png"}
										alt={"SECURITYMADEIN.LU"}
									/>
								</div>
								<div className={"col-md-6 col-lg-3"}>
									<img
										src={"img/c3-logo.png"}
										alt={"C3"}
									/>
								</div>
								<div className={"col-md-6 col-lg-3"}>
									<img
										src={"img/cases-logo.png"}
										alt={"CASES"}
									/>
								</div>
								<div className={"col-md-6 col-lg-3"}>
									<img
										src={"img/circl-logo.png"}
										alt={"CIRCL"}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className={"row PageEcosystem-companies"}>
						<div className={"col-md-12"}>
							<h1>Companies <i className="fas fa-city"/></h1>
						</div>

						<div className={"col-md-2 col-xl-3"}>
							<h2>{this.getCybersecurityCoreCount()} companies with Cybersecurity as a core business
							</h2>

							{this.getCybersecurityCoreEmployeeCount() !== null
								? <Analytic
									value={this.getCybersecurityCoreEmployeeCount()}
									desc={<div>
										<i className="fas fa-user-tie"/>
										<br/>
										Total employees
									</div>}
								/>
								: <Loading
									height={80}
								/>
							}

							{this.getCybersecurityCoreEmployeeCount() !== null
								? <Analytic
									value={this.getCybersecurityCoreEmployeeCount()}
									desc={<div>
										<i className="fas fa-user-tie"/>
										<br/>
										Total employees
									</div>}
								/>
								: <Loading
									height={80}
								/>
							}

							{this.getCybersecurityCoreEmployeeCount() !== null
								? <Analytic
									value={this.getCybersecurityCoreEmployeeCount()}
									desc={<div>
										<i className="fas fa-user-tie"/>
										<br/>
										Total employees
									</div>}
								/>
								: <Loading
									height={80}
								/>
							}
						</div>

						<div className={"col-md-8 col-xl-6"}>
							<VennActorDistribution
								actors={this.state.actors !== null ? this.state.actors : []}
							/>
						</div>

						<div className={"col-md-2 col-xl-3"}>
							<h2>Diversified solutions</h2>

							<Loading
								height={200}
							/>
						</div>

						<div className={"col-md-4"}>
							<h2>Top 7 Solutions</h2>

							{this.getTopSolutions() !== null
								? this.getTopSolutions().map((s) => <div
									className={"col-sm-12"}
									key={s.id}>
									<h3>{s.name}</h3>
								</div>)
								: <Loading
									height={200}
								/>
							}
						</div>

						<div className={"col-md-8"}>
							<h2>{this.getStartupCount()} Start-ups</h2>

							<Loading
								height={200}
							/>
						</div>
					</div>

					<div className={"PageEcosystem-back-button"}>
						<button
							className={"blue-background"}
							onClick={this.props.history.goBack}
						>
							<i className="fas fa-arrow-circle-left"/> Go back to the app
						</button>
					</div>
				</div>
			</div>
		);
	}
}
