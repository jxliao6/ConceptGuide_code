import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Search from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import LinearIndeterminate from './LinearIndeterminate';

var progressValue = 10;

const styles = ({
    root: {
    //   height: 100,
      padding: 5, //theme.spacing.unit * 2,
      margin : 0,//theme.spacing.unit * 4,
      // paddingTop: theme.spacing.unit * 2,
      // paddingBottom: theme.spacing.unit * 2,
      
    },
    container: {
        // justifyContent: 'center',
    //   display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
      margin: 10,//theme.spacing.unit,
    },
    buttonContainer:{
        marginLeft:"auto",
        marginRight:"auto"
    },
    button:{
        fontSize:13,
        padding:10,
        margin:10,
        left:"46%",
    },
  });

  
class CreateMapField extends Component {
    constructor(props) {
        super(props);
        this.state={
            secondsElapsed: 0,
            minutesElapsed:0,
            NotFinish_Create : true,
            progressValue : 3,
            message:" Collecting data from Youtube ... "
        }
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillMount(){
        // console.log("comein!",this.props.SearchKeyword);
        this.interval = setInterval(() => this.secondtick(), 1000);
        this.interval = setInterval(() => this.progresstick(), 9000);
        var keyword = this.props.SearchKeyword;
        var tmp = this;
        //1.download
        // fetch('http://localhost:8001/Download/'+keyword)
        // .then(function (res) {return res.json();
        // }).then(function(myJson) {
        //     console.log("finish download",myJson);
        //     tmp.setState({
        //         progressValue : 25,
        //         message:"( Sentiment analysis of youtube comments... )"
        //     });
        //     //2.start comment anaylze
        //         fetch('http://localhost:8001/Comment_Analyze/'+keyword)
        //         .then(function (res2) {
        //             return res2.json();
        //         }).then(function(myJson2) {
        //             console.log("finish comment anaylze",myJson2);
        //             tmp.setState({
        //                 progressValue : 40,
        //                 message:""
        //             });
        //             //3.start caption anaylze
        //             fetch('http://localhost:8001/Caption_Analyze/'+keyword)
        //             .then(function (res3) {
        //                 return res3.json();
        //             }).then(function(myJson3) {
        //                 console.log("finish caption anaylze",myJson3);
        //                 tmp.setState({
        //                     progressValue : 100,
        //                     NotFinish_Create : false
        //                 });
        //                 return myJson3;
        //             });
        //             return myJson2;
        //         });
        //     return myJson;
        // });

        fetch('http://localhost:8001/Analyze/'+keyword)
        .then(function (res) {
            return res.json();
        }).then(function(myJson) {
            // console.log("finish analyze",myJson);
            tmp.setState({
                NotFinish_Create : false,
                progressValue :100
            });
            return myJson;
        });
    }
    componentWillUnmount() {
        clearInterval(this.interval);
      }
    
    secondtick() {
        this.setState((prevState) => ({
          secondsElapsed: prevState.secondsElapsed + 1
        }));
        // message
        if(this.state.secondsElapsed==3*60){
            this.setState((prevState) => ({
                message: " Analyzing sentiment of videos' comments... "
              }));
        }
        else if(this.state.secondsElapsed==4*60){
            this.setState((prevState) => ({
                message: " Extracting concept words from transcript... "
              }));
        }
        else if(this.state.secondsElapsed==6*60){
            this.setState((prevState) => ({
                message: " Analyzing concept similarity... "
              }));
        }
        else if(this.state.secondsElapsed==8*60){
            this.setState((prevState) => ({
                message: " Analyzing prerequisite relationship... "
              }));
        }
        else if(this.state.secondsElapsed==10*60){
            this.setState((prevState) => ({
                message: " Generating Learning map ... "
              }));
        }
      }
      progresstick() {
        if(this.state.progressValue < 10){
            this.setState((prevState) => ({
                progressValue: prevState.progressValue + 5
              }));
        }
        else if(this.state.progressValue < 96){
            this.setState((prevState) => ({
                progressValue: prevState.progressValue + 1
              }));
        }
      }

    handleClick(){
        var tmp = this;
        fetch('http://localhost:8001/GetJson/')
        .then(function (res) {
        //    console.log(res.json());
            return res.json();
        }).then(function(myJson) {
            // console.log(myJson);
            tmp.props.SetProgress(3,myJson);
            return myJson;
          });
          
    }
    render() {
        // console.log(this.state.secondsElapsed/60," minutes");
        return (
            <Paper style={styles.root} elevation={1}>
            <div style={styles.container} >
            
              <LinearIndeterminate value = {this.state.progressValue}/>
              {/* <Typography variant="title" component="h5" align="center">Creating Learning Map...</Typography> */}
              <Typography variant="title" component="h5" align="center">{this.state.progressValue+"%"}</Typography>
              <Typography variant="title" component="h5" align="center">{this.state.message}</Typography>
              <br/>
              <div style={styles.buttonContainer}>
              <Button variant="raised"  style = {styles.button} size = "small" onClick={this.handleClick} disabled={this.state.NotFinish_Create}>
                    See the map
              </Button>
              </div>
            </div>
            </Paper>
        );
    }
}
export default CreateMapField;