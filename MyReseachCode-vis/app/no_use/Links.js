
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";

class Link extends Component{
    // ref: SVGGElement;
    constructor(props) {
      super(props);
      this.DoHighlight = this.DoHighlight.bind(this);
    }
    
    componentDidMount() {
      console.log("Update!!");
      const context: any = d3.select(this.ref);
      context
        .selectAll("line")
        .data(json.concept_relationship.links)
        .enter().append("line")
        .attr("stroke-width", function(d: d3Link) {
          return Math.sqrt(d.similarity);
        });
    }
    componentDidUpdate() {
      // console.log("Update!!",this.props.data.index,this.props.HighlightNodes);
      this.DoHighlight(ReactDOM.findDOMNode(this),this.props.HighlightNodes);
      // this.props.DoHighlightPath(this.props.data.index,ReactDOM.findDOMNode(this));
  }

  DoHighlight(loc,d_neighbors){
    console.log("loc",loc);
      // d3.select(loc).select("circle").style("opacity", function (d) {
      //     return d_neighbors.includes(d.index)? 1:0.1;
      // });
  }
    render() {
      return <g className="links" ref={(ref: SVGGElement) => this.ref = ref}/>;
    }
  }
export default Link;