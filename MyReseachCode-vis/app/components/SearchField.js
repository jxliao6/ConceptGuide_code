import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Search from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import AlertDialog from './AlertDialog';
import HomePageImg from './homepage3.png';
import AutoSuggestions from './AutoSuggestions';

const styles = ({
    root1:{
        height:"85%",
        width:"95%",
        display: 'flex',
        justifyContent: 'center',
        backgroundImage: "url(" + HomePageImg + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "74%",
        backgroundPosition: "center",
        margin:20,

    },
    root2: {
    //   height: "100%",
      width : "40%",
      padding: 15, //theme.spacing.unit * 2,
      margin : 120,//theme.spacing.unit * 4,
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      paddingTop:10,
      paddingBottom:5,
    },
    input: {
     
      margin: 10,//theme.spacing.unit,
      fontSize:20,
    },
    chip: {
        margin: 8,
        padding:5,
        fontSize:13
      },
    img:{
        opacity:0.2
    }
  });

  
class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chipdata:this.props.SearchHistory,
            SearchKeyword : null,
            historyWords:[],
            alertOpen:false,
            alertCondition : null,
        }
        this.handleClick = this.handleClick.bind(this);
        this.TagClick = this.TagClick.bind(this);
        this.TextChange = this.TextChange.bind(this);
        this.HandleAlertClose = this.HandleAlertClose.bind(this);
        this.Go_CreateNewMap = this.Go_CreateNewMap.bind(this);
        this.Go_CheckExistedMap = this.Go_CheckExistedMap.bind(this);
    }
    componentWillMount(){
        // console.log("SearcgFieldMount");
        var tmp = this;
        fetch('http://localhost:8001/SearchHistory/')
        .then(function (res) {
        //    console.log(res.json());
            return res.json();
        }).then(function(myJson) {
            tmp.setState({
                historyWords:myJson
            });
            return myJson;
        });
    }
    
    Go_CreateNewMap(keyword){
        this.props.SetProgress(2);
        this.props.SetSearchKeyword(keyword);
    }
    Go_CheckExistedMap(keyword){
        if (keyword=="bitcoin introduction"){
            console.log("here!!!!XXXXbitcoin")
            var tmp = this;
            var index = 0;
            fetch('http://localhost:8001/GetJson_bitcoin/'+index)
            .then(function (res) {
                return res.json();
            }).then(function(myJson) {
                tmp.props.SetProgress(3,myJson);
                return myJson;
            });
        }
        else{
            var tmp = this;
            fetch('http://localhost:8001/GetAnalyzeResult/'+keyword)
            .then(function (res) {
                return res.json();
            }).then(function(myJson) {
                // console.log("myJson",myJson.search_info);
                tmp.props.SetProgress(3,myJson);
                return myJson;
            });
        }
        
    }
    handleClick(e){
        if(this.state.SearchKeyword==null){
            this.setState({
                alertOpen:true,
                alertCondition:"null"
            });
        }else if(this.state.historyWords.includes(this.state.SearchKeyword)){
            this.setState({
                alertOpen:true,
                alertCondition:"exist"
            });
        }else{
            this.setState({
                alertOpen:true,
                alertCondition:"notExist"
            });
        }
        
    }
    TagClick(keyword){
        var tmp = this;
        fetch('http://localhost:8001/GetAnalyzeResult/'+keyword)
        .then(function (res) {
            return res.json();
        }).then(function(myJson) {
            // console.log("myJson",myJson.search_info);
            tmp.props.SetProgress(3,myJson);
            return myJson;
        });
    }
    TagDelete(keyword){
        // console.log("tag delete",this);
        var tmp = this;
        fetch('http://localhost:8001/DeleteAnalyzeResult/'+keyword)
        .then(function (res) {
            return res.json();
        }).then(function(myJson) {
            tmp.props.SetSearchHistory(myJson);
            return myJson;
        });
    }
    TextChange(e){
        // sconsole.log("eeee",this,e.target.value);
        this.setState({
            SearchKeyword:e,
            // SearchKeyword:e.target.value
        });
    }
    HandleAlertClose(){
        this.setState({
            alertOpen:false,
        });
    }
    render() {
        // console.log("search",this.state.SearchKeyword);
        return (
            <div style={styles.root1} >
            {/* <img src={HomePage2} style={styles.img} /> */}
            
            <Paper style={styles.root2} elevation={13}>
                <div style={styles.container} >
                    {/* <Input placeholder="Concept " style={styles.input} value={this.state.name} inputProps={{  'aria-label': 'Description',  } } onChange={this.TextChange} /> */}
                    <AutoSuggestions historyWords={this.state.historyWords} TextChange={this.TextChange}/>
                    <Button size = "small" onClick={this.handleClick}>
                        <Search style = {{margin:10}}/>
                    </Button>
                </div>
                
            </Paper>
            <AlertDialog 
                keyword = {this.state.SearchKeyword}
                alertOpen={this.state.alertOpen} 
                HandleAlertClose={this.HandleAlertClose} 
                alertCondition={this.state.alertCondition}
                Go_CreateNewMap={this.Go_CreateNewMap}
                Go_CheckExistedMap={this.Go_CheckExistedMap}
            />
            </div>
        );
        
    }
}
export default SearchField;