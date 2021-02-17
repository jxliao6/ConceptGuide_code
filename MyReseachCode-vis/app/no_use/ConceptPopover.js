import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import Typography from '@material-ui/core/Typography';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Tooltip from '@material-ui/core/Tooltip';


// import { withStyles } from '@material-ui/core/styles';
const styles = {
    block: {
        margin:  10,
    },
    img:{
        // opacity: 0.7
    },
    mask:{
        position:"center",
        zIndex:9,
        fill: "white",
        opacity:0.8,
        // cursor: "pointer",
        // transition:"all 12s",
    },
    ConceptBigCircle:{
        // fill:"#B2DFDB",
        fill: "#D4D4D4",
        opacity:0.6,
        cursor: "pointer",
        // transition:"all 12s",
    },
    OuterCircle:{
        r:40
    },
    Sentcircle:{
        opacity: 0.7
    },
    mask:{
        opacity:"0.5",
        zIndex : 0,
    },
  };
// var color = d3.scaleLinear().domain([-0.15, 0.15]).range(['red', 'green']);



class ConceptPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            
        };
        this.Location = this.Location.bind(this);
        this.VideoRadius = this.VideoRadius.bind(this);
        this.handleClose = this.handleClose.bind(this);    
    }
    componentDidMount() {
        // this.d3Node = d3.select(ReactDOM.findDOMNode(this))
        //     .datum(this.props.data)
        //     .call(this.props.enterNode)
            
    }
    
    Location(index,numNodes){
        // var radius = 100;
        var radius = 100 + index *2.5;
        var angle = (index / (numNodes/2)) * Math.PI - 1/2*Math.PI;
        var cx = (radius * Math.cos(angle));
        var cy = (radius * Math.sin(angle));
        return [cx,cy];
    }
    VideoRadius(index){
        return (44-(index*2.5))
    }
    SentimentColor(score){
        // console.log(this.props.SentRange);
        var sentmin = this.props.SentRange[0]<0? this.props.SentRange[0]:-0.1;
        var color = d3.scaleLinear()
            .domain([sentmin,0,this.props.SentRange[1]-0.1])
            .range(["red","yellow", "green"])
            .interpolate(d3.interpolateHcl);
        return color(score);      
    }
    handleClose(){
        this.props.handleClose();
    }
    render() {
        if(this.props.NodeClicked==true){
            // console.log("click",this.props.data.videos_id);
            var numNodes = this.props.data.videos_id.length;
            var video_info = this.props.video_info;
            

            var ShowVideoLinks = this.props.data.videos_id.map( ([vid,cnnt],index) => {
                // console.log(vid,video_info[vid].comment_sentiment);
                return(
                    <g>
                    <Tooltip title={this.props.video_info[vid].title} placement="top">
                    <a xlinkHref={"https://www.youtube.com/watch?v="+vid} target="_blank" >
                        <circle key={vid} 
                            cx={this.Location(index,numNodes)[0]} 
                            cy={this.Location(index,numNodes)[1]} 
                            // r={styles.OuterCircle.r} 
                            r = {this.VideoRadius(index)}
                            fill={this.SentimentColor(video_info[vid].comment_sentiment)} 
                            style={styles.Sentcircle} >
                        </circle>
                        <pattern id = {"attachedImage"+vid} height = "150%" width = "150%" patternContentUnits = "objectBoundingBox">
                        <image xlinkHref = {video_info[vid]["thumbnail"]} preserveAspectRatio = "xMidYMid meet" width = "1.5" style={styles.img}/>
                        </pattern>
                        <circle key={vid+"img"} 
                            cx={this.Location(index,numNodes)[0]} 
                            cy={this.Location(index,numNodes)[1]} 
                            // r={styles.OuterCircle.r-7} 
                            r={this.VideoRadius(index)-7} 
                            fill={"url(#attachedImage"+vid+")"} 
                            style = {styles.circle} >
                        </circle>
                    </a>
                    </Tooltip>
                    </g>
                )
            });

            
            return(
                <g>
                {/* <rect x="10" y="10" width="100%" height="100%" fill="#666666" style={styles.mask} >
             </rect> */}
                <circle onClick={this.handleClose.bind(this)} r={"150"} style = {styles.ConceptBigCircle} > </circle>
                {/* 150 */}
                {ShowVideoLinks}
                </g>
                
            )
        }
            
        return (
            <g>
            </g>
        );
    }
}
export default ConceptPopover;