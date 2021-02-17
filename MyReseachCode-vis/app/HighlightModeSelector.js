import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class HighlightModeSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
  return(
    <div>
    <RadioButtonGroup name="choose" defaultSelected="not_light" onChange = {this.props.action}>
    <RadioButton
        value="1"
        label="mode1"
      />
      <RadioButton
        value="2"
        label="mode2"
      />
      <RadioButton
        value="3"
        label="mode3"
      />
    </RadioButtonGroup>
      </div>
  );
  }
}
export default HighlightModeSelector;