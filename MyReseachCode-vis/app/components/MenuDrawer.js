import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Chip from '@material-ui/core/Chip';

const styles = ({
    root: {
       width: 450,
      },
    chip: {
        margin: 8,
        padding: 5,
        fontSize: 13
      },
      chip2: {
        margin: 8,
        padding: 5,
        fontSize: 13,
        color:"blue",
      },
    root2:{
        width: 450,
        padding: 5,
        margin: 5 ,
    },
    DrawerName: {
        flexGrow: 1,
        marginLeft:20,
        fontSize:20,
        fontFamily:"Cambria",
        margin: 15,
    },
});


var hidden_list=['automatic summarization introduction','computer graphic','computer graphics','natural language processing','sentiment analysis introduction','text preprocessing','Sentiment analysis']

class MenuDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawer_switch:this.props.open,
        }
        this.TagClick = this.TagClick.bind(this);
        this.TagDelete = this.TagDelete.bind(this);
        this.HandleClose = this.HandleClose.bind(this);
    }

    TagClick(keyword){
        var tmp = this;
        fetch('http://localhost:8001/GetAnalyzeResult/'+keyword)
        .then(function (res) {
            return res.json();
        }).then(function(myJson) {
            // console.log("myJson",myJson.search_info);
            tmp.props.SetMenuClose();
            tmp.props.SetProgress(3,myJson);
            return myJson;
        });
    }
    ButtonClick(index){
        var tmp = this;
        fetch('http://localhost:8001/GetJson_bitcoin/'+index)
        .then(function (res) {
            return res.json();
        }).then(function(myJson) {
            // console.log("myJson",myJson.search_info);
            tmp.props.SetMenuClose();
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
            // console.log("newhistory",myJson);
            tmp.props.SetSearchHistory(myJson);
            return myJson;
        });
    }
    HandleClose(){
        // console.log("close!");
        this.props.SetMenuClose();
    }


    render() {
        if (this.props.SearchHistory) {
            var chips = this.props.SearchHistory.map( (word) => {
                if (hidden_list.includes(word)){
                    return null;
                }
                return (
                <Chip
                    key = {word} 
                    label={word} 
                    style={styles.chip}  
                    onClick={this.TagClick.bind(this,word)} 
                    clickable="true" 
                    // onDelete={this.TagDelete.bind(this,word)}
                />);
            });
        }
        
        // console.log("opendrawer",this.props.open,this.state.drawer_switch);
        
        return (
            <div style={styles.root}>
            <Drawer anchor="left" open = {this.props.open} onClose={this.HandleClose} > 
                <div style={styles.root2} onKeyDown={this.HandleClose}>
                <Typography variant="title" color="inherit" style={styles.DrawerName}>
                    Search History
                </Typography>
                {chips}
                <Chip
                    key = {"Bitcoin_Demo"} 
                    label={"Bitcoin_Demo"} 
                    style={styles.chip2}  
                    onClick={this.ButtonClick.bind(this,0)} 
                    clickable="true" 
                    // onDelete={this.TagDelete.bind(this,word)}
                />
                <Chip
                    key = {"Bitcoin_mining_Demo"} 
                    label={"Bitcoin_mining_Demo"} 
                    style={styles.chip2}  
                    onClick={this.ButtonClick.bind(this,1)} 
                    clickable="true" 
                    // onDelete={this.TagDelete.bind(this,word)}
                />
                <Chip
                    key = {"NLP_intro_Demo"} 
                    label={"NLP_intro_Demo"} 
                    style={styles.chip2}  
                    onClick={this.ButtonClick.bind(this,2)} 
                    clickable="true" 
                    // onDelete={this.TagDelete.bind(this,word)}
                />
                <Chip
                    key = {"NLP_Demo"} 
                    label={"NLP_Demo"} 
                    style={styles.chip2}  
                    onClick={this.ButtonClick.bind(this,3)} 
                    clickable="true" 
                    // onDelete={this.TagDelete.bind(this,word)}
                />
                </div>
            </Drawer>
            </div>
        );
    }
    
}
export default MenuDrawer;