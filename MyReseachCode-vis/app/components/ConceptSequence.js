// refer to : http://davidstutz.github.io/d3-topological/
//refer to : https://github.com/davidstutz/d3-topological/blob/master/index.html

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";
import CardinalPath from "./CardinalPath";

var cx = 45;//
var radius = 6;

const styles = ({
    conceptSeqGraph:{
        paddingTop: 10,
        marginTop:10,
        width:250,
        // height:900,
    },
    label:{
        // fontSize:16,
    },
    circle:{
        cursor: "pointer"
    }
});
const enterNode = (selection) => {
    selection.select('circle')
         .attr("r", 20)
        // .style("fill", function(d) { return '#009FCC' })

    selection.select('text')
        .attr("dx", 15)
        .attr("dy", 18)
        .style("fontSize", "12")
        // .style("transform", "translateX(-50%,-50%")
};
function ylocation(index) {
    return index*60 + 15 ; 
}

function calculatePath(dependencies,c_sequences,side){
    var result = []
    if(side==="left"){
        var xloc = cx - radius;
        var xloc_mid = cx - 40 ;
    }else if (side=="right"){
        var xloc = cx + radius;
        var xloc_mid = cx + 45 ;
    }
    // console.log("dependencies",dependencies,c_sequences);
    Object.keys(dependencies).map(function(key) {
        var v = dependencies[key].map((index2)=>{
            var num1 = c_sequences.indexOf(parseInt(key));
            var num2 = c_sequences.indexOf(index2);
            result.push( {
                points:[
                    {
                        x: xloc,//cx - radius,
                        y: ylocation(num1),
                    }, {
                        x: xloc_mid,//cx - 60 ,
                        y: (ylocation(num1) + ylocation(num2))/2,
                    }, {
                        x: xloc,//cx -radius,
                        y: ylocation(num2),
                    }
                ]
            });
        });
    });
    return result;
}     
function TextStyle(HighlightConcepts,index){
    if(HighlightConcepts!=null){
        if(HighlightConcepts.includes(index)){
            // return {fill:"red"};
            return {textShadow:"0px 0px 15px #ff7575,0px 0px 15px #ff5151"};
        }else{
            return  {fill:"black"};
        }
    }
    return {fill:"black"};
}


class ConceptSequence extends Component {
    constructor(props) {
        super(props);
        this.state = {
            PathHovered: false,
        };
        this.PathHover = this.PathHover.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillMount(){
        var circles = d3.select('#topological')
                        .selectAll('circle');
    }
    PathHover(){
        this.setState({
            PathHovered: true,
        })
    }
    handleClick(e,number,name){
        console.log("[click],ConceptSequenceNode",",",name,",",number,",",e);
        this.props.SetBigCircleIndex(e);
    };
    ClickedNode(highlight,cx,cy){
        if(highlight==true){
            return(
                <circle 
                    cx={cx}
                    cy={cy}
                    fill="#AAAAAA"    
                    r={15}
                    opacity={0.4} >  
                    </circle>
            );
        }
    }

    render() {
        var this_tmp = this;
        
        // console.log("thisprops",this.props.BFSinput,this.props.c_index,this.props.concepts,this.props.concept_sequences);
        if(this.props.c_index!=null){
            var c_sequences = this.props.concept_sequences[this.props.c_index];
            if(c_sequences[0]=="cycle"){
                return(
                    <p>cycle!</p>
                )
            }
            // console.log(this.props.BFSinput[this.props.c_index]);
            var nodes = c_sequences.map( (conceptnode,number) => {
                // console.log("CheckConceptSeq",conceptnode,this.props.BigCircleIndex);
                return (
                    <svg key={"conceptSeqnode"+number}>
                    <circle key={conceptnode+number} 
                        cx={cx} 
                        cy={ylocation(number)} 
                        r={radius}
                        style={styles.circle}
                        fill={this.props.c_index===conceptnode?'	#444444':'#009FCC'}//fill="#009FCC" 
                        onClick={this.handleClick.bind(this,conceptnode,number,this.props.concepts[conceptnode].name)}
                    >      
                    </circle>
                    {this.ClickedNode(this.props.BigCircleIndex==null?conceptnode==this.props.c_index:conceptnode==this.props.BigCircleIndex,cx,ylocation(number))}
                    <text  x={cx+10} y={ylocation(number)+4} style={TextStyle(this.props.HighlightConceptIndex,this.props.concepts[conceptnode].index)}>{this.props.concepts[conceptnode].name} </text>
                    </svg>
                );
            });
            var dependencies = this.props.BFSinput[this.props.c_index];
            var pathsdata = calculatePath(dependencies,c_sequences,"left");
            var paths = Object.keys(pathsdata).map(function(key) {
                // console.log("checkpath",pathsdata[key]);
                return(
                    <CardinalPath key={"cardinalpath"+key} data={pathsdata[key].points} style = {styles.path}/>
                )
                
            });
            // console.log(this.props.RemovedCycleLinks[this.props.c_index]);
            var cycle_pathsdata = calculatePath(this.props.RemovedCycleLinks[this.props.c_index],c_sequences,"right");
            var cycle_paths = Object.keys(cycle_pathsdata).map(function(key) {
                // console.log("checkpath",pathsdata[key]);
                return(
                    <CardinalPath key={"cyclepath"+key} data={cycle_pathsdata[key].points} style = {styles.path}/>
                )
                
            });
           
            return(
                <div id="topological" >
                    <svg className="ConceptSeqGraph" height={60*c_sequences.length} style ={styles.conceptSeqGraph} >
                        <g>
                            {nodes}
                            
                        </g>
                        <g>
                            {paths}
                        </g>
                        <g>
                            {cycle_paths}
                        </g>
                    </svg>
                </div>
            )
        }
        return (
            <p>{this.props.c_index}</p>
            
        );
    }
}
export default ConceptSequence;