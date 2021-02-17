import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MarkerIcon from './MarkerIcon';
import * as d3 from "d3";

const styles = ({
    container:{
        display: 'flex',
        flexDirection: "column",
        paddingTop:15,
    },
    ItemContainer:{
        display: 'flex',
        flexDirection: "row",
    },
    ImageContainer:{
        padding:5,
    },
    rowContainer:{
        //  display: 'flex',
        // flexDirection: "column",
    },
    videoImage:{
        // width: 100,
        // height: 50,
        // fill: "grey",
    },
    timeLabel:{
        fontSize:12,
        fill:"white",
        fontFamily:"Gadugi",
    },
});
function VideoShadow(Hightlight){
    if(Hightlight){
        return{stroke:"	#ff7575", strokeWidth:6, strokeOpacity:0.8};
    }
    else{
        return{};
    }
}
class VideoSequence extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleHover = this.handleHover.bind(this);
        this.handleHoverOut = this.handleHoverOut.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleHover(vid,index){
        console.log("[hover],VideoSequence",",",vid,",",index);
        this.props.SetHoverVideoIndex(vid);
    }
    handleClick(vid,index){
        console.log("[click],VideoSequence",",",vid,",",index);
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
    render() {
        if(this.props.video_sequences!=undefined){
            var ShowVideoItems = this.props.video_sequences.map( ([vid,cnnt],index) => {
            // console.log(this.props.video_info[vid].thumbnail);
            return(
                <div key={"videoSeqItem"+index} style = {styles.ItemContainer}>
                    <div>
                    <MarkerIcon text={index+1} 
                        radius={13}
                        // color={"#21435F"}
                        color={this.SentimentColor(this.props.video_info[vid].userFeedbackScore)}
                        />
                    </div>
                    <div style={{paddingLeft:5 ,width:""}}>
                        <Typography variant="title" component="h2">
                        <a href={"https://www.youtube.com/watch?v="+vid} 
                        target="_blank"
                        onMouseOver={this.handleHover.bind(this,vid,index)}
                        onMouseOut={this.handleHoverOut.bind(this)}
                        onClick={this.handleClick.bind(this,vid,index)}
                        >
                        {this.props.video_info[vid].title}
                        </a>
                        </Typography>
                    <g>
                        <div style ={styles.ImageContainer}>
                            <svg height="18" width="38">
                            <rect  x={0} 
                                    y={0} 
                                    width="37" height="15"
                                    rx="3"
                                    ry="3"
                                    style={{fill:"#111111", opacity: 0.7}}> 
                                </rect>
                                <text
                                    x={18} 
                                    y={12}
                                    textAnchor="middle"
                                    style={styles.timeLabel}
                                >{this.TimeProcess(this.props.video_info[vid].duration)}
                                </text>
                        </svg>
                        {/* <svg width="170" height="120">
                            <pattern id = {"VideoSeqImage"+vid} height = "100%" width = "100%" patternContentUnits = "objectBoundingBox">
                            <image xlinkHref = {this.props.video_info[vid].thumbnail} preserveAspectRatio = "xMidYMid meet" height = "1"/>
                            </pattern>
                            <rect key={vid+"VideoSeqImage"} 
                                fill={"url(#VideoSeqImage"+vid+")"} 
                                width="160" 
                                height="120"
                                // style = {styles.videoImage}
                                // style = {Object.assign({}, styles.videoImage, {stroke:"#ff5151", strokeWidth:5, strokeOpacity:0.8})}
                                style = {Object.assign({}, styles.videoImage, VideoShadow(vid===this.props.HoverVideoIndex))}
                                onMouseOver={this.handleHover.bind(this,vid)}
                                onMouseOut={this.handleHoverOut.bind(this)} >
                            </rect>
                        </svg> */}
                        </div>
                    {/* <hr></hr> */}
                    </g>
                    </div>
                    
                </div>
                
            )
            });
        }

        return (
            <div style = {styles.container}>
                {ShowVideoItems}
            </div>
            
        );
    }
}
export default VideoSequence;