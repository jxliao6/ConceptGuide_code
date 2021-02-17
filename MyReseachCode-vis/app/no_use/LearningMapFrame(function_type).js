import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Graph from '../newdirected/Graph';
import VideoSequence from './VideoSequence';


const styles = theme => ({
  container: {
      // justifyContent: 'center',
    display: 'flex',
    flexDirection: "row",
    // flexGrow: 1,
    flexWrap: 'wrap',
  },
  paper1: {
    // ...theme.mixins.gutters(),
    // display:'flex',
    width: 850,
    height: 800,
    padding: theme.spacing.unit * 2,
    margin : theme.spacing.unit * 2,
  },
  paper2: {
    // ...theme.mixins.gutters(),
    // display:'flex',
    width: "20%",
    height: 800,
    padding: theme.spacing.unit * 2,
    margin : theme.spacing.unit * 2,
  },
});

function LearningMapFrame(props) {
  console.log("learingmap",props.data.search_info.key);
  // console.log({props.data.search_info.key});
  const { classes } = props;
  return (
    <div className={classes.container}>
    {/* {props.data} */}
      <Paper className={classes.paper1} elevation={13}>
        <Typography variant="headline" component="h5">
         Learning map
        </Typography>
        <Typography variant="title" component="h3">
          {props.data.search_info.key}
        </Typography>
        <Graph data={props.data} OpenDrawer={(text) =>props.OpenDrawer(text)} width="800" height ="800" />
      </Paper>

      <Paper className={classes.paper2} elevation={13}>
        <Typography variant="headline" component="h5">
         Video Sequence
        </Typography>
        <VideoSequence video_sequences={props.data.video_sequences}/>
        
      </Paper>


    </div>
  );
}

LearningMapFrame.propTypes = {
  classes: PropTypes.object.isRequired,
};
// export default (PaperSheet);
export default withStyles(styles)(LearningMapFrame);