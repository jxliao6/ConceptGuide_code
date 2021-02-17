import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = ({
    title:{
        fontSize:150,
    },
  });
class AlertDialog extends Component {
    constructor(props) {
        super(props);
        this.RenderButtons = this.RenderButtons.bind(this);
        this.CheckExistedMap = this.CheckExistedMap.bind(this);
        this.CreateNewMap = this.CreateNewMap.bind(this);
        
    }
    CheckExistedMap(){
        this.props.Go_CheckExistedMap(this.props.keyword);
    }
    CreateNewMap(){
        this.props.Go_CreateNewMap(this.props.keyword);
    }
    

    RenderButtons(){
        if(this.props.alertCondition=="null"){
            return(
                <Button onClick={this.props.HandleAlertClose} color="primary">
                OK
                </Button>
            );
        }
        else if(this.props.alertCondition=="exist"){
            return(
                <div>
                <Button onClick={this.CheckExistedMap.bind(this)} color="primary">
                OK
                </Button>
                <Button onClick={this.CreateNewMap.bind(this)} color="primary">
                No,Create a new one
                </Button>
                </div>
            );
        }
        else if(this.props.alertCondition=="notExist"){
            return(
                <div>
                <Button onClick={this.CreateNewMap.bind(this)} color="primary">
                    OK
                </Button>
                <Button onClick={this.props.HandleAlertClose} color="primary">
                    Cancel
                </Button>
                </div>
            );
        }
    }
    
    render() {
        // console.log(this.props.keyword);
        var title,message;
        if(this.props.alertCondition=="null"){
            title="Error";
            message = "The query must have at least a keyword! ";
        }
        else if(this.props.alertCondition=="exist"){
            title="Check the learning map already created?";
            message = " '"+this.props.keyword+"' has already been searched before. You can check the learning map already created or create a new one.";
        }
        else if(this.props.alertCondition=="notExist"){
            title="Create a learning map?";
            message = "Create a learning map will cost about 10~15 minutes, Are you sure you want to create a learning map? "
        }
        return (
        <div  style={styles.title}>
            <Dialog
            open={this.props.alertOpen}
            onClose={this.props.HandleAlertClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            {this.RenderButtons()}
                {/* <Button onClick={this.handleClose} color="primary">
                Disagree
                </Button>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                Agree
                </Button> */}
            </DialogActions>
            </Dialog>
        </div>
        );
  }
}
export default AlertDialog;