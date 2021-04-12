import React from "react";
import "./ActorSearch.css";
import Popup from "reactjs-popup";
import FormLine from "./FormLine.jsx";
import Loading from "../box/Loading.jsx";
import TreeTaxonomy from "../chart/TreeTaxonomy.jsx";
import getLeavesOfNode from "../../utils/taxonomy.jsx";

export default class ActorSearch extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isTaxonomyDetailOpen: false,
			valueChainOrder: ["IDENTIFY", "PROTECT", "DETECT", "RESPOND", "RECOVER"],
		};
	}

	getTaxonomySelectOptions() {
		const options = [];
		const solutionCategories = this.props.analytics.taxonomy_values
			.filter((v) => v.category === "VALUE CHAIN");

		solutionCategories.sort((a, b) => this.state.valueChainOrder.indexOf(a.name)
			- this.state.valueChainOrder.indexOf(b.name));

		for (let i = 0; i < solutionCategories.length; i++) {
			options.push({
				label: solutionCategories[i].category + " - " + solutionCategories[i].name,
				value: solutionCategories[i].id,
				color: "#000000",
			});

			getLeavesOfNode(this.props.analytics, [solutionCategories[i]]).forEach((l) => {
				options.push({
					label: solutionCategories[i].name + " - " + l.name,
					value: l.id,
					color: "#AAAAAA",
				});
			});
		}

		return options;
	}

	render() {
		return (
			<div className={"ActorSearch row"}>
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
						label={"Classification"}
						type={"multiselect"}
						value={this.props.filters.taxonomy_values === undefined || this.props.analytics === null
							? [] : this.props.filters.taxonomy_values}
						options={this.props.analytics !== null
							&& this.props.analytics.taxonomy_values !== undefined
							? this.getTaxonomySelectOptions()
							: []}
						onChange={(v) => this.props.onChange("taxonomy_values", v)}
					/>
				</div>

				<div className={"col-md-6"}>
				</div>

				<div className={"col-md-6 ActorSearch-taxonomy-link-container"}>
					<Popup
						className={"Popup-full-size"}
						trigger={
							<a className={"ActorSearch-taxonomy-link"}>
								Learn more about the classification
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

								<div className={"col-md-12 ActorSearch-tree-taxonomy"}>
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
