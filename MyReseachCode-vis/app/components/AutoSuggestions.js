import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { PropTypes } from 'prop-types';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Downshift from 'downshift';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
const styles = ({
  paper:{
    listStyleType: 'none',
  },
  input: {
     
    // margin: 10,
    fontSize:20,
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    position: "relative",
},
suggestionsContainerOpen: {
    zIndex: 5,
    position: "absolute",
    left: 0,
    right: 0,
},
suggestion: {
    display: 'block',
    position:  "relative",
    fontSize:20,
},
suggestionsList: {
    position:  "relative",
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    fontSize:20,
},
});
  function getSuggestions(o,tmpthis){
    const inputValue = o.value.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    return inputLength === 0 ? [] : tmpthis.props.historyWords.filter(option =>
      option.toLowerCase().slice(0, inputLength) === inputValue
    );
  };
  
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
function getSuggestionValue (suggestion){
  return  suggestion;
};
  
  function renderInputComponent  (inputProps){
    // console.log("inputProps",inputProps);
   return(
        <div >
        <Input {...inputProps} style={styles.input} />
        {/* <Input placeholder="Concept " 
        style={styles.input} value={this.state.name} 
        // inputProps={{  'aria-label': 'Description',  } }    */}
      </div>
   );
  };


  function renderSuggestion (suggestion){
    return(
      <MenuItem
      component="div">
      {suggestion}
    </MenuItem>
    );
  };
  function renderSuggestionsContainer(options ){
    return(
          <Paper style={styles.paper}
          square
          {...options.containerProps}
          >
          {options.children}
          </Paper>
    );
 
  };
  
 
  class AutoSuggestions extends Component {
    constructor(props) {
      super(props);
      
      // Autosuggest is a controlled component.
      // This means that you need to provide an input value
      // and an onChange handler that updates this value (see below).
      // Suggestions also need to be provided to the Autosuggest,
      // and they are initially empty because the Autosuggest is closed.
      this.state = {
        value: '',
        suggestions: []
      };
      this.onChange = this.onChange.bind(this);
      this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
      this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    }
    
    
    onChange (event, { newValue })  {
      this.props.TextChange(newValue);
      this.setState({
        value: newValue
      });
      
    };

  
  
    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested( value ) {
      this.setState({
        suggestions: getSuggestions(value,this)
      });
    };
  
    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
      this.setState({
        suggestions: []
      });
    };
  
    render() {
      const { value, suggestions } = this.state;
      // Autosuggest will pass through all these props to the input.
      const inputProps = {
        placeholder: 'Concept',
        value,
        onChange: this.onChange
      };
  
      // Finally, render it!
      return (
        <div style={styles.paper}>
        <Autosuggest
        theme={{
                    container: styles.container,
                    suggestionsContainerOpen: styles.suggestionsContainerOpen,
                    suggestionsList: styles.suggestionsList,
                    suggestion: styles.suggestion,
                }}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
          getSuggestionValue={getSuggestionValue}
          renderInputComponent={renderInputComponent.bind(this)}
          renderSuggestion={renderSuggestion}
          renderSuggestionsContainer={renderSuggestionsContainer.bind(this)}
          inputProps={inputProps}
        />
        </div>
      );
      
    }
  }export default AutoSuggestions;