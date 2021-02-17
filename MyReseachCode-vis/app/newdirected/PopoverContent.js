import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import MdOpenInNew from 'react-icons/lib/md/open-in-new';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import * as d3ScaleChromatic from 'd3-scale-chromatic';

var Max_commentSize = -1;
var Min_commentSize = 100000;

var color = d3.scaleLinear().domain([-0.2,0.2]).range(['red', 'green']);
// var color = d3.interpolateRdYlGn

const styles = theme => ({
    button: {
      padding: 5,
    },
  });




class PopoverContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            NumOfConceptsList: [],
        };
        this.buttonClick = this.buttonClick.bind(this);
        this.SentimentColor = this.SentimentColor.bind(this);
        this.CommentSize = this.CommentSize.bind(this);
    }
    
    componentDidMount() {
        // console.log("this node: ",this.props.video_info,this.props.node.videos_id);
        var newlist = [];
        for(var [index,val] in this.props.node.videos_id){
            // console.log("index",index);
            newlist.push(this.props.video_info[this.props.node.videos_id[index][0]]["NumOfComments"]);
        }
        // console.log(newlist);
        // console.log(Math.max(...newlist),Math.min(...newlist));
        Max_commentSize = Math.max(...newlist);
        Min_commentSize = Math.min(...newlist);
        console.log(Min_commentSize,Max_commentSize);
        
    }
    buttonClick(vid,e){
        // console.log("click",e,vid);
    }
    SentimentColor(score){
        return color(score);
    }
    CommentSize(score){
        var circleradius = d3.scaleLinear().domain([Min_commentSize,Max_commentSize]).range([3, 6]);
        return circleradius(score);
    }

    render() {
        var ShowVideoLinks = this.props.node.videos_id.map( ([vid,cnnt]) => {
            return (
            
            <div style={styles.button} >
            <Typography key= {vid} variant="subheading"
                className="node_info"><a href={"https://www.youtube.com/watch?v="+vid}>{this.props.video_info[vid].title}</a>
                    <MdOpenInNew size = {15} color="#666666" cursor="pointer" onClick={this.props.OpenDrawer.bind(this,vid)}/>
                    <p>
                        <svg height="12" width = "20">
                            <circle cx="6" cy="6" r={this.CommentSize(this.props.video_info[vid].NumOfComments)} fill={this.SentimentColor(this.props.video_info[vid].comment_sentiment)} >
                            </circle>
                        </svg>
                         : {this.props.video_info[vid].comment_sentiment.toFixed(2)}  |   {this.props.video_info[vid].NumOfComments} comments <br></br>
                        NumOfConceptWords : {this.props.node.conceptCountForEachVid[vid]} <br></br>
                        views: {this.props.video_info[vid].viewCount}<br></br>
                        likes  {this.props.video_info[vid].likeCount} <br></br>
                        dislikes: {this.props.video_info[vid].dislikeCount}<br></br>
                    </p>
                    <hr></hr>
            </Typography>
            </div>
            );
        });

        return ( 
            // <Typography className="node_info"><a href="https://www.w3schools.com/html/">Visit our HTML tutorial</a></Typography>
            <div>
            {ShowVideoLinks}
            </div>
        );
    }
}
export default PopoverContent;