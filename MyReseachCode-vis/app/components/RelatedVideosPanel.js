import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import MarkerIcon from './MarkerIcon';
import YoutubeIcon from './youtube.png';
const BigCircleRadius = 130;//150
var MarkerIndex=[];
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
        // cursor: "pointer",
    },
    Sentcircle:{
        opacity: 0.7,
    },
    conceptlabel:{
        // fontFamily:"EB Garamond",
        fontSize:15,
        textAnchor:"middle",
        fontStyle:"italic",
        textShadow:"2px 2px 4px #888"
    },
    timeLabel:{
        fontSize:12,
        fill:"white",
        fontFamily:"Gadugi",
    },
    videotooptip:{
        maxWidth: 15
    },
    videotooptip_label1:{
        fontSize:14,
        maxWidth: 250,
        // wordBreak: "break-all",
        lineHeight: "17px",
    },
    videotooptip_label2:{
        fontSize:12,
        maxWidth: 137,
        maxHeight:30,
        overflow : "hidden",
        textOverflow : "ellipsis",
        whiteSpace : "nowrap",
        // wordBreak: "break-all",
        lineHeight: "15px",
    }
  };

  
  function CircleShadow(Hightlight){
    if(Hightlight){
        return{stroke:"#ff7575", strokeWidth:3, strokeOpacity:0.8};
    }
    else{
        return{};
    }
}
  

class RelatedVideosPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltip_open:false,
            // markIndex:[], // if markerlabel already have
            // anchorEl: null,
            // NodeClicked: false
        };
        this.Location = this.Location.bind(this);
        this.VideoRadius = this.VideoRadius.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        this.handleHover = this.handleHover.bind(this);
        this.handleHoverOut = this.handleHoverOut.bind(this);   
        this.videoClick = this.videoClick.bind(this);
        this.YoutubeIconClick = this.YoutubeIconClick.bind(this);
        // this.CheckMarkerIndex = this.CheckMarkerIndex.bind(this);  
        this.RenderNumMarker = this.RenderNumMarker.bind(this);  
        
    }
    
    componentWillMount(){
        MarkerIndex=[];
    }
    componentWillUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.data !== prevProps.data) {
            MarkerIndex=[];
        }
      }

    Location(index,numNodes,r){
        var radius = r + index *2.5;// var radius = 100 + index *2.5;
        var angle = (index / (numNodes/2)) * Math.PI - 1/2*Math.PI;
        var cx = (radius * Math.cos(angle));
        var cy = (radius * Math.sin(angle));
        return [cx,cy];
    }
    VideoRadius(index){
        // return (44-(index*2.5));
        return (38-(index*2.5));
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
    
    // handleClose(){
    //     this.props.SetPopoverIndexes("remove",this.props.data.index);
    // }
    handleHover(vid,index){
        console.log("[hover],RelatedVideos",",",vid,",",index);
        this.props.SetHoverVideoIndex(vid);
    }
    videoClick(vid,index){
        console.log("[click],RelatedVideos",",",vid,",",index);
    }
    handleHoverOut(){
        this.props.SetHoverVideoIndex(null);
    }

    SentimentColor(score){
        var sentmin = this.props.SentRange[0]<0? this.props.SentRange[0]:-0.1;
        var color = d3.scaleLinear()
            .domain([sentmin,0,this.props.SentRange[1]-0.1])
            .range(["red","yellow", "green"])
            .interpolate(d3.interpolateHcl);
        return color(score);      
    }
    TimeProcess(str){
        if (str.indexOf('S') > -1){
            return str.replace("PT","").replace("H",":").replace("M",":").replace("S","");
        }else{
            return str.replace("PT","").replace("H",":").replace("M",":00");
        }
    }
    CheckMarkerIndex(index,num){
        if ((index==0 && num>0)||(index==1 && num>0)){
            
            MarkerIndex.push(index);
            // console.log("MarkerIndex",MarkerIndex);
            // this.setState({
            //     markIndex: [...this.state.markIndex, index]
            // });
        }
    }
    RenderNumMarker(vid,index,num,x,y,userFeedbackScore){
        // console.log("RenderNumMarker",vid,index,num);
        x = (x-13)-13;
        y = (y-13)-18;
        if (index==0 && num>0 && MarkerIndex[0]==index){
            // this.props.setFlag(true);
            return(
                <MarkerIcon 
                    cx={x}
                    cy={y}
                    text={num} 
                    radius={13}
                    // color={"#21435F"}
                    color={this.SentimentColor(userFeedbackScore)}
                />
            );
        }else if (index==1 && num>0 &&MarkerIndex[0]==index){
            // this.props.setFlag(true);
            return(
                <MarkerIcon 
                    cx={x}
                    cy={y}
                    text={num} 
                    radius={13}
                    color={this.SentimentColor(userFeedbackScore)}
                    // color={this.SentimentColor(this.props.video_info[vid].userFeedbackScore)}
                />
            )
        }else{
            return null
        }
    }
    YoutubeIconClick(){
        console.log("[click],YoutubeSearch",",",this.props.data.name);
    }
    render() {
        // console.log("check data",this.props.video_sequences);
        var vlist=[]
        if (this.props.video_sequences!=undefined){
            for (var i=0;i<this.props.video_sequences.length;i++) {
                vlist.push(this.props.video_sequences[i][0])
            }
        }
        var width = BigCircleRadius*2;//+60
        var height = width;
        var center= width/2;
        if(this.props.data!=undefined){
            // console.log("RelatedVideodata",this.props);
            var numNodes = this.props.data.videos_id.length;
            var video_info = this.props.video_info;
            var LikesList=[]
            this.props.data.videos_id.map( ([vid,cnnt],index) => {LikesList.push(video_info[vid].likeCount);});
            var likesRange=[Math.min(...LikesList),Math.max(...LikesList)];
            var flag=0;
            var ShowVideoLinks = this.props.data.videos_id.map( ([vid,cnnt],index) => {
                // console.log(index,vid,vlist.indexOf(vid));
                // console.log("video_info[vid].userFeedbackScore",video_info[vid].userFeedbackScore);
                return(
                    <g key={"PopoverNode"+index}>
                        <Tooltip title={<div style={this.state.tooltip_open?styles.videotooptip_label2:styles.videotooptip_label1}
                        enterTouchDelay={0}
                        >
                        {/* {this.props.video_info[vid].title.length>38?this.props.video_info[vid].title.substring(0,38)+"...":this.props.video_info[vid].title} */}
                        {this.state.tooltip_open?this.props.video_info[vid].title+"...":this.props.video_info[vid].title}
                        </div>} 
                            placement="top"
                            open={this.state.tooltip_open?true:null}
                            >
                        <a xlinkHref={"https://www.youtube.com/watch?v="+vid} target="_blank" >
                            <circle key={vid} 
                                cx={center+this.Location(index,numNodes,83)[0]} 
                                cy={center+this.Location(index,numNodes,83)[1]} 
                                r = {this.VideoRadius(index)}
                                fill={this.SentimentColor(video_info[vid].userFeedbackScore)} 
                                // style={styles.Sentcircle} 
                                style = {Object.assign({}, styles.Sentcircle, CircleShadow(vid===this.props.HoverVideoIndex))}    
                            >
                            </circle>
                            
                            <pattern id = {"attachedImage"+vid} height = "150%" width = "150%" patternContentUnits = "objectBoundingBox">
                            <image xlinkHref = {video_info[vid]["thumbnail"]} preserveAspectRatio = "xMidYMid meet" width = "1.5" style={styles.img}/>
                            </pattern>
                            <circle key={vid+"img"} 
                                cx={center+this.Location(index,numNodes,83)[0]} 
                                cy={center+this.Location(index,numNodes,83)[1]} 
                                // r={styles.OuterCircle.r-7} 
                                r={this.VideoRadius(index)-6} 
                                fill={"url(#attachedImage"+vid+")"} 
                                style = {styles.circle} 
                                onMouseOver={this.handleHover.bind(this,vid,index)}
                                onMouseOut={this.handleHoverOut.bind(this)} 
                                onClick={this.videoClick.bind(this,vid,index)}
                            >
                            </circle>
                        </a>
                        </Tooltip>
                        
                        <rect  x={center+this.Location(index,numNodes,83)[0]-18} 
                            y={center+this.Location(index,numNodes,83)[1]+this.VideoRadius(index)-18} 
                            width="37" height="15"
                            rx="3"
                            ry="3"
                            style={{full:"#888888", opacity: 0.7}}> 
                        </rect>
                        <text
                            x={center+this.Location(index,numNodes,83)[0]} 
                            y={center+this.Location(index,numNodes,83)[1]+this.VideoRadius(index)-6}
                            textAnchor="middle"
                            style={styles.timeLabel}
                        >{this.TimeProcess(this.props.video_info[vid].duration)}
                        </text>
                        <pattern id = {"YoutubeImage"+vid} height = "100%" width = "100%" patternContentUnits = "objectBoundingBox">
                            <image xlinkHref = {YoutubeIcon} preserveAspectRatio = "xMidYMid meet" width = "1"/>
                        </pattern>
                        
                        <text 
                            style={styles.conceptlabel} 
                            // dx="5" dy="8"
                            x={center} y={center}   
                        >  
                            {this.props.data.name}
                        </text> 
                        {/* Youtube Search Icon */}
                        <a xlinkHref={"https://www.youtube.com/results?search_query="+this.props.data.name} target="_blank" >
                            <rect 
                                width="28" 
                                height="26"
                                fill={"url(#YoutubeImage"+vid+")"} 
                                x={center-13} y={center+10}  
                                style = {styles.circle} 
                                onClick={this.YoutubeIconClick.bind(this)}
                                >
                                <title>Search on Youtube</title>
                            </rect>
                        </a>
                        {this.CheckMarkerIndex(index,vlist.indexOf(vid)+1)}
                        {/* {this.RenderNumMarker(vid,index,vlist.indexOf(vid)+1,center+this.Location(index,numNodes,83)[0],center+this.Location(index,numNodes,83)[1],this.props.video_info[vid].userFeedbackScore)} */}
                    </g>
                )
                
            });
            var ShowMarkerIcons = this.props.data.videos_id.map( ([vid,cnnt],index) => {
                return(
                    <g key={"ShowMarkerIcons"+index}> 
                        {this.RenderNumMarker(vid,index,vlist.indexOf(vid)+1,center+this.Location(index,numNodes,83)[0],center+this.Location(index,numNodes,83)[1],this.props.video_info[vid].userFeedbackScore)}
                    </g>
                )
                
            });
            return (
                <svg width={width} height={height}>
                <g className='node'>
                    <circle 
                        // onClick={this.handleClose.bind(this)}
                        cx={center}
                        cy={center}
                        r={BigCircleRadius} 
                        style = {styles.ConceptBigCircle}>  
                    </circle>
                    {ShowVideoLinks}
                    {ShowMarkerIcons}
                </g>
                </svg>
            );
        }
        return (
            <g className='node'  >
                {/* <circle  ref="dragMe" onClick={this.handleClose.bind(this)} r={"150"} style = {styles.ConceptBigCircle}></circle> */}
                {/* {ShowVideoLinks} */}
            </g>
        );
    }
}
export default RelatedVideosPanel;