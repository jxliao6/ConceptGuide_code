import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';


const styles = ({
    root: {
        flexGrow: 1,
      },
      bar:{
        background:"#0088A8",
        // padding:2
      },
      APPName: {
        flexGrow: 1,
        marginLeft:10,
        fontSize:20,
        fontFamily:"Cambria"
      },
      menuButton: {
        // marginLeft: 5,
        marginRight: 1,

      },
      menuButton: {
        // marginLeft: -5,
        marginRight: 1,

      },
});

class BarField extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     chipdata:this.props.SearchHistory,
        //     SearchKeyword : null,
        // }
        this.HomeOnClick = this.HomeOnClick.bind(this);
        this.MenuOnClick = this.MenuOnClick.bind(this);
    }
    HomeOnClick(){
        console.log("[click] HomePage");
        this.props.SetProgress(1);//this.setProgress(1,null);
    }
    MenuOnClick(){
        // console.log("menu click");
        var tmp = this;
        fetch('http://localhost:8001/SearchHistory/')
        .then(function (res) {
        //    console.log(res.json());
            return res.json();
        }).then(function(myJson) {
            // console.log("already",myJson);
            // tmp.setState({SearchHistory:myJson});
            tmp.props.SetSearchHistory(myJson);
            tmp.props.SetMenuOpen();
            return myJson;
        });
        
    }
    render() {
        // console.log("learingmap",this.props);
        return (
            <div style={styles.root}>
            <AppBar position="static" style={styles.bar}>
            <Toolbar>
                <IconButton style={styles.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon onClick={this.MenuOnClick}/>
                </IconButton>
                <IconButton style={styles.homeButton} color="inherit" aria-label="Home">
                    <HomeIcon onClick={this.HomeOnClick}/>
                </IconButton>
                <Typography variant="title" color="inherit" style={styles.APPName}>
                Learning Map
                </Typography>
                {/* <Button color="inherit">Login</Button> */}
            </Toolbar>
            </AppBar>
        </div>
        );
    }
    
}
export default BarField;