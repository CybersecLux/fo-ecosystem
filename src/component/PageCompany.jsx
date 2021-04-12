import React from "react";
import "./PageCompany.css";
import { NotificationManager as nm } from "react-notifications";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import { getRequest } from "../utils/request.jsx";
import Loading from "./box/Loading.jsx";
import TreeTaxonomy from "./chart/TreeTaxonomy.jsx";
import NoImage from "./box/NoImage.jsx";
import { getApiURL } from "../utils/env.jsx";

export default class PageCompany extends React.Component {
	constructor(props) {
		super(props);

		this.getCompanyContent = this.getCompanyContent.bind(this);
		this.getIndustryVertical = this.getIndustryVertical.bind(this);

		this.state = {
			company: null,
		};
	}

	componentDidMount() {
		this.getCompanyContent();
	}

	getCompanyContent() {
		getRequest.call(this, "public/get_public_company/" + this.props.match.params.id, (data) => {
			this.setState({
				company: data,
			});
		}, (response) => {
			nm.warning(response.statusText);
		}, (error) => {
			nm.error(error.message);
		});
	}

	getIndustryVertical() {
		if (this.props.taxonomy === null
			|| this.props.taxonomy.values === undefined
			|| this.state.company === null
			|| this.state.company.taxonomy_assignment === undefined) {
			return [];
		}

		return this.props.taxonomy.values
			.filter((v) => v.category === "INDUSTRY VERTICAL")
			.filter((v) => this.state.company.taxonomy_assignment.indexOf(v.id) >= 0);
	}

	getEntityType() {
		if (this.props.taxonomy === null
			|| this.props.taxonomy.values === undefined
			|| this.state.company === null
			|| this.state.company.taxonomy_assignment === undefined) {
			return [];
		}

		return this.props.taxonomy.values
			.filter((v) => v.category === "ENTITY TYPE")
			.filter((v) => this.state.company.taxonomy_assignment.indexOf(v.id) >= 0);
	}

	changeState(field, value) {
		this.setState({ [field]: value });
	}

	render() {
		return (
			<div className={"PageCompany page max-sized-page"}>
				<div className="row">
					<div className="col-md-12">
						<Breadcrumb>
							<Breadcrumb.Item><Link to="/">CYBERSECURITY LUXEMBOURG</Link></Breadcrumb.Item>
							<Breadcrumb.Item><Link to="/">COMPANY</Link></Breadcrumb.Item>
							{this.state.company !== null && !this.state.loading
								? <Breadcrumb.Item>
									<Link to={"/company/" + this.state.company.id}>{this.state.company.name}</Link>
								</Breadcrumb.Item>
								: ""}
						</Breadcrumb>
					</div>
				</div>

				{this.state.company !== null
					? <div className="row row-spaced">
						<div className="col-md-12">
							<div className="row">
								<div className="col-md-12">
									<h1>Global information</h1>
								</div>
							</div>
							<div className="row row-spaced">
								<div className="col-md-3 PageCompany-logo">
									{this.state.company.image !== null && this.state.company.image !== undefined
										? <img
											src={getApiURL() + "public/get_image/" + this.state.company.image}
											alt="Card image cap"
										/>
										: <NoImage/>
									}
								</div>
								<div className="col-md-9">
									<h3>{this.state.company.name}</h3>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12">
									{this.state.company.description}
								</div>
							</div>

							<div className="row">
								{this.state.company.website !== undefined
									&& this.state.company.website !== null
									? <div className="col-md-12 right-buttons">
										<button
											className={"blue-background"}
											onClick={() => window.open(this.state.company.website, "_blank")}
										>
											<i className="fas fa-globe-europe"/> Visit website
										</button>
									</div>
									: ""
								}
							</div>

							<div className="row">
								{this.getIndustryVertical().map((v) => <div
									key={v.id}
									className="col-md-12 PageCompany-stamp">
									<i className="fas fa-briefcase"/> {v.name}
								</div>)
								}

								{this.state.company.is_cybersecurity_core_business !== undefined
									&& this.state.company.is_cybersecurity_core_business
									? <div className="col-md-12 PageCompany-stamp">
										<i className="fas fa-check-circle"/> Cybersecurity as a core business
									</div>
									: ""
								}

								{this.state.company.is_startup !== undefined
									&& this.state.company.is_startup
									? <div className="col-md-12 PageCompany-stamp">
										<i className="fas fa-check-circle"/> Start-up
									</div>
									: ""
								}
							</div>

							<div className="row">
								{this.state.company.rscl_number !== undefined
									&& this.state.company.rscl_number !== null
									? <div className="col-md-12">
										<b>Business register number:</b> {this.state.company.rscl_number}
									</div>
									: ""
								}

								{this.state.company.creation_date !== undefined
									&& this.state.company.creation_date !== null
									? <div className="col-md-12">
										<b>Creation date:</b> {this.state.company.creation_date}
									</div>
									: ""
								}
							</div>
						</div>
					</div>
					: <Loading
						height={400}
					/>
				}

				{this.state.company !== null
					&& this.props.taxonomy !== null
					&& this.props.taxonomy.values !== undefined
					&& this.getEntityType().filter((t) => t.name === "PRIVATE SECTOR").length > 0
					? <div className="row row-spaced">
						<div className="col-md-12">
							<h1>Classification within the private actors of the ecosystem</h1>
						</div>
						<div className="col-md-12">
							<TreeTaxonomy
								companyAssignment={this.state.company.taxonomy_assignment}
								taxonomy={this.props.taxonomy}
								category={"SERVICE GROUP"}
							/>
						</div>
					</div>
					: ""
				}

				{this.state.company !== null
					&& this.props.taxonomy !== null
					&& this.props.taxonomy.values !== undefined
					&& this.getEntityType().filter((t) => t.name === "PUBLIC SECTOR").length > 0
					? <div className="row row-spaced">
						<div className="col-md-12">
							<h1>Classification within the public actors of the ecosystem</h1>
						</div>
						<div className="col-md-12">
							<TreeTaxonomy
								companyAssignment={this.state.company.taxonomy_assignment}
								taxonomy={this.props.taxonomy}
								category={"LEGAL FRAMEWORK"}
							/>
						</div>
					</div>
					: ""
				}
			</div>
		);
	}
}
