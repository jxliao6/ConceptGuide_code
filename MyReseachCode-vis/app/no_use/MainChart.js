import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import SimpleNetworkGraph from './SimpleNetworkGraph';

import Graph from './newdirected/Graph';


class MainChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Graph data={this.props.data} OpenDrawer={(text) =>this.props.OpenDrawer(text)} />
    );
  }
}
export default MainChart;