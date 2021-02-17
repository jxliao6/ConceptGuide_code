import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';


// import { withStyles } from '@material-ui/core/styles';
const styles = {
    mask:{
        opacity:"0.01",
        fill: "white",
    },
};


class Masker extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        this.props.SetPath_ConceptIndex("clear",null);
    }
    render() {
        if(this.props.Path_ConceptIndex!=null){
            return(
                <rect 
                    style={styles.mask} 
                    width={this.props.width} 
                    height={this.props.height} 
                    onClick={this.handleClick.bind(this)}
                >
                </rect>
            );
        }
        return (
            null
        );
    }
}
export default Masker;