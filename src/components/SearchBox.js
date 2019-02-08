import React, {Component} from 'react';
// import TextField from 'material-ui/TextField';
import {white, blue500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';
const styles = {
  iconButton: {
    float: 'left',
    paddingTop: 17
  },
  textField: {
    color: white,
    backgroundColor: blue500,
    borderRadius: 2,
    height: 35
  },
  inputStyle: {
    color: white,
    paddingLeft: 5
  },
  hintStyle: {
    height: 16,
    paddingLeft: 5,
    color: white
  }
};
class SearchBox extends Component {
  render(){
    // const {handleInputChange} = this.props;
    return (
      <div>
        <IconButton style={styles.iconButton} >
          <Search color={white} />
        </IconButton>
      </div>
    );
  }
}
// SearchBox.propTypes = {
//   handleInputChange: PropTypes.func
// };
export default SearchBox;
