
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
// import json from './graphFile.json';
import * as d3 from "d3";

class Nodes extends Component{
    // ref: SVGGElement;
    // constructor(props) {
    //     super(props);
    // }
    componentDidMount() {
     console.log("Node",this.props.nodes);
      const context: any = d3.select(this.ref);
      const simulation = this.props.simulation;
      const color = d3.scaleOrdinal(d3.schemeCategory20);
      
      context.selectAll("circle")
        .data(this.props.nodes)
        .enter().append("circle")
        .attr("r", 5)
        // .attr("fill", function(d) {
        // //   return color(d.group.toString());
        // return '#555';
        // })
        .attr("fill","red")
        .call(d3.drag()
            .on("start", onDragStart)
            .on("drag", onDrag)
            .on("end", onDragEnd))
        .append("title")
          .text(function(d) {
            return d.name;
          });
  
      function onDragStart(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      }
  
      function onDrag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
  
      function onDragEnd(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }
    }
  
    render() {
      return <g className="nodes" ref={(ref: SVGGElement) => this.ref = ref}/>;
        // return <svg> </svg>;
    }
  }
  export default Nodes;