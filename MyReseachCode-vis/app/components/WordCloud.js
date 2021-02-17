import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import * as d3 from "d3";
import { TagCloud } from "react-tagcloud";

const styles = ({
    // root: {
    //     // width: 200,
    //     // height:800,
    //     position: 'absolute',
    //     left: 600,
    //     zIndex: 5,
    //   },
    //   heading:{
    //     fontSize:14,
    // },
    //   constainer:{
    //     display: 'flex',
    //     flexDirection: "column",
    //     flexWrap: 'wrap',
    //   },
    //   ColorLegend:{
    //     display: 'flex',
    //     flexDirection: "column",
    //     flexWrap: 'wrap',
    //   },
    //   VideoNodesText:{
    //     textAnchor:'end'
    //   },
      
    //   heading2:{
    //     fontSize:14,
    //     fontWeight: "bold",
    //     paddingTop:5,
    //     paddingBottom:5
    // },
});

class WordCloud extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     chipdata:this.props.SearchHistory,
        //     SearchKeyword : null,
        // }
        // this.RenderSentcircles = this.RenderSentcircles.bind(this);
    }
    
    
    render() {
        // console.log("wordcloud",this.props);
        if(this.props.videos_info[this.props.HoverVideoIndex]!=undefined){
            var data=[];
            for (var index in this.props.videos_info[this.props.HoverVideoIndex].concepts){
                if(index<10){
                    data.push({
                        value:this.props.videos_info[this.props.HoverVideoIndex].concepts[index][0],
                        count:this.props.videos_info[this.props.HoverVideoIndex].concepts[index][1]
                    })
                }
            }
            // console.log("Clouddata2",data);
        }else{
            data=[];
        }
        

        return (
            <div style={styles.root}>
            <TagCloud 
                    minSize={1}
                    maxSize={35}
                    tags={data}
                    style={{color:"grey",width: 200,height:100,fontSize: 10}}
                    disableRandomColor={true}
            />
        
            </div>
        );
    }
    
}
export default WordCloud;