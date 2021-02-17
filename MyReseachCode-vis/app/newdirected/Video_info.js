import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";

const styles = theme => ({
    area: {
      margin:10,
    //   padding: 20,
    //   overflow:auto
    },
    paper: {
          padding: 10, //theme.spacing.unit * 2,
          margin : 20,//theme.spacing.unit * 4,
        },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        },
    text:{
        margin:10,
        padding:20,
        fontSize:16,
    }
  });

class Video_info extends Component {
    constructor(props) {
        super(props);
        // this.buttonClick = this.buttonClick.bind(this);
    }
    
    componentDidMount() {
    }
    // buttonClick(vid,e){
    //     console.log("click",e,vid);
    // }
    
    render() {
        return ( 
            // <Typography className="node_info"><a href="https://www.w3schools.com/html/">Visit our HTML tutorial</a></Typography>
            <div>
                <IconButton color="inherit" onClick={this.props.CloseDrawer} aria-label="Close">
                    <CloseIcon /> 
                </IconButton>
                
                <Paper  elevation={1} style={styles.paper}>
                <div style={styles.container}>
                        <Typography variant="headline" component="h5" >
                            {this.props.videos_info[this.props.vid].transcript}
                        </Typography>
                </div>
                    
                </Paper>
            </div>
        );
    }
}
export default Video_info;