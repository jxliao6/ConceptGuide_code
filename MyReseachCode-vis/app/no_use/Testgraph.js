import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import json from './graphFile.json';
import * as d3 from "d3";
import Nodes from "./Nodes";
import Links from "./Links";

class Testgraph extends Component{
    // ref: HTMLDivElement;
    // simulation: any;
  
    constructor(props){
        console.log(json.concept_relationship.nodes);
      super(props);
      this.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d){
          return d.index;
        }))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(this.props.width / 2, this.props.height / 2))
        .nodes(json.concept_relationship.nodes);
  
      this.simulation.force("link").links(json.concept_relationship.links);
    }
  
    componentDidMount() {
      const node = d3.select(".nodes").selectAll("circle");
      const link = d3.select(".links").selectAll("line");
  
      this.simulation
      // .nodes(json.concept_relationship.nodes)
      .on("tick", ticked);
  
      function ticked() {
        link
          .attr("x1", function(d) {
            return d.source.x;
          })
          .attr("y1", function(d) {
            return d.source.y;
          })
          .attr("x2", function(d) {
            return d.target.x;
          })
          .attr("y2", function(d) {
            return d.target.y;
          });
  
          node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
      }
    }
  
    render() {
    //   const { width, height, graph } = this.props;
  
      return (
        <svg className="container" width={800} height={800}>
          {/* <Links links={json.concept_relationship.links}/> */}
          {/* <Nodes nodes={json.concept_relationship.nodes} simulation={this.simulation}/> */}
        </svg>
      );
    }
}
export default Testgraph;