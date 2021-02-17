import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Search from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  
  root: {
    // ...theme.mixins.gutters(),
    // width: 1000,
    height: 100,
    padding: theme.spacing.unit * 2,
    margin : theme.spacing.unit * 4,
    // paddingTop: theme.spacing.unit * 2,
    // paddingBottom: theme.spacing.unit * 2,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
});
function myFunction(){
    console.log("click");
}
function SearchField(props) {
  const { classes } = props;
  function myFunction(){
    console.log("myFunction");
}
  return (
    
      <Paper className={classes.root} elevation={1}>
      <div className={classes.container}>
        {/* <Typography variant="headline" component="h5">
         Learning map
        </Typography> */}
        
        <Input placeholder="Concept You Want To Learn" className={classes.input} inputProps={{  'aria-label': 'Description',  }}/>
        <button onClick={myFunction()}></button>
        {/* <Button  onClick={myFunction()}>
            <Search style = {{margin:10}}/>
        </Button> */}
      </div>
      </Paper>
    
  );
}

SearchField.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SearchField);