import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import * as d3 from "d3";
// import { typography } from 'material-ui/styles';

const styles = ({
    root: {
        // width: 200,
        // height:800,
        position: 'absolute',
        top:120,
        left: 30,
        zIndex: 5,
      },
      heading:{
        fontSize:14,
    },
      constainer:{
        display: 'flex',
        flexDirection: "column",
        flexWrap: 'wrap',
      },
      ColorLegend:{
        display: 'flex',
        flexDirection: "column",
        flexWrap: 'wrap',
      },
      VideoNodesText:{
        textAnchor:'end'
      },
      
      heading2:{
        fontSize:14,
        fontWeight: "bold",
        paddingTop:5,
        paddingBottom:5
    },
});
var TermCountRange = [];
class Legend extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     chipdata:this.props.SearchHistory,
        //     SearchKeyword : null,
        // }
        // this.RenderSentcircles = this.RenderSentcircles.bind(this);
    }

    VideoRadius(index){
        return (38-(index*2.5))
    };
    // RenderSentcircles(){
    //     for (var index = 1; index <8; index++) {
    //         return(
    //             <svg>
    //             <circle fill="red" r="3" cx="5" cy="5"> </circle>
    //             </svg>
    //     );  
    //     }
        

    // }
    RenderCircle(){
        var MaxRadius=44;
        var numOfCircle=7;
        
    }
    
    
    render() {
        // console.log("Legend",this.props.Path_ConceptIndex);
        //Concept Node
        var scaleX = d3.scaleLinear()
                 .range([6,15])
                 .domain([0,5]);

        var ConceptNodes=[0,1,2,3,4,5];
        var ConceptNodesCircle = ConceptNodes.map( (index) => {
            return (
                <g key={"SentcirclesLegend"+index}>
                <circle cx={10+index*30} cy={40} r={scaleX(index)} fill="#555" opacity="0.4" > </circle>
                </g>
            );
        });
        //Video Node
        var VideoNodes=[0,1,2,3,4,5,6];
        var MaxRadius=44;
        var VideoNodesCircle = VideoNodes.map( (index) => {
            return (
                
                <g key={"VideoNodesCircle"+index}>
                <circle 
                    cx="50" cy={50+index*2.5} 
                    r={MaxRadius-index*2.5} 
                    fill="none" 
                    opacity="0.7" 
                    stroke="#666666" 
                    strokeWidth="1"
                    strokeDasharray="1">
                </circle>
                </g>
            );
        });
        if(this.props.Path_ConceptIndex==null){
            return(
                <div style={styles.root}>
                    <ExpansionPanel defaultExpanded={true}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography style={styles.heading}>Legend</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div style={styles.container}>
                                {/* <div ><hr></hr></div> */}
                                <div style={styles.ColorLegend}>
                                    {/* <Typography style={styles.heading2}>Concept Nodes</Typography> */}
                                    <svg height="80" width="200">
                                    <text   y="15" fill="black">Term Frequency</text>
                                    {ConceptNodesCircle}
                                    <text   y="75" fill="#888888">{(this.props.ConceptRange[0]/this.props.ConceptRange[2]).toFixed(2)}</text>
                                    <text x="145" y="75" fill="#888888">{(this.props.ConceptRange[1]/this.props.ConceptRange[2]).toFixed(2)}</text>
                                    </svg>
                                    {/* <div ><hr></hr></div> */}
                                </div>
                            </div>
                        </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            );
        }else{
            var tmpList = [];
            for(var e in this.props.data[this.props.BigCircleIndex].videos_id){
                tmpList.push(this.props.data[this.props.BigCircleIndex].videos_id[e][1]);
            };
            // console.log("TermCount",tmpList);
            TermCountRange=[Math.min(...tmpList),Math.max(...tmpList)];
            
            return(
                <div style={styles.root}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography style={styles.heading}>Legend</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div style={styles.container}>
                                <div style={styles.ColorLegend}>
                                    {/* <Typography style={styles.heading2}>Video Nodes</Typography> */}
                                    <svg height="30" width="200">
                                        <text y="15" fill="black">Term Count</text>
                                    </svg>
                                    <svg height="100" width="200">
                                        {VideoNodesCircle}
                                        {/* <text x="180" y="25" fill="grey" style={styles.VideoNodesText}> Relevance to the concept</text> */}
                                        <text x="150" y="55" fill="#888888" style={styles.VideoNodesText}> {TermCountRange[1]}</text>
                                        <text x="150" y={55+2.5*6} fill="#888888" style={styles.VideoNodesText}>{TermCountRange[0]}</text>
                                        <line x1={50+MaxRadius} x2={120} y1="50" y2="50" stroke="#888888" ></line>
                                        <line x1={50+MaxRadius-2.5*6} x2={120} y1={50+2.5*6} y2={50+2.5*6} stroke="#888888" ></line>
                                    </svg>
                                </div>
                                <div style={styles.ColorLegend}>
                                    <svg height="20" width="200">
                                    <text   y="15" fill="black">Sentiment</text>
                                    </svg>
                                    <svg height="50" width="200">
                                        <defs>
                                            <linearGradient id="ColorLegend" >
                                                <stop offset="5%"  stopColor="red"/>
                                                <stop offset="50%" stopColor="yellow"/>
                                                <stop offset="90%" stopColor="#006030"/>
                                            </linearGradient>
                                        </defs>
                                        <rect fill="url(#ColorLegend)" opacity="0.7"
                                            y="15" width="190" height="15" />
                                        <text   y="45" fill="#888888">Negative</text>
                                        <text x="145" y="45" fill="#888888">Positive</text>
                                    </svg>
                                </div>
                            </div>
                            {/* {Sentcircles} */}
                        </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>
            );
        }
    }
    
}
export default Legend;