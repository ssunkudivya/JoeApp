import React, {Component,PropTypes} from 'react';
import {Link} from 'react-router';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
//grey400,, lightBlack
import {cyan600, white, darkBlack} from 'material-ui/styles/colors';
import {typography} from 'material-ui/styles';
import globalStyles from '../styles';
let lu_auth_token = 'q-omkdT92QfYEFkSQPtF';
let id = '';
class PanelList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      open:false,
      msg:''
    };
  }
  componentDidMount() {
    id = this.props.params.id;
    let that = this;
    that.setState({open:true});
    that.setState({msg:`Loading Panels`});
    fetch(`https://api.securecomwireless.com/v2/customers/${id}/control_systems?page_size=5000&auth_token=${lu_auth_token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
      return results.json();
    }).then(res => {
      // if (res.length == 0) {
      //   that.setState({open:true});
      //   that.setState({msg:`Error iin Retrieving Panels`});
      //   return;
      // }
      that.setState({open:true});
      that.setState({msg:`Retrieved Panels`});
      let temp = res.map(item => item.control_system);
      let data = temp.map((item) => {
        item.link = `/panel/${that.props.params.name}/${that.props.params.acc}/${that.props.params.id}/${item.panels[0].serial_number}/${item.panels[0].account_number}/${item.panels[0].control_system_id}/${item.name}`;
        return item;
      });
      this.setState({data});
    });
  }
  render(){
    const styles = {
      subheader: {
        fontSize: 24,
        fontWeight: typography.fontWeightLight,
        backgroundColor: cyan600,
        color: white
      },
      list:{
        backgroundColor: white
      }
    };
    return (
        <div>
        <Snackbar
          open={this.state.open}
          message={this.state.msg}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose} />
            <h3 style={globalStyles.navigation}>
              {<Link to="/">{this.props.params.name} (#{this.props.params.acc})</Link>} / Panels
            </h3>
            <div>
              <List style={styles.list}>
                <Subheader style={styles.subheader}>Panels</Subheader>
                 <div className={this.state.data.length == 0? 'd-block' : 'd-none'}>No Panels</div>
                {this.state.data.map((item,index) =>
                    <div key={index}>
                      <ListItem
                        containerElement={<Link to={item.link}/>}
                        primaryText=
                          {<div className="row">
                            <span style={{color: darkBlack}} className="col-md-4 col-sm-12">Panel name:- {item.name}</span>
                            <span style={{color: darkBlack}} className="col-md-3 col-sm-12">S No:- {item.panels[0].serial_number}</span>
                            <span style={{color: darkBlack}} className="col-md-2 col-sm-12">Acc No:-{item.panels[0].account_number}</span>
                            <span style={{color: darkBlack}} className="col-md-3 col-sm-12">Panel id:-{item.panels[0].control_system_id}</span>
                          </div>}
                        secondaryText={
                          <div className="row">
                            <span style={{color: darkBlack}} className="col-md-3 col-sm-12">Status:- {item.panels[0].connection_status}</span>
                            <span style={{color: darkBlack}} className="col-md-4 col-sm-12">Comm type:- {item.panels[0].comm_type}</span>
                            <span style={{color: darkBlack}} className="col-md-5 col-sm-12">Comm address:- {item.panels[0].comm_address}</span>
                          </div>
                        }
                      secondaryTextLines={1}
                      />
                      <Divider inset={true} />
                    </div>
                )}
              </List>
            </div>
        </div>
    );
  }
}

PanelList.propTypes = {
  params: PropTypes.object
};
export default PanelList;
