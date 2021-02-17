import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VideoSequence from './VideoSequence';
import ConceptSequence from './ConceptSequence';
import RelatedVideosPanel from './RelatedVideosPanel'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = ({
    rootTitle:{
        // margin:10,
        paddingBottom:20,
        textAlign:"center",
        fontSize:20,
        fontFamily:"Cambria"
    },
    containerTitle:{
        display:"flex",
        fontSize:14,
        fontWeight:"bold"
    },
    OuterContainer: {
        display: 'flex',
        flexDirection: "row",
        position:"absolute",
        // left:930,
        right:'3%',
        flexWrap: 'no-wrap',
        zIndex:6
        // margin:10,
        // padding:10
    },
  
  paper2: {
    width: 520,
    // height: 850,
    overflowX: "hidden",
    overflowY: "scroll",
    padding: 15,
    margin : 15,
  },
  paper2_UpperContainer: {
    display: 'flex',
    flexDirection: "column",
  },
  paper2_BelowContainer: {
    display: 'flex',
    flexDirection: "row",
  },
  container3_1: {
    width: 225,
    // height: 500,
  },
  container3_2: {
    width: 265,
    // height: 500,
  },
  CloseBotton: {
    // marginLeft: 5,
    float:"right",
    marginRight: 1,

  },
  content:{
    // display: "block",
    margin: "auto",
    display:"flex"
  }
});

class ConceptDetailPanel extends Component {
    constructor(props) {
        super(props);
        this.CloseOnClick = this.CloseOnClick.bind(this);
    }
    CloseOnClick(){
        this.props.SetPath_ConceptIndex("clear",null);
    }
    render() {

        if(this.props.Path_ConceptIndex!=null){
            return (
                <div style = {styles.OuterContainer}>
                    {/* <Paper style={styles.paper2} elevation={13}> */}
                    <Paper style= {Object.assign({}, styles.paper2, {height:window.innerHeight-130})} elevation={13}>
                    <div style={styles.rootTitle}>
                    {this.props.data.concept_relationship.nodes[this.props.Path_ConceptIndex].name}
                    <IconButton style={styles.CloseBotton} color="inherit" aria-label="Close">
                        <CloseIcon onClick={this.CloseOnClick.bind(this)}/>
                    </IconButton>
                    </div>
                    <div style = {styles.paper2_UpperContainer}>
                        <div style={styles.containerTitle}> Video Ring</div>
                        <div style={styles.content}>
                        <g>
                            <RelatedVideosPanel 
                                data={this.props.BigCircleIndex==null?this.props.data.concept_relationship.nodes[this.props.Path_ConceptIndex]:this.props.data.concept_relationship.nodes[this.props.BigCircleIndex]}
                                video_info = {this.props.data.videos_info}
                                concept_index={this.props.BigCircleIndex}// concept_index={this.props.Path_ConceptIndex}
                                // SetPopoverIndexes = {this.props.SetPopoverIndexes}
                                SentRange = {this.props.SentRange}
                                SetHoverVideoIndex = {this.props.SetHoverVideoIndex}
                                HoverVideoIndex = {this.props.HoverVideoIndex}
                                video_sequences={this.props.data.video_sequences[this.props.Path_ConceptIndex]}
                            />
                        </g>
                        </div>
                        
                    </div>
                    <div height="5"><hr></hr></div>
                    <div style = {styles.paper2_BelowContainer}>
                        <div style = {styles.container3_1}>
                        {/* <div style = {Object.assign({}, styles.container3_1, {height:window.innerHeight-900})}> */}
                        
                            <div style={styles.containerTitle}> Concept Path </div>
                            <ConceptSequence  
                                    c_index = {this.props.Path_ConceptIndex} 
                                    BFSinput={this.props.data.BFSinput} 
                                    RemovedCycleLinks = {this.props.data.RemovedCycleLinks}
                                    concepts={this.props.data.concept_relationship.nodes} 
                                    concept_sequences={this.props.data.concept_sequences}
                                    HighlightConceptIndex={this.props.HighlightConceptTextIndex}
                                    BigCircleIndex = {this.props.BigCircleIndex}
                                    SetBigCircleIndex ={this.props.SetBigCircleIndex}
                                    />
                        </div>
                        <div style = {styles.container3_2}>
                        {/* <div style = {Object.assign({}, styles.container3_2, {height:window.innerHeight-900})}> */}
                            <div style={styles.containerTitle}> 
                            Video Path
                            </div>
                            <VideoSequence 
                                video_sequences={this.props.data.video_sequences[this.props.Path_ConceptIndex]} 
                                video_info = {this.props.data.videos_info} 
                                SetHoverVideoIndex = {this.props.SetHoverVideoIndex}
                                HoverVideoIndex = {this.props.HoverVideoIndex}
                                SentRange = {this.props.SentRange}
                            />
                        </div>
                    </div>
                    </Paper>  
                </div>
            );
        }
        return null;
        
    }
}
export default ConceptDetailPanel;