import React from "react";
import "./CivilSocietySearch.css";
import Popup from "reactjs-popup";
import FormLine from "./FormLine.jsx";
import Loading from "../box/Loading.jsx";
import TreeTaxonomy from "../chart/TreeTaxonomy.jsx";

export default class CivilSocietySearch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isTaxonomyDetailOpen: false,
		};
	}

	render() {
		return (
			<div className={"CivilSocietySearch row"}>
				<div className={"col-md-12"}>
					<h1>Filter</h1>
				</div>

				<div className={"col-md-12"}>
					<FormLine
						label={"Company name"}
						value={this.props.filters.name === undefined
							? [] : this.props.filters.name}
						onChange={(v) => this.props.onChange("name", v)}
					/>
				</div>

				<div className={"col-md-12"}>
					<FormLine
						label={"Taxonomy"}
						type={"multiselect"}
						value={this.props.filters.taxonomy_values === undefined || this.props.taxonomy === null
							? [] : this.props.filters.taxonomy_values}
						options={this.props.taxonomy !== null && this.props.taxonomy !== undefined
							&& this.props.taxonomy.values !== undefined
							? this.props.taxonomy.values
								.filter((v) => ["SOLUTION CATEGORY", "VALUE CHAIN", "SERVICE GROUP"]
									.indexOf(v.category) >= 0)
								.map((v) => ({ label: v.category + " - " + v.name, value: v.id }))
							: []}
						onChange={(v) => this.props.onChange("taxonomy_values", v)}
						disabled={this.state.tags === null}
					/>
				</div>

				<div className={"col-md-6"}>
				</div>

				<div className={"col-md-6 CivilSocietySearch-taxonomy-link-container"}>
					<Popup
						className={"Popup-full-size"}
						trigger={
							<a className={"CivilSocietySearch-taxonomy-link"}>
								Learn more about the taxonomy
							</a>
						}
						modal
						open={this.state.isTaxonomyDetailOpen}
					>
						{(close) => (
							<div className={"row"}>
								<div className={"col-md-12"}>
									<h2>Learn more about the taxonomy</h2>
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
									}The taxonomy is used to classify the cybersecurity actors of the ecosystem.
								</div>

								<div className={"col-md-12 CivilSocietySearch-tree-taxonomy"}>
									{this.props.taxonomy !== null && this.props.taxonomy !== undefined
										&& this.props.taxonomy.categories !== undefined
										? <TreeTaxonomy
											companyAssignment={[]}
											taxonomy={this.props.taxonomy}
											category={"SERVICE GROUP"}
										/>
										: <Loading
											height={400}
										/>
									}
								</div>

								<div className={"col-md-12"}>
									{// eslint-disable-next-line
									}You can consult the ECSO market radar, source of CYBERSECURITY LUXEMBOURG taxonomy with the following link.
								</div>

								<div className={"col-md-12"}>
									<a
										href={"http://www.ecs-org.eu/newsroom/the-latest-edition-of-the-ecso-cybersecurity-market-radar-is-out-now"}
										target={"_blank"}
										rel="noreferrer"
									>
										Visit here
									</a>
								</div>
							</div>
						)}
					</Popup>
				</div>

				<div className={"col-md-12"}>
					<div className={"right-buttons"}>
						<button
							className={"blue-background"}
							onClick={this.props.onSearch !== undefined ? this.props.onSearch : null}
						>
							<i className="fas fa-search"/> Filter
						</button>
					</div>
				</div>
			</div>
		);
	}
}
