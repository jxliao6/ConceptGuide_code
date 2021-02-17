import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';


// import { withStyles } from '@material-ui/core/styles';
const styles = {
    circle: {
        cursor: "pointer",
        // fill:"red",
    }, 
    ConceptBigCircle:{
        // fill:"#B2DFDB",
        fill: "#D4D4D4",
        opacity: 0.55,
        cursor: "pointer",
        // transition:"all 12s",
    },
    Sentcircle:{
        opacity: 0.7,
    },
    conceptlabel:{
        // fontFamily:"EB Garamond",
        fontSize:19,
        textAnchor:"middle",
        fontStyle:"italic",
        textShadow:"2px 2px 4px #888"
    },
  };

  
  function CircleShadow(Hightlight){
    if(Hightlight){
        return{stroke:"#ff7575", strokeWidth:3, strokeOpacity:0.8};
    }
    else{
        return{};
    }
}
  

class PopoverNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // anchorEl: null,
            // NodeClicked: false
        };
        this.Location = this.Location.bind(this);
        this.VideoRadius = this.VideoRadius.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.handleHoverOut = this.handleHoverOut.bind(this);   
    }
    componentWillMount() {
        console.log("popover create");
    }
    componentDidMount() {
        console.log("popover create");
        this.d3Node = d3.select(ReactDOM.findDOMNode(this))
            .datum(this.props.data)
            // .call(this.props.enterNode)
    }

    // let the node can be moved!!!
    componentDidUpdate() {
        this.d3Node.datum(this.props.data)
            .call(this.props.updateNode)
        // console.log("Update!!",this.props.data.index,this.props.HighlightNodes);
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
    SentcircleArc(r,percentage){
        // var percentage = 1/4;
        var arc = d3.arc()
        .innerRadius(r)
        .outerRadius(r);
        return arc({startAngle:0, endAngle:(Math.PI*1/4+Math.PI*7/4*percentage)});      
    }
    ArcPercentage(this_likes,likesRange){
        if(likesRange[0]!=likesRange[1]){
            var ArcSize = d3.scaleLinear()
            .domain([likesRange[0],likesRange[1]])
            .range([0,1])
            return ArcSize(this_likes);   
        }else{
            return 1;
        }
           
    }
    handleClose(){
        this.props.SetPopoverIndexes("remove",this.props.data.index);
    }
    handleHover(vid){
        this.props.SetHoverVideoIndex(vid);
    }
    handleHoverOut(){
        this.props.SetHoverVideoIndex(null);
    }

    render() {
        var numNodes = this.props.data.videos_id.length;
        var video_info = this.props.video_info;
        var LikesList=[]
        this.props.data.videos_id.map( ([vid,cnnt],index) => {LikesList.push(video_info[vid].likeCount);});
        var likesRange=[Math.min(...LikesList),Math.max(...LikesList)];
        var ShowVideoLinks = this.props.data.videos_id.map( ([vid,cnnt],index) => {
            // console.log(vid,video_info[vid].likeCount);
            
            return(
                <g key={"PopoverNode"+index}>
                    <Tooltip title={this.props.video_info[vid].title} placement="top">
                    <a xlinkHref={"https://www.youtube.com/watch?v="+vid} target="_blank" >
                        <circle key={vid} 
                            cx={this.Location(index,numNodes)[0]} 
                            cy={this.Location(index,numNodes)[1]} 
                            // r={styles.OuterCircle.r} 
                            r = {this.VideoRadius(index)}
                            fill={this.SentimentColor(video_info[vid].userFeedbackScore)} 
                            // style={styles.Sentcircle} 
                            style = {Object.assign({}, styles.Sentcircle, CircleShadow(vid===this.props.HoverVideoIndex))}    
                        >
                        </circle>
                        {/* <path 
                            transform={"translate("+this.Location(index,numNodes)[0]+","+this.Location(index,numNodes)[1]+")"}
                            style={styles.Sentcircle} 
                            strokeWidth={9}
                            stroke={this.SentimentColor(video_info[vid].comment_sentiment)}
                            d={this.SentcircleArc(this.VideoRadius(index)-4,this.ArcPercentage(video_info[vid].likeCount,likesRange))}
                        ></path> */}
                        <pattern id = {"attachedImage"+vid} height = "150%" width = "150%" patternContentUnits = "objectBoundingBox">
                        <image xlinkHref = {video_info[vid]["thumbnail"]} preserveAspectRatio = "xMidYMid meet" width = "1.5" style={styles.img}/>
                        </pattern>
                        <circle key={vid+"img"} 
                            cx={this.Location(index,numNodes)[0]} 
                            cy={this.Location(index,numNodes)[1]} 
                            // r={styles.OuterCircle.r-7} 
                            r={this.VideoRadius(index)-7} 
                            fill={"url(#attachedImage"+vid+")"} 
                            style = {styles.circle} 
                            onMouseOver={this.handleHover.bind(this,vid)}
                            onMouseOut={this.handleHoverOut.bind(this)} 
                        >
                        </circle>
                    </a>
                    </Tooltip>
                    <text style={styles.conceptlabel} dx="5" dy="8">  {this.props.data.name}</text> 
                </g>
            )
        });
        return (
            
            <g className='node' transform={"translate(" + this.props.data.x + "," + this.props.data.y + ")"} >
                {/* <circle ref="dragMe" onMouseOver={this.handle.bind(this)}/> */}
                <circle  ref="dragMe" onClick={this.handleClose.bind(this)} r={"150"} style = {styles.ConceptBigCircle}></circle>
                {ShowVideoLinks}
            </g>
        );
    }
}
export default PopoverNode;