import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';

const styles = ({
    // root: {
    //     // flexGrow: 1,
    //     overflowX: "scroll",
    //     overflowY: "scroll",
    //   },
      
});

class MarkerIcon extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        // console.log("markerIcon",this.props);
        return (
            // <div style={styles.root}>
            <svg 
                x={this.props.cx==undefined?0:this.props.cx}
                y={this.props.cx==undefined?0:this.props.cy} 
                width={(this.props.radius)*2} height={(this.props.radius)*2} 
                viewBox={"0 0 "+(this.props.radius+2)*2+" "+(this.props.radius+2)*2}>
                
                <circle cx={this.props.radius+2}
                        cy={this.props.radius+2}
                        r={this.props.radius}
                        stroke="white"
                        strokeWidth="2"
                        fill={this.props.color}/>
                <text fontSize={this.props.radius*2-10}
                    fill="white"
                    // font-family="Verdana"
                    textAnchor="middle"
                    alignmentBaseline="baseline"
                    x={this.props.radius+2}
                    y={(this.props.radius+1)*3/2}>{this.props.text}</text>
            </svg>
        // </div>
        );
    }
    
}
export default MarkerIcon;