import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    // flexGrow: 1,
    padding: 10,
    margin:20,
  },
};

function LinearIndeterminate(props) {
  const { classes } = props;
  return (
    <div style={styles.root}>
      <LinearProgress variant="determinate" value={props.value} />
      <br />
      {/* <LinearProgress color="secondary" /> */}
    </div>
  );
}

LinearIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearIndeterminate);