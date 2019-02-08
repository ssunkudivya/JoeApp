import React, {Component} from 'react';
import {Link} from 'react-router';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import {cyan600, white} from 'material-ui/styles/colors';
import {typography} from 'material-ui/styles';
import Wallpaper from 'material-ui/svg-icons/device/wallpaper';
import Snackbar from 'material-ui/Snackbar';
import Search from 'material-ui/svg-icons/action/search';
import TextField from 'material-ui/TextField';
let lu_auth_token= 'q-omkdT92QfYEFkSQPtF';
let m_dealerid = 1239;
const styles = {
  iconButton: {
    float: 'left',
    paddingTop: 17
  },
  textField: {
    borderRadius: 2,
  },
  inputStyle: {
    color: '#000',
    paddingLeft: 5
  },
  hintStyle: {
    height: 16,
    paddingLeft: 5,
  },
  subheader: {
    fontSize: 24,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan600,
    color: white
  }
};
function searchingFor(term){
  return function(x){
    return x.customer_name.toLowerCase().includes(term.toLowerCase());
  };
}
export default class RecentlyProducts extends Component{
  constructor(props) {
      super(props);
      this.state = {
          data: [],
          open:false,
          msg:'',
          term:''
      };
      this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    let that = this;
    that.setState({open:true});
    that.setState({msg:`Loading Customers`});
    fetch('https://od.securecomwireless.com/api/v1/dealers(' + m_dealerid + ')/vk.GetDetailedPanelMapData()?auth_token=' + lu_auth_token, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
      return results.json();
    }).then(rec => {
      if (!rec.value) {
        that.setState({open:true});
        that.setState({msg:rec.error.message});
        return;
      }
      let lastid = 0;
      let data = [];
      for (let n = 0; n < rec.value.length; n++) {
        if (rec.value[n].customer_id !== lastid) {
          rec.value[n].link =  'customer/'+rec.value[n].customer_name+'/'+rec.value[n].account_number+'/'+rec.value[n].customer_id;
          data.push(rec.value[n]);
          lastid = rec.value[n].customer_id;
        }
      }
      this.setState({data});
    });
  }
  handleInputChange(event){
    this.setState({
      term: event.target.value
    });
  }
  render(){
    const {data,term} = this.state;
    return (
      <div>
        <Paper>
            <Search color={white} />
            <TextField
              hintText="Search for customers..."
              underlineShow={false}
              fullWidth={false}
              style={styles.textField}
              inputStyle={styles.inputStyle}
              onChange={this.handleInputChange}
              hintStyle={styles.hintStyle}
            />
          <List>
            <Subheader style={styles.subheader}>Customers</Subheader>
            {data.filter(searchingFor(term)).map((item,index) =>
              <div key={index}>
                <ListItem leftAvatar={<Avatar icon={<Wallpaper />} />}
                  primaryText={item.customer_name}
                  containerElement={<Link to={item.link} />}
                  secondaryText={item.customer_id}
                  //rightIconButton={rightIconMenu}
                />
                <Divider inset={true} />
              </div>
            )}
          </List>
        </Paper>
        <Snackbar
          open={this.state.open}
          message={this.state.msg}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose} />
      </div>
  );
  }
}
