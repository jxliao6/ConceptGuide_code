import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import json from './graphFile.json';
import * as d3 from "d3";
// import {BFS} from "./functions/BFS.js";

// import { select } from "d3-selection";
// import 'd3-transition';
// import { MAX_HEIGHT } from './strings';
var width = 800,
height = 800;
var force = d3.forceSimulation() 
    .force("charge", d3.forceManyBody().strength(-700) /*.distanceMin(100).distanceMax(2000))*/ )
    // .force("link", d3.forceLink().id( function(d) { return d.index }))
    .force("link", d3.forceLink().id( function(d) { return d.index }).distance(function(d) {return (1/((d.similarity+0.5))*200);}).strength(0.1))
    .force("center", d3.forceCenter(width / 2, height / 2));


class SimpleNetworkGraph extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }
  componentDidMount() {
    this.update();

  }
  componentDidUpdate(){
      console.log("componentdidupdate",this.props);
    //   var mode = this.props.HighlightMode;
    //   console.log("mode",mode);
    //   if(mode==1){d3.selectAll("circle").attr("fill","#555");}
    //   else if(mode==2){d3.selectAll("circle").attr("fill","blue");}
    //   else if(mode==3){d3.selectAll("circle").attr("fill","red");}
  }
  update() {
    // BFS();
    console.log("update",this.props.HighlightMode);
    console.log("json",json);
    var width = 800,
    height = 800;
    var mode = this.props.HighlightMode;
    var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    // var defs = svg.append("defs");  
    // var arrowMarker = defs.append('marker')
    //     .attr({'id':'arrowhead',
    //             'viewBox':'0 -5 10 10',
    //             'refX':25,
    //             'refY':0,
    //             //'markerUnits':'strokeWidth',
    //             'orient':'auto',
    //             'markerWidth':6,
    //             'markerHeight':6,
    //             'xoverflow':'visible'})
    //     .append('svg:path')
    //         .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    //         .attr('fill', '#5b5b5b') //#ccc
    //         .attr('stroke','#5b5b5b');
    
    // var force = d3.forceSimulation() 
    // .force("charge", d3.forceManyBody().strength(-700) /*.distanceMin(100).distanceMax(2000))*/ )
    // // .force("link", d3.forceLink().id( function(d) { return d.index }))
    // .force("link", d3.forceLink().id( function(d) { return d.index }).distance(function(d) {return (1/((d.similarity+0.5))*200);}).strength(0.1))
    // .force("center", d3.forceCenter(width / 2, height / 2));
    // .force("y", d3.forceY(0.001))
    // .force("x", d3.forceX(0.001))


    force
    .nodes(json.concept_relationship.nodes) 
    .force("link").links(json.concept_relationship.links);

    var link = svg.selectAll(".link")
                .data(json.concept_relationship.links)
                .enter()
                .append("line")
                .attr("class", "link")
                .attr('stroke','#ddd')
                .attr('opacity',function(d) {
                    if(d.prerequisite==null){return '0.1' }
                    else{return '1'}
                });

                
    var node = svg.selectAll(".node")
    .data(json.concept_relationship.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));
    
    node.append('circle')
                .attr('r', 3)
                .attr('fill', function (d) {
                   return '#555';
                });

    node.append("text")
        .attr("dx", -18)
        .attr("dy", 8)
        .style("font-family", "overwatch")
        .style("font-size", "18px")
        .text(function (d) {
            return d.name
        });

    force.on("tick", function () {
        link.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });
          node.attr("transform", function (d) {
              return "translate(" + d.x + "," + d.y + ")";
          });
        });
        function dragstarted(d) {
          if (!d3.event.active) force.alphaTarget(0.5).restart();
          d.fx = d.x;
          d.fy = d.y;
      }
      
      function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
      }
      
      function dragended(d) {
          if (!d3.event.active) force.alphaTarget(0.5);
          d.fx = null;
          d.fy = null;
      } 
  }
  render() {



    return (
        <div id="chart"  width="1500" height="1500" />
    );
  }
}
// SimpleNetworkGraph.propTypes = {
//   dataset: PropTypes.array.isRequired,
//   onClick: PropTypes.func.isRequired,
// }
export default SimpleNetworkGraph;