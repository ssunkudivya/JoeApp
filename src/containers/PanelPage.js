import React, {Component,PropTypes} from 'react';
import Moment from 'moment';
import {Link} from 'react-router';
import {Card, CardActions, CardHeader,CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Snackbar from 'material-ui/Snackbar';
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn} from 'material-ui/Table';
import globalStyles from '../styles';
let lu_auth_token = 'q-omkdT92QfYEFkSQPtF';
let data = [];
let loaded = 0;
const TNewUser = {
  "user_code": {
    "code_fill":"F",
    "areas":"",
    "user_level":"9",
    "temp":false,
    "arm_only":false,
    "user_id":null,
    "snd_to_lks":"Y",
    "credential_id":null,
    "isNew":true,
    "isOpen":true,
    "isBusy":false,
    "family":"XT30",
    "profileLimit":4,
    "number":"",
    "name":"",
    "code":""
  }
};
const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  card:{
    marginBottom: 12
  },
  slide: {
    margin: 0,
    padding: 10
  },
};
class PanelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      msg:'',
      users:[],
      activity:[],
      open: false,
      dialog:false,
      data:[],
      userid:'',
      username:'',
      updateUser:false,
      usercode:'',
    };
    this.handleChange = this.handleChange.bind(this);
    this.getNodes = this.getNodes.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getLights = this.getLights.bind(this);
    this.getThermostats = this.getThermostats.bind(this);
    this.getLocks = this.getLocks.bind(this);
    this.setThermostat = this.setThermostat.bind(this);
    this.lightsOn = this.lightsOn.bind(this);
    this.lockDoor = this.lockDoor.bind(this);
    this.setThermostat = this.setThermostat.bind(this);
    this.refreshActivity = this.refreshActivity.bind(this);
    this.bindData = this.bindData.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.deleteDevice = this.deleteDevice.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.modalOpen = this.modalOpen.bind(this);
    this.addUser = this.addUser.bind(this);
    this.handleuserId = this.handleuserId.bind(this);
    this.handleuserName = this.handleuserName.bind(this);
    this.handleuserCode = this.handleuserCode.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }
  componentDidMount() {
    this.getNodes();
  }
  bindData(){
    if(loaded >= 3){
      this.setState({data});
      this.setState({open:true});
      this.setState({msg:'Devices Received'});
    }
  }
  modalOpen(){
    this.setState({dialog: true});
  }

  modalClose(){
    this.setState({dialog: false,updateUser: false});
  }
  getNodes(){
    let that = this;
    fetch(`https://api.securecomwireless.com/1/panels/1-${this.props.params.cid}/nodes?auth_token=${lu_auth_token}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
      if (results.status== 200 )
        return results.json();
     else{
       that.getNodes();
       that.setState({open:true});
       that.setState({msg:results.statusText});
     }
    }).then(res => {
      if (res) {
          that.setState({open:true});
          that.setState({msg:`Job: ${res.status}`});
          if(this.props.params.acc){
            that.getLights(this.props.params.acc);
            that.getThermostats(this.props.params.acc);
            that.getLocks(this.props.params.acc);
          }
      }
      //console.log(res);
    });
  }
  getLights(acc){
    let that = this;
    //console.log("Getting Lights for  Panel " + acct);
    fetch('https://api.securecomwireless.com/1/panels/1-' + acc + '/light_statuses?auth_token=' + lu_auth_token, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
      return results.json();
    }).then(function(x) {
      //  console.log(x)
        if (x.status == 'success') {
          that.setState({msg:'Got Lights.'});
          that.setState({open:true});
          let lights = x.response.light_statuses;
            lights.forEach(function(item, index) {
              if(index == 0){
                if (item.cache_status == 'PENDING'){
                  setTimeout(function() {
                      that.getLights(acc);
                   },2000);
                }
                else if (item.cache_status == 'ERROR'){
                  that.setState({open:true});
                  that.setState({msg:item.error_message});
                }
              }
              item.status = `Level: ${item.level}`;
              item.account = acc;
              data[item.node_type] = item;
            });
            // TODO: if cached, then re-quest again in a few seconds....
            //this.setState({data:this.state.data.push(data)});
        } else {
          that.setState({open:true});
          that.setState({msg:x.response.status});
        }
        loaded++;
        that.bindData();
    });
  }
  getThermostats(acc){
    let that = this;
    //console.log("Getting Thermostats for  Panel " + acct);
    fetch('https://api.securecomwireless.com/1/panels/1-' + acc + '/thermostat_statuses?auth_token=' + lu_auth_token, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
      return results.json();
    }).then(function(x) {
      //console.log(x);
      if (x.status == 'success') {
          that.setState({open:true});
          that.setState({msg:`Got Thermostats.`});
          let thermostat = x.response.thermostat_statuses;
          //console.log(thermostat)
          thermostat.forEach(function(item, index) {
            if(index == 0){
              if (item.cache_status == 'PENDING')
                setTimeout(function() {
                  that.getThermostats(acc);
                }, 2000);
              else if (item.cache_status == 'ERROR'){
                setTimeout(function(){
                  that.setState({open:true});
                  that.setState({msg:item.error_message});
                }, 2000);
              }
            }
            item.status = `FAN ${item.fan_mode}\n
                          ${item.mode}\n
                          ${item.current_temperature} F\n
                          (${item.setpoint_heating} / ${item.setpoint_cooling})`;
            item.account = acc;
            data[item.node_type] = item;
          });
          // TODO: if cached, then re-quest again in a few seconds....
        //  this.setState({data:this.state.data.push(data)});
      } else {
        that.setState({open:true});
        that.setState({msg:x.response.status});
      }
      loaded++;
      that.bindData();
    });
  }
  getLocks(acc){
    let that = this;
    fetch('https://api.securecomwireless.com/1/panels/1-' + acc + '/lock_statuses?auth_token=' + lu_auth_token, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
      return results.json();
    }).then(function(x) {
      //console.log(x)
      if (x.status == 'success') {
        that.setState({open:true});
        that.setState({msg:`Got Locks.`});
        let lock = x.response.lock_statuses;
        lock.forEach(function(item, index) {
            if(index == 0){
              if (item.cache_status == 'PENDING')
                setTimeout(function() {
                  that.getLocks(acc);
                 },2000);
              else if (item.cache_status == 'ERROR'){
                that.setState({open:true});
                that.setState({msg:item.error_message});
              }
            }
            item.status = `Level: ${item.status}`;
            item.account = acc;
            data[item.node_type] = item;
          });
          // TODO: if cached, then re-quest again in a few seconds....
      } else {
        that.setState({open:true});
        that.setState({msg:x.response.status});
      }
      loaded++;
      that.bindData();
    });
  }
  handleChange(value){
    this.setState({
      slideIndex: value,
    });
  }
  handleRequestClose(){
    this.setState({
      open: false
    });
  }
  setThermostat(item, s_fan_mode=null, s_mode=null, s_setpoint_cooling=null, s_setpoint_heating=null){
    let that = this;
    that.setState({open:true});
    that.setState({msg:'Setting thermostat...'});
    //' + document.getElementById('edAuthCode').value + '
    fetch('https://api.securecomwireless.com/1/panels/1-' + this.props.params.acc + '/thermostat_statuses/' + item.number + '?auth_user_code=99&auth_token=' + lu_auth_token, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fan_mode: s_fan_mode,
        mode: s_mode,
        setpoint_cooling: s_setpoint_cooling,
        setpoint_heating: s_setpoint_heating
      })
    }).then(results => {
      return results.json();
    }).then(function(rec) {
      that.setState({open:true});
      that.setState({msg:`Setting thermostat is ${rec.status}`});
      //that.getThermostats($('#edAccountNumber').text());
    });
  }
  lightsOn(item,llevel){
    let that = this;
    that.setState({open:true});
    that.setState({msg:`Setting # ${item.number} to ${llevel}`});
    fetch('https://api.securecomwireless.com/1/panels/' + this.props.params.panelId + '/light_statuses/' + item.number + '?auth_token=' + lu_auth_token, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level: llevel
      })
    }).then(results => {
      return results.json();
    }).then(function(rec) {
      that.setState({open:true});
      that.setState({msg:`Light: # ${rec.status}`});
      //this.getLights($('#edAccountNumber').text());
    });
  }
  lockDoor(item,block){
    let that = this;
    that.setState({open:true});
    if (block)
      that.setState({msg:`Locking # ${item.number}`});
    else
      that.setState({msg:`Unlocking # ${item.number}`});
      //' + document.getElementById('edAuthCode').value + '
    fetch('https://api.securecomwireless.com/1/panels/' + this.props.params.panelId + '/lock_statuses/' + item.number + '?auth_user_code=99&auth_token=' + lu_auth_token, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: block?'SECURED':'UNSECURED'
      })
    }).then(results => {
      return results.json();
    }).then(function(rec) {
        that.setState({open:true});
        if (block)
          that.setState({msg:`Locking # ${rec.status}`});
        else
          that.setState({msg:`Unlocking # ${rec.status}`});
        //this.GetLocks($('#edAccountNumber').text());
    });
  }
  getUsers(){
    let that = this;
    that.setState({open:true,updateUser:false});
    that.setState({msg:`Getting Users`});
    fetch('https://api.securecomwireless.com/v2/panels/' + this.props.params.panelId + '/user_codes?auth_token=' + lu_auth_token, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
      // populate screen fields with results
      return results.json();
    }).then(function(users) {
      if (users) {
        //console.log(users);
        that.setState({users});
        that.setState({open:true});
        that.setState({msg:`Retrieved Users`});
        //refreshUserTable();
      }
    });
  }
  refreshActivity(){
    let acct = (this.props.params.acc.length < 6)?`00${this.props.params.acc}`:this.props.params.acc;
    let that = this;
    that.setState({open:true});
    that.setState({msg:`Loading Activity..`});
    fetch('https://216.9.200.218/api.asp?r=88&a=0' + acct, {
      method: 'GET'
    }).then(results => {
      // populate screen fields with results
      return results.json();
    }).then(function() {
        that.setState({open:true});
        that.setState({msg:`Retrieved Activity..`});
    });
  }
  deleteDevice(){
    //item
//     if (sel_node_num!='') {
//       // DELETE z-wave node
//       if (!window.confirm('Are you sure you want to delete Node # ' + sel_node_num))
//         return;
//
//         curFunction=22;
//         fetch('https://api.securecomwireless.com/1/panels/1-' + acct + '/zwave_devices/' + sel_node_num + '?auth_user_code=' + document.getElementById('edAuthCode').value + '&auth_token=' + lu_auth_token, {
// //          fetch('https://vkd.securecomwireless.com/v2/panels/' + panelid + '/zwave_setups/00' + sel_node_num + '?auth_user_code=' + document.getElementById('edAuthCode').value + '&auth_token=' + lu_auth_token, {
//           method: 'DELETE',
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//           }
//         }).then(results => {
//           return results.json();
//         }).then(function(job) {
//             if (job) {
//               curJob = job.job_number; // uuid
//               curJobStatus = job.status;
//               RefreshJob();
//             }
//         });
//
//     } else if (sel_zone_num!='') {
//       // remove zone
//       if (!window.confirm("Are you sure you want to delete Zone # " + sel_zone_num))
//         return;
//
//       DeleteZone(panelid, sel_zone_num);
//     } else {
//       showZwaveStatus('Please select a node/zone.');
//       return;
//     }
  }
  removeUser(item) {
    let that = this;
    let number = parseInt(item.user_code.number);
    if (number < 2 || number > 19) {
      that.setState({open:true});
      that.setState({msg:`Invalid User Number`});
      return;
    }else{
      that.setState({open:true});
      that.setState({msg:`Removing User`});
      fetch('https://api.securecomwireless.com/v2/panels/' + this.props.params.panelId + '/user_codes/' + item.user_code.number + '?auth_token=' + lu_auth_token, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(results => {
        // populate screen fields with results
        if (results.status == 202 || results.status == 200)
          return results.json();
       else{
         that.setState({open:true});
         that.setState({msg:'Error in Removing Users'});
       }
     }).then(function(x) {
        if(x){
          setTimeout(function(){
            that.getUsers();
          },1500);
          that.setState({open:true});
          that.setState({msg:'User Removing Status -  ' + x.job.status});
        }else{
          that.setState({open:true});
          that.setState({msg:'Error in Removing Users'});
        }
      });
    }
    // curFunction=3;


  }
  handleuserId(e) {
     this.setState({userid: e.target.value});
  }
  handleuserName(e) {
     this.setState({username: e.target.value});
  }
  handleuserCode(e) {
     this.setState({usercode: e.target.value});
  }
  updateUser(item){
    let usercode = item.user_code.number+"";
    while (usercode.length < 4) usercode = "0" + usercode;
    this.setState({updateUser:true,userid:item.user_code.number,username:item.user_code.name,usercode:usercode,dialog:true});
  }
  addUser(){
    let that = this;
    let number = parseInt(this.state.userid);
    if (number < 2 || number > 19) {
      that.setState({open:true});
      that.setState({msg:`Invalid User Number`});
      return;
    }
    else{
        that.setState({open:true});
        that.setState({msg:'Adding Users'});
        let usr = TNewUser;
        usr.user_code.number = this.state.userid;
        usr.user_code.name = this.state.username;
        usr.user_code.code = this.state.usercode;
        fetch('https://api.securecomwireless.com/v2/panels/' + this.props.params.panelId + '/user_codes?auth_token=' + lu_auth_token, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usr)
        }).then(results => {
          // populate screen fields with results
          if (results.status == 202 || results.status == 200)
            return results.json();
         else{
           that.setState({open:true});
           that.setState({msg:'Error in Adding Users'});
         }
        }).then(function(x) {
          that.setState({userid:'',username:'',usercode:''});
          that.setState({dialog:false});
          if(x){
            setTimeout(function(){
              that.getUsers();
            },1500);
            that.setState({open:true});
            that.setState({msg:'User Removing Status -  ' + x.job.status});
          }else{
            that.setState({open:true});
            that.setState({msg:'Error in Adding Users'});
          }
        });
      }
  }
  render(){
    const {data} = this.state;
    const tabnames = {
      0:"Devices",
      1:"Users",
      2:"Activity",
    };
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.modalClose}
      />,
      <FlatButton
        label={this.state.updateUser ?'Update':'Add'}
        primary={true}
        keyboardFocused={true}
        onClick={this.addUser}
      />,
    ];
    return (
        <div>
        <Snackbar
          open={this.state.open}
          message={this.state.msg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose} />
          <h3 style={globalStyles.navigation}>
            {<Link to="/">{this.props.params.name} (#{this.props.params.acc})</Link>} / {<Link to={`/customer/${this.props.params.name}/${this.props.params.acc}/${this.props.params.id}`}>{this.props.params.panelName}</Link>} / {tabnames[this.state.slideIndex]}
          </h3>
          <Tabs
               onChange={this.handleChange}
               value={this.state.slideIndex}>
               <Tab label="Devices" value={0} />
               <Tab label="Users" value={1}  onActive={this.getUsers}/>
               <Tab label="Activity" value={2} onActive={this.refreshActivity}/>
             </Tabs>
             <SwipeableViews
               index={this.state.slideIndex}
               onChangeIndex={this.handleChange}>
               <div className="row" style={styles.slide}>
                  <div className={Object.keys(data).length == 0? 'd-block' : 'd-none'}>No Devices</div>
                  {Object.entries(data).map(([i,item]) =>
                    <Card className="col-xs-12 col-sm-12 col-md-12 col-lg-12" key={i} style={styles.card}>
                       <CardHeader title={`#${item.number} ${item.node_type}`}
                         subtitle={item.node_subtype}
                         actAsExpander={true}
                         showExpandableButton={true}
                       />
                       <CardText expandable={true} className="display-linebreak">
                         {item.name}<br/>
                         {item.status}<br/>
                         Last updated : {item.last_status_at != null ? Moment(item.last_status_at).fromNow():'-'}<br/>
                         ({item.last_status_at != null ? Moment(item.last_status_at).format('DD-MM-YYYY hh:MM:ss a'):'-'})<br/>
                       </CardText>
                       <CardActions>
                          <div className={item.node_type == 'THERMOSTAT'? 'd-block' : 'd-none'}>
                              <FlatButton label="Fan AUTO" primary={true} onClick={() => this.setThermostat(item,'AUTO', 'COOL', '80', '71')} />
                              <FlatButton label="Fan ON"  secondary={true} onClick={() => this.setThermostat(item,'ON', 'OFF', '80', '71')} />
                              <FlatButton label="OFF" primary={true} onClick={() => this.setThermostat(item,'AUTO', 'OFF', '80', '71')} />
                              <FlatButton label="COOL"  secondary={true} onClick={() => this.setThermostat(item,'AUTO', 'COOL', '80', '71')}/>
                              <FlatButton label="HEAT" primary={true} onClick={() => this.setThermostat(item,'AUTO', 'HEAT', '80', '71')} />
                              <FlatButton label="AUTO"  secondary={true} onClick={() => this.setThermostat(item,'AUTO', 'AUTO', '80', '71')} />
                          </div>
                          <div className={(item.node_type == 'LIGHT' && item.node_type !== 'BINARY') ? 'd-block' : 'd-none'}>
                              <FlatButton label="Light OFF" primary={true} onClick={() => this.lightsOn(item,0)} />
                              <FlatButton label="Light 5%"  secondary={true} onClick={() => this.lightsOn(item,5)} />
                              <FlatButton label="Light 10%" primary={true} onClick={() => this.lightsOn(item,10)} />
                              <FlatButton label="Light 15%" secondary={true} onClick={() => this.lightsOn(item,15)} />
                              <FlatButton label="Light ON" primary={true} onClick={() => this.lightsOn(item,99)} />
                          </div>
                          <div className={(item.node_type == 'LIGHT' && item.node_type === 'BINARY')? 'd-block' : 'd-none'}>
                              <FlatButton label="Light OFF" primary={true} onClick={() => this.lightsOn(item,0)} />
                              <FlatButton label="Light ON" primary={true} onClick={() => this.lightsOn(item,99)} />
                          </div>
                          <div className={item.node_type == 'LOCK'? 'd-block' : 'd-none'}>
                              <FlatButton label="Lock" primary={true} onClick={() => this.lockDoor(item,true)} />
                              <FlatButton label="Un-Lock"  secondary={true} onClick={() => this.lockDoor(item,false)} />
                          </div>
                          <FlatButton label="Delete device" primary={true} onClick={() => this.deleteDevice(item,true)} disabled/>
                       </CardActions>
                    </Card>
                  )}
               </div>
               <div className="row" style={styles.slide}>
                  <FlatButton label="Add user" primary={true} onClick={() => this.modalOpen()} />
                  <Dialog
                   title={this.state.updateUser ?'Update User':'Add User'}
                   actions={actions}
                   modal={false}
                   open={this.state.dialog}
                   onRequestClose={this.modalClose}
                   autoScrollBodyContent={true}>
                    <div>
                        <form>
                            <TextField
                              hintText="User"
                              floatingLabelText="User"
                              value={this.state.userid}
                              fullWidth={true}
                              onChange={this.handleuserId}
                            />
                            <TextField
                              hintText="Name"
                              floatingLabelText="Name"
                              value={this.state.username}
                              fullWidth={true}
                              onChange={this.handleuserName}
                            />
                            <TextField
                              hintText="4-digit Code"
                              floatingLabelText="4-digit Code"
                              value={this.state.usercode}
                              fullWidth={true}
                              onChange={this.handleuserCode}
                            />
                        </form>
                    </div>
                 </Dialog>
                  <Table>
                   <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                     <TableRow>
                       <TableHeaderColumn>ID</TableHeaderColumn>
                       <TableHeaderColumn>Name</TableHeaderColumn>
                       <TableHeaderColumn>Actions</TableHeaderColumn>
                     </TableRow>
                   </TableHeader>
                   <TableBody displayRowCheckbox={false}>
                     {this.state.users.map((item,i) =>
                        <TableRow key={i}>
                           <TableRowColumn>{item.user_code.number}</TableRowColumn>
                           <TableRowColumn>{item.user_code.name}</TableRowColumn>
                           <TableRowColumn>
                              <FlatButton label="Delete" primary={true} onClick={() => this.removeUser(item)} />
                              <FlatButton label="Update" primary={true} onClick={() => this.updateUser(item)} />
                           </TableRowColumn>
                        </TableRow>
                     )};
                   </TableBody>
                  </Table>
               </div>
               <div style={styles.slide}>Activity</div>
             </SwipeableViews>
        </div>
    );
  }
}
PanelPage.propTypes = {
  params: PropTypes.object
};
export default PanelPage;
