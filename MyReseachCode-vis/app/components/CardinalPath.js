import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";



const styles = ({
    path:{
        fill: "none",
        stroke: "#222222",
        strokeWidth: 2,
		strokeOpacity: 0.6,
		cursor: "pointer",
    }
      
});
var line = d3.line()
        // .curve(d3.curveCardinal.tension(0))
        .curve(d3.curveMonotoneY)
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });
        


class CardinalPath extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PathHovered:false,
        }
        this.PathHover = this.PathHover.bind(this);
    }

    PathHover(){
        // console.log("pathHover");
        this.setState({
            PathHovered : !this.state.PathHovered,
        });
    }
    
    render() {
        // console.log("learingmap",this.props);
        return (
            <svg>
                <defs>
                <marker id="CardinalMarker" viewBox="0 -5 10 10" refX="10" refY="0" markerWidth="3" markerHeight="3" orient="auto">
                <path d="M0,-5L10,0L0,5"/>
                </marker>
                </defs>
                <path 
                    d={line(this.props.data)}
                    style={styles.path}
                    opacity={this.state.PathHovered?1:0.3}
                    onMouseEnter ={this.PathHover.bind(this)}
                    onMouseLeave ={this.PathHover.bind(this)}
                    markerEnd={"url(#CardinalMarker)"}
                >
                </path>
            </svg>
        );
    }
    
}
export default CardinalPath;