import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import * as d3 from "d3";


class Link extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.d3Link = d3.select(ReactDOM.findDOMNode(this))
            .datum(this.props.data)
            .call(this.props.enterLink);
        d3.select(ReactDOM.findDOMNode(this)).attr('marker-end',function(d) {
                if(d.prerequisite!=null){return 'url(#markerArrow)' }
            })
    }

    componentDidUpdate() {
        this.d3Link.datum(this.props.data)
            .call(this.props.updateLink);
        // console.log("Update!!",this.props.data.index,this.props.HighlightNodes);
        this.DoHighlight(ReactDOM.findDOMNode(this),this.props.HighlightNodes);
    }
    DoHighlight(loc,d_neighbors){
          d3.select(loc)
        //   .style("stroke", function (o) {
        //     return (d_neighbors.includes(o.source.index) & d_neighbors.includes(o.target.index) & o.prerequisite!=null)? "#999999":"#bbb";
        //   })
          .style("opacity", function (o) {
            return (d_neighbors.includes(o.source.index) & d_neighbors.includes(o.target.index) & o.prerequisite!=null)? 1:0.1;
          });
    }
    render() {
        return (
            <line className='link'  />
        );
    }
}
export default Link;