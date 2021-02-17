import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Graph from '../newdirected/Graph';
import VideoSequence from './VideoSequence';
import ConceptSequence from './ConceptSequence';
import Legend from './Legend';
import WordCloud from './WordCloud';
import RelatedVideosPanel from './RelatedVideosPanel';
import ConceptDetailPanel from './ConceptDetailPanel';
import Notification from './Notification';
const styles = ({
  container: {
      // justifyContent: 'center',
    display: 'flex',
    flexDirection: "row",
    // flexGrow: 1,
    flexWrap: 'wrap',
    // margin:10,
    // padding:10
    paddingTop:10,
    paddingLeft:10,
    // marginTop:10,
    marginLeft:10

  },
    LeftField: {
        // display:'flex',
        // width: 900,
        // height: 700,
        // overflowX: "scroll",
        // overflowY: "hidden",
        // padding: 20,
        // margin : 20,
  },
});
var SentRange=[]
var ConceptRange=[]
class LearningMapFrame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            HoverConceptIndex:null,
            HoverVideoIndex:null,
            PopoverIndexes:[],
            Path_ConceptIndex:null,
            BigCircleIndex:null,
        };
        this.SetHoverConceptIndex = this.SetHoverConceptIndex.bind(this);
        this.SetHoverVideoIndex = this.SetHoverVideoIndex.bind(this);
        this.SetPopoverIndexes = this.SetPopoverIndexes.bind(this);
        this.SetPath_ConceptIndex = this.SetPath_ConceptIndex.bind(this);
        this.SetBigCircleIndex = this.SetBigCircleIndex.bind(this);
    }
    componentWillMount(){
        console.log("[graph]",",",this.props.data.search_info.key);
        // console.log("cheeeee",this.props.data.concept_relationship.nodes);
        // calcalate SentimentScoreRange [SentScoreMin,SentScoreMax];
        var tmpList = [];
        for(var e in this.props.data.videos_info){
           
            tmpList.push(this.props.data.videos_info[e].userFeedbackScore);
        };
        var tmpList2 = [];
        for(var e in this.props.data.concept_relationship.nodes){
            tmpList2.push(this.props.data.concept_relationship.nodes[e].count);
        };
        // console.log("SentRange",[Math.min(...tmpList),Math.max(...tmpList)]);
        // console.log("tmpList2",tmpList2);
        SentRange=[Math.min(...tmpList),Math.max(...tmpList)];
        ConceptRange=[Math.min(...tmpList2),Math.max(...tmpList2),tmpList2.reduce((a, b) => a + b, 0)];
    }
    SetHoverConceptIndex(i){
        // console.log("[hover] conceptMapNode",i);
        this.setState({
            HoverConceptIndex: i
        });
    }
    SetHoverVideoIndex(vid){
        this.setState({
            HoverVideoIndex: vid
        });
    };
    SetPopoverIndexes(method,index){
        if(method=="add"){
            if(this.state.PopoverIndexes.includes(index)==false){
                this.setState({
                    PopoverIndexes: [...this.state.PopoverIndexes, index]
                    // PopoverIndexes:this.state.PopoverIndexes.concat([index])
                });
            }
        }else if (method=="remove"){
            this.setState({
                PopoverIndexes:this.state.PopoverIndexes.filter(val => val !== index)
            });
        }else if(method=="clear"){
            this.setState({
                PopoverIndexes:[]
            });
        }   
    }
    SetPath_ConceptIndex(method,index){
        if(method=="add"){
            this.setState({
                Path_ConceptIndex: index
            });
        }else if(method=="clear"){
            console.log("[close] ConceptDetailPanel");
            this.setState({
                Path_ConceptIndex:null,
                BigCircleIndex:null
            });
        }   
    }
    SetBigCircleIndex(index){
        this.setState({
            BigCircleIndex:index
        });
    }
    render() {
        var HighlightConceptTextIndex = this.state.HoverVideoIndex==null? []:this.props.data.VideoSequence_ConceptInfo[this.state.HoverConceptIndex][this.state.HoverVideoIndex];
        // console.log("windowheight",window.innerHeight);
        return (
            <div style={styles.container}>
            {/* {this.props.data.search_info.key} */}
            {/* <div style = {styles.LeftField} > */}
            <div width={window.innerWidth-50} height ={window.innerHeight-100}>
                <Typography variant="headline" component="h5">
                {this.props.data.search_info.key}
                </Typography>
                <Legend Path_ConceptIndex={this.state.Path_ConceptIndex} 
                    BigCircleIndex={this.state.BigCircleIndex==null?this.state.Path_ConceptIndex:this.state.BigCircleIndex} 
                    ConceptRange={ConceptRange}
                    data = {this.props.data.concept_relationship.nodes}
                />
                {/* <WordCloud videos_info={this.props.data.videos_info} HoverVideoIndex={this.state.HoverVideoIndex}/> */}
                <Graph data={this.props.data} 
                    HoverConceptIndex = {this.state.HoverConceptIndex}
                    SetHoverConceptIndex={this.SetHoverConceptIndex} 
                    OpenDrawer={(text) =>props.OpenDrawer(text)} 
                    width={window.innerWidth-50} height ={window.innerHeight-100}
                    SentRange ={SentRange}
                    ConceptRange={ConceptRange}
                    HighlightConceptIndex={HighlightConceptTextIndex}
                    SetHoverVideoIndex = {this.SetHoverVideoIndex}
                    HoverVideoIndex = {this.state.HoverVideoIndex}
                    Path_ConceptIndex={this.state.Path_ConceptIndex}
                    SetPath_ConceptIndex={this.SetPath_ConceptIndex}
                    BigCircleIndex={this.state.BigCircleIndex}
                    />
            </div>
            <ConceptDetailPanel
                data = {this.props.data}
                Path_ConceptIndex={this.state.Path_ConceptIndex}
                SetPath_ConceptIndex={this.SetPath_ConceptIndex}
                SentRange = {SentRange}
                SetHoverVideoIndex = {this.SetHoverVideoIndex}
                HoverVideoIndex = {this.state.HoverVideoIndex}
                HighlightConceptTextIndex={HighlightConceptTextIndex}
                BigCircleIndex ={this.state.BigCircleIndex}
                SetBigCircleIndex ={this.SetBigCircleIndex}
            />
            <Notification open={this.state.Path_ConceptIndex==null}/>
            </div>
            
        );
    }
}
export default LearningMapFrame;