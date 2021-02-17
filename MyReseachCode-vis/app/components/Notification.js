import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = ({
    root:{
        // paddingTop:50,
        // marginTop:100,
        fontSize:20
    },
    content:{
        // height:100,
        fontSize:13,
    }
});

class Notification extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     open:this.props.open
        // }
    }
    // handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //       return;
    //     }
    
    //     this.setState({ open: false });
    // };
    render() {
        // console.log("learingmap",this.props);
        return (
            <div style={styles.root}>
                <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={this.props.open}
                autoHideDuration={6000}
                style={styles.content}
                // onClose={this.handleClose}
                // ContentProps={{
                //     'aria-describedby': 'message-id',
                // }}
                message={<span style={styles.content} >Click A Node To See More Information</span>}
                // action={[
                //     <Button key="undo" color="secondary" size="small" onClick={this.handleClose}>
                //     UNDO
                //     </Button>,
                //     <IconButton
                //     key="close"
                //     aria-label="Close"
                //     color="inherit"
                //     className={classes.close}
                //     onClick={this.handleClose}
                //     >
                //     <CloseIcon />
                //     </IconButton>,
                // ]}
            />
        </div>
        );
        
    }
    
}
export default Notification;