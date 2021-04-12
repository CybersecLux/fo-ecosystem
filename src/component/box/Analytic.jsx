import React from "react";
import "./Analytic.css";
import CountUp from "react-countup";
import dompurify from "dompurify";

export default class Analytic extends React.Component {
	render() {
		return (
			<div className="Analytic">
				<div className="Analytic-value">
					<CountUp
						start={0}
						end={this.props.value}
						duration={1}
						delay={0}
					/>
				</div>
				<div className="Analytic-desc">
					<div dangerouslySetInnerHTML={{
						__html: dompurify.sanitize(this.props.desc),
					}}/>
				</div>
			</div>
		);
	}
}
