import React, { Component, PropTypes } from "react";
import Moment from "moment";
import { Link } from "react-router";
import { Card, CardActions, CardHeader, CardText } from "material-ui/Card";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import { Tabs, Tab } from "material-ui/Tabs";
import SwipeableViews from "react-swipeable-views";
import Snackbar from "material-ui/Snackbar";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import globalStyles from "../styles";
let lu_auth_token = "q-omkdT92QfYEFkSQPtF";
let data = [];
let loaded = 0;
const TNewUser = {
  user_code: {
    code_fill: "F",
    areas: "",
    user_level: "9",
    temp: false,
    arm_only: false,
    user_id: null,
    snd_to_lks: "Y",
    credential_id: null,
    isNew: true,
    isOpen: true,
    isBusy: false,
    family: "XT30",
    profileLimit: 4,
    number: "",
    name: "",
    code: ""
  }
};
const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400
  },
  card: {
    marginBottom: 12
  },
  slide: {
    margin: 0,
    padding: 10
  },
  btnWrap: {
    paddingBottom: 10
  },
  paddingLeft: {
    paddingLeft: 0
  },
  noMargin: {
    margin: 0
  },
  box: {
    backgroundColor: "#efefef",
    padding: "4px 10px",
    borderRadius: "4px",
    display: "inline-flex",
    fontWeight: 500,
    marginBottom: 4
  }
};
class PanelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
      msg: "",
      overview: [],
      users: [],
      activity: [],
      open: false,
      dialog: false,
      actionType: false,
      data: [],
      userid: "",
      username: "",
      updateUser: false,
      usercode: "",
      nodeModal: false,
      nodename: ""
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
    this.overView = this.overView.bind(this);
    this.getLightsForPanels = this.getLightsForPanels.bind(this);
    this.getThermostatsForPanels = this.getThermostatsForPanels.bind(this);
    this.refreshZwaves = this.refreshZwaves.bind(this);
    this.refreshZones = this.refreshZones.bind(this);
    this.refreshZonesStatus = this.refreshZonesStatus.bind(this);
    this.getZonesStatus = this.getZonesStatus.bind(this);
    this.refreshJob = this.refreshJob.bind(this);
    this.openNode = this.openNode.bind(this);
    this.closeNode = this.closeNode.bind(this);
    this.handleNodeName = this.handleNodeName.bind(this);
    this.addNode = this.addNode.bind(this);
  }
  componentDidMount() {
    this.getNodes();
    let that = this;
    setInterval(function() {
      that.setState({ open: true });
      that.setState({ msg: "Refresh Zwave" });
      // that.getNodes();
      //that.refreshZones(that.props.params.panelId);
    }, 10000);
  }
  bindData() {
    if (loaded >= 3) {
      this.setState({ data });
      this.setState({ open: true });
      this.setState({ msg: "Devices Received" });
    }
  }
  modalOpen() {
    this.setState({ dialog: true });
  }
  modalClose() {
    this.setState({ dialog: false, updateUser: false });
  }
  closeNode() {
    this.setState({ nodeModal: false, actionType: false });
  }
  openNode(action) {
    this.setState({ nodeModal: true, actionType: action });
  }
  getNodes() {
    loaded = 0;
    let that = this;
    fetch(
      `https://api.securecomwireless.com/1/panels/1-${
        this.props.params.cid
      }/nodes?auth_token=${lu_auth_token}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        if (results.status == 200) return results.json();
        else {
          that.getNodes();
          that.setState({ open: true });
          that.setState({ msg: results.statusText });
        }
      })
      .then(res => {
        if (res) {
          that.setState({ open: true });
          that.setState({ msg: `Job: ${res.status}` });
          if (this.props.params.acc) {
            that.getLights(this.props.params.acc);
          }
        }
        //console.log(res);
      });
  }
  getLights(acc) {
    let that = this;
    //console.log("Getting Lights for  Panel " + acct);
    fetch(
      "https://api.securecomwireless.com/1/panels/1-" +
        acc +
        "/light_statuses?auth_token=" +
        lu_auth_token,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        return results.json();
      })
      .then(function(x) {
        //  console.log(x)
        if (x.status == "success") {
          that.setState({ msg: "Got Lights." });
          that.setState({ open: true });
          let lights = x.response.light_statuses;
          lights.forEach(function(item, index) {
            if (index == 0) {
              if (item.cache_status == "PENDING") {
                setTimeout(function() {
                  that.getLights(acc);
                }, 5000);
              } else if (item.cache_status == "ERROR") {
                that.setState({ open: true });
                that.setState({ msg: item.error_message });
              }
            }
            item.status = `Level: ${item.level}`;
            item.account = acc;
            data[item.node_type] = item;
            that.setState({ data });
          });
          // TODO: if cached, then re-quest again in a few seconds....
          //this.setState({data:this.state.data.push(data)});
        } else {
          that.setState({ open: true });
          that.setState({ msg: x.response.status });
        }
        loaded++;
        that.getThermostats(that.props.params.acc);
        // that.bindData();
      });
  }
  getThermostats(acc) {
    let that = this;
    //console.log("Getting Thermostats for  Panel " + acct);
    fetch(
      "https://api.securecomwireless.com/1/panels/1-" +
        acc +
        "/thermostat_statuses?auth_token=" +
        lu_auth_token,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        return results.json();
      })
      .then(function(x) {
        //console.log(x);
        if (x.status == "success") {
          that.setState({ open: true });
          that.setState({ msg: `Got Thermostats.` });
          let thermostat = x.response.thermostat_statuses;
          //console.log(thermostat)
          thermostat.forEach(function(item, index) {
            if (index == 0) {
              if (item.cache_status == "PENDING")
                setTimeout(function() {
                  that.getThermostats(acc);
                }, 5000);
              else if (item.cache_status == "ERROR") {
                setTimeout(function() {
                  that.setState({ open: true });
                  that.setState({ msg: item.error_message });
                }, 2000);
              }
            }
            item.status = `FAN ${item.fan_mode} ${item.mode} ${
              item.current_temperature
            } F (${item.setpoint_heating} / ${item.setpoint_cooling})`;
            item.account = acc;
            data[item.node_type] = item;
            that.setState({ data });
          });
          // TODO: if cached, then re-quest again in a few seconds....
          //  this.setState({data:this.state.data.push(data)});
        } else {
          that.setState({ open: true });
          that.setState({ msg: x.response.status });
        }
        loaded++;
        // that.bindData();
        that.getLocks(that.props.params.acc);
      });
  }
  getLocks(acc) {
    let that = this;
    fetch(
      "https://api.securecomwireless.com/1/panels/1-" +
        acc +
        "/lock_statuses?auth_token=" +
        lu_auth_token,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        if (results.status == "200") return results.json();
      })
      .then(function(x) {
        //console.log(x)
        if (x.status == "success") {
          that.setState({ open: true });
          that.setState({ msg: `Got Locks.` });
          let lock = x.response.lock_statuses;
          lock.forEach(function(item, index) {
            if (index == 0) {
              if (item.cache_status == "PENDING")
                setTimeout(function() {
                  that.getLocks(acc);
                }, 5000);
              else if (item.cache_status == "ERROR") {
                that.setState({ open: true });
                that.setState({ msg: item.error_message });
              }
            }
            item.status = `Level: ${item.status}`;
            item.account = acc;
            data[item.node_type] = item;
            that.setState({ data });
          });
          // TODO: if cached, then re-quest again in a few seconds....
        } else {
          that.setState({ open: true });
          that.setState({ msg: x.response.status });
        }
        loaded++;
        // that.bindData();
      });
  }
  handleChange(value) {
    this.setState({
      slideIndex: value
    });
  }
  handleRequestClose() {
    this.setState({
      open: false
    });
  }
  setThermostat(
    item,
    s_fan_mode = null,
    s_mode = null,
    s_setpoint_cooling = null,
    s_setpoint_heating = null
  ) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: "Setting thermostat..." });
    //' + document.getElementById('edAuthCode').value + '
    fetch(
      "https://api.securecomwireless.com/1/panels/1-" +
        this.props.params.acc +
        "/thermostat_statuses/" +
        item.number +
        "?auth_user_code=99&auth_token=" +
        lu_auth_token,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fan_mode: s_fan_mode,
          mode: s_mode,
          setpoint_cooling: s_setpoint_cooling,
          setpoint_heating: s_setpoint_heating
        })
      }
    )
      .then(results => {
        return results.json();
      })
      .then(function(rec) {
        that.setState({ open: true });
        that.setState({ msg: `Setting thermostat is ${rec.status}` });
        //that.getThermostats($('#edAccountNumber').text());
      });
  }
  lightsOn(item, llevel) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Setting # ${item.number} to ${llevel}` });
    fetch(
      "https://api.securecomwireless.com/1/panels/" +
        this.props.params.panelId +
        "/light_statuses/" +
        item.number +
        "?auth_token=" +
        lu_auth_token,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          level: llevel
        })
      }
    )
      .then(results => {
        return results.json();
      })
      .then(function(rec) {
        that.setState({ open: true });
        that.setState({ msg: `Light: # ${rec.status}` });
        //this.getLights($('#edAccountNumber').text());
      });
  }
  lockDoor(item, block) {
    let that = this;
    that.setState({ open: true });
    if (block) that.setState({ msg: `Locking # ${item.number}` });
    else that.setState({ msg: `Unlocking # ${item.number}` });
    //' + document.getElementById('edAuthCode').value + '
    fetch(
      "https://api.securecomwireless.com/1/panels/" +
        this.props.params.panelId +
        "/lock_statuses/" +
        item.number +
        "?auth_user_code=99&auth_token=" +
        lu_auth_token,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: block ? "SECURED" : "UNSECURED"
        })
      }
    )
      .then(results => {
        return results.json();
      })
      .then(function(rec) {
        that.setState({ open: true });
        if (block) that.setState({ msg: `Locking # ${rec.status}` });
        else that.setState({ msg: `Unlocking # ${rec.status}` });
        //this.GetLocks($('#edAccountNumber').text());
      });
  }
  getUsers() {
    let that = this;
    that.setState({ open: true, updateUser: false });
    that.setState({ msg: `Getting Users` });
    fetch(
      "https://api.securecomwireless.com/v2/panels/" +
        this.props.params.panelId +
        "/user_codes?auth_token=" +
        lu_auth_token,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        // populate screen fields with results
        return results.json();
      })
      .then(function(users) {
        if (users) {
          //console.log(users);
          that.setState({ users });
          that.setState({ open: true });
          that.setState({ msg: `Retrieved Users` });
          //refreshUserTable();
        }
      });
  }
  overView() {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Loading Panels` });
    fetch(
      `https://api.securecomwireless.com/v2/customers/${
        this.props.params.id
      }/control_systems?page_size=5000&auth_token=${lu_auth_token}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        return results.json();
      })
      .then(res => {
        that.setState({ open: true });
        that.setState({ msg: `Retrieved Panels` });
        let data = res.map(item => {
          item.z_Lights = [];
          item.z_Locks = [];
          item.z_Thermostats = [];
          return item;
        });
        this.setState({ overview: data });
      });
  }
  getLightsForPanels(item) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Getting Lights.` });
    return new Promise(function(resolve, reject) {
      fetch(
        "https://api.securecomwireless.com/1/panels/1-" +
          item.control_system.panels["0"].account_number +
          "/light_statuses?auth_token=" +
          lu_auth_token,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(results => {
          return results.json();
        })
        .then(function(rec) {
          if (rec.status == "success") {
            item.z_Lights = rec.response.light_statuses;
            if (rec.response.light_statuses.length > 0) {
              // TODO: if cached, then re-quest again in a few seconds....
              if (rec.response.light_statuses[0].cache_status == "PENDING") {
                //setTimeout(function() { that.getLightsForPanels(item); }, 2000);
              } else if (
                rec.response.light_statuses[0].cache_status == "ERROR"
              ) {
                reject(rec);
              }
            }
          } else {
            reject(rec);
          }
          if (item.z_Lights)
            item.z_Lights.forEach(function(item1) {
              item.status = "Level: " + item1.level;
              item.panelid = item.control_system.panels["0"].control_system_id;
              item.account = item.control_system.panels["0"].account_number;
            });
          resolve(item);
          that.getLocksForPanels(item);
        });
    });
  }
  getLocksForPanels(item) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Getting Locks.` });
    return new Promise(function(resolve, reject) {
      fetch(
        "https://api.securecomwireless.com/1/panels/1-" +
          item.control_system.panels["0"].account_number +
          "/lock_statuses?auth_token=" +
          lu_auth_token,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(results => {
          return results.json();
        })
        .then(function(rec) {
          if (rec.status == "success") {
            item.z_Locks = rec.response.lock_statuses;

            if (rec.response.lock_statuses.length > 0) {
              if (rec.response.lock_statuses[0].cache_status == "PENDING") {
                //setTimeout(function() { GetLocks(acct); }, 2000);
              } else if (
                rec.response.lock_statuses[0].cache_status == "ERROR"
              ) {
                //showZwaveStatus(rec.response.lock_statuses[0].error_message);
                reject(rec);
              }
            }
          } else {
            //showZwaveStatus('Lock Error: ' + rec.response.status)
            reject(rec);
          }
          if (item.z_Locks)
            item.z_Locks.forEach(function() {
              item.panelid = item.control_system.panels["0"].control_system_id;
            });
          resolve(item);
          that.getThermostatsForPanels(item);
        });
    });
  }
  getThermostatsForPanels(item) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Getting Thermostats.` });
    return new Promise(function(resolve, reject) {
      fetch(
        "https://api.securecomwireless.com/1/panels/1-" +
          item.control_system.panels["0"].account_number +
          "/thermostat_statuses?auth_token=" +
          lu_auth_token,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(results => {
          return results.json();
        })
        .then(function(rec) {
          if (rec.status == "success") {
            item.z_Thermostats = rec.response.thermostat_statuses;
            // if (rec.response.thermostat_statuses.length>0) {
            //   if (rec.response.thermostat_statuses[0].cache_status=='PENDING') {
            //     // try again
            //   }
            //   else if (rec.response.thermostat_statuses[0].cache_status=='ERROR') {
            //     reject(rec);
            //   }
            // }
            resolve(item);
          } else {
            reject(rec);
          }
        });
    });
  }
  refreshZones(panelId) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Refreshing Zones.` });
    fetch(
      "https://api.securecomwireless.com/v2/panels/" +
        panelId +
        "/zone_informations/refresh?auth_user_code=99&auth_token=" +
        lu_auth_token,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: JSON.stringify({ concept: "zone_information", panel_id: panelId })
      }
    )
      .then(results => {
        // populate screen fields with results
        return results.json();
      })
      .then(function(job) {
        if (job) {
          that.getZones(panelId);
        }
      });
  }
  getZones(panelId) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Fetching Zones.` });
    fetch(
      "https://api.securecomwireless.com/v2/panels/" +
        panelId +
        "/zone_informations?auth_token=" +
        lu_auth_token,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        data: JSON.stringify({ concept: "zone_information", panel_id: panelId })
      }
    )
      .then(results => {
        // populate screen fields with results
        return results.json();
      })
      .then(function(zones) {
        if (zones) {
          that.refreshZonesStatus(panelId);
        }
      });
  }
  refreshZonesStatus(panelId) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Refreshing Zone Status...` });
    fetch(
      "https://api.securecomwireless.com/v2/panels/" +
        panelId +
        "/zone_statuses/refresh?include_24_hour_zones=true&auth_user_code=99&auth_token=" +
        lu_auth_token,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        // populate screen fields with results
        return results.json();
      })
      .then(function() {
        // jobs.addJob(job.job.uuid, function(job) {
        that.getZonesStatus(panelId);
        // });
      });
  }
  getZonesStatus(panelid) {
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Fetching Zone Status...` });
    fetch(
      "https://api.securecomwireless.com/v2/panels/" +
        panelid +
        "/zone_statuses?auth_user_code=99&page=1&page_size=100&auth_token=" +
        lu_auth_token,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        // populate screen fields with results
        return results.json();
      })
      .then(function(zones) {
        if (zones) {
          //console.log(zones)
          // pnl_zones_status = zones;
          // update pnl_zones with Status
          // for (var x = 0; x < pnl_zones_status.length; x++) {
          //   setZoneStatus(panelid, pnl_zones_status[x].zone_status.number, pnl_zones_status[x].zone_status);
          // }
          // pnl_zones.forEach(function(item, index) {
          //   item.number = item.zone_information.number;
          //   item.name = item.zone_information.name;
          //   if (item.zone_information.statusrec)
          //     item.status = item.zone_information.statusrec.status;
          //   item.node_type = 'ZONE';
          //   item.node_subtype = item.zone_information.tipe;
          // });
        }
      });
  }
  refreshActivity() {
    let acct =
      this.props.params.acc.length < 6
        ? `00${this.props.params.acc}`
        : this.props.params.acc;
    let that = this;
    that.setState({ open: true });
    that.setState({ msg: `Loading Activity..` });
    fetch("https://216.9.200.218/api.asp?r=88&a=0" + acct, {
      method: "GET"
    })
      .then(results => {
        // populate screen fields with results
        return results.json();
      })
      .then(function() {
        that.setState({ open: true });
        that.setState({ msg: `Retrieved Activity..` });
      });
  }
  deleteDevice(item) {
    let that = this;
    if (
      !window.confirm("Are you sure you want to delete Node # " + item.number)
    )
      return;
    fetch(
      "https://api.securecomwireless.com/1/panels/1-" +
        this.props.params.acc +
        "/zwave_devices/" +
        item.number +
        "?auth_user_code=99&auth_token=" +
        lu_auth_token,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        return results.json();
      })
      .then(function(job) {
        if (job) {
          that.setState({ open: true });
          that.setState({ msg: `${job.job_number} status ${job.status}` });
          that.refreshJob(job.job_number);
        }
      });
  }
  refreshJob(curJob) {
    let that = this;
    fetch(
      "https://api.securecomwireless.com/v2/jobs/" +
        curJob +
        "?auth_token=" +
        lu_auth_token,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    )
      .then(results => {
        if (results.status == 202 || results.status == 200)
          return results.json();
      })
      .then(function(x) {
        let s = x.job.status;
        let d = x.job.details;
        if (d && d.message) {
          s = s + " - " + x.job.details.message;
          that.setState({ open: true });
          that.setState({ msg: s });
          setTimeout(function() {
            if (d.stage != undefined) that.setState({ msg: d.stage });
          }, 2000);
        }
      });
  }
  removeUser(item) {
    let that = this;
    let number = parseInt(item.user_code.number);
    if (number < 2 || number > 19) {
      that.setState({ open: true });
      that.setState({ msg: `Invalid User Number` });
      return;
    } else {
      that.setState({ open: true });
      that.setState({ msg: `Removing User` });
      fetch(
        "https://api.securecomwireless.com/v2/panels/" +
          this.props.params.panelId +
          "/user_codes/" +
          item.user_code.number +
          "?auth_token=" +
          lu_auth_token,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      )
        .then(results => {
          // populate screen fields with results
          if (results.status == 202 || results.status == 200)
            return results.json();
          else {
            that.setState({ open: true });
            that.setState({ msg: "Error in Removing Users" });
          }
        })
        .then(function(x) {
          if (x) {
            setTimeout(function() {
              that.getUsers();
            }, 1500);
            that.setState({ open: true });
            that.setState({ msg: "User Removing Status -  " + x.job.status });
          } else {
            that.setState({ open: true });
            that.setState({ msg: "Error in Removing Users" });
          }
        });
    }
    // curFunction=3;
  }
  handleuserId(e) {
    this.setState({ userid: e.target.value });
  }
  refreshZwaves() {
    this.setState({ open: true });
    this.setState({ msg: `Refreshing` });
    const data = this.state.overview.map(item => {
      item.z_Lights = [];
      item.z_Locks = [];
      item.z_Thermostats = [];
      return item;
    });
    this.setState({ overview: data });
  }
  handleNodeName(e) {
    this.setState({ nodename: e.target.value });
  }
  handleuserName(e) {
    this.setState({ username: e.target.value });
  }
  handleuserCode(e) {
    this.setState({ usercode: e.target.value });
  }
  addNode() {
    let that = this;
    if (that.state.nodename == "") return;
    let a = "000000" + this.props.params.acc;
    let nodename = that.state.nodename;
    nodename = "88" + a.substr(a.length - 5, 5) + "N" + nodename.substr(0, 8);
    fetch(
      "https://api.securecomwireless.com/1/panels/1-" +
        this.props.params.acc +
        "/zwave_devices?auth_user_code=99&auth_token=" +
        lu_auth_token,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          device_name: nodename
        })
      }
    )
      .then(results => {
        if (results.status == 200 || results.status == 202)
          return results.json();
      })
      .then(function(job) {
        if (job) {
          that.refreshJob(job.job_number);
        }
      });
  }
  updateUser(item) {
    let usercode = item.user_code.number + "";
    while (usercode.length < 4) usercode = "0" + usercode;
    this.setState({
      updateUser: true,
      userid: item.user_code.number,
      username: item.user_code.name,
      usercode: usercode,
      dialog: true
    });
  }
  addUser() {
    let that = this;
    let number = parseInt(this.state.userid);
    if (number < 2 || number > 19) {
      that.setState({ open: true });
      that.setState({ msg: `Invalid User Number` });
      return;
    } else {
      that.setState({ open: true });
      that.setState({ msg: "Adding Users" });
      let usr = TNewUser;
      usr.user_code.number = this.state.userid;
      usr.user_code.name = this.state.username;
      usr.user_code.code = this.state.usercode;
      fetch(
        "https://api.securecomwireless.com/v2/panels/" +
          this.props.params.panelId +
          "/user_codes?auth_token=" +
          lu_auth_token,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(usr)
        }
      )
        .then(results => {
          // populate screen fields with results
          if (results.status == 202 || results.status == 200)
            return results.json();
          else {
            that.setState({ open: true });
            that.setState({ msg: "Error in Adding Users" });
          }
        })
        .then(function(x) {
          that.setState({ userid: "", username: "", usercode: "" });
          that.setState({ dialog: false });
          if (x) {
            setTimeout(function() {
              that.getUsers();
            }, 1500);
            that.setState({ open: true });
            that.setState({ msg: "User Removing Status -  " + x.job.status });
          } else {
            that.setState({ open: true });
            that.setState({ msg: "Error in Adding Users" });
          }
        });
    }
  }
  render() {
    const { data, overview } = this.state;
    const tabnames = {
      0: "Devices",
      1: "Users",
      2: "Activity"
    };
    const actions = [
      <FlatButton
        key={0}
        label="Cancel"
        primary={true}
        onClick={this.modalClose}
      />,
      <FlatButton
        key={1}
        label={this.state.updateUser ? "Update" : "Add"}
        primary={true}
        keyboardFocused={true}
        onClick={this.addUser}
      />
    ];
    const actions1 = [
      <FlatButton
        key={0}
        label="Cancel"
        primary={true}
        onClick={this.closeNode}
      />,
      <FlatButton
        key={1}
        label={this.state.actionType ? "Include" : "Exclude"}
        primary={true}
        keyboardFocused={true}
        onClick={this.addNode}
      />
    ];
    return (
      <div>
        <Snackbar
          open={this.state.open}
          message={this.state.msg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
        <h3 style={globalStyles.navigation}>
          {
            <Link to="/">
              {this.props.params.name} (#{this.props.params.acc})
            </Link>
          }{" "}
          /{" "}
          {
            <Link
              to={`/customer/${this.props.params.name}/${
                this.props.params.acc
              }/${this.props.params.id}`}
            >
              {this.props.params.panelName}
            </Link>
          }{" "}
          / {tabnames[this.state.slideIndex]}
        </h3>
        <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
          <Tab label="Devices" value={0} />
          <Tab label="Users" value={1} onActive={this.getUsers} />
          <Tab label="Activity" value={2} onActive={this.refreshActivity} />
          <Tab label="Overview" value={3} onActive={this.overView} />
        </Tabs>
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div className="row" style={styles.slide}>
            <Dialog
              title={this.state.actionType ? "Include" : "Exclude"}
              actions={actions1}
              modal={false}
              open={this.state.nodeModal}
              onRequestClose={this.closeNode}
              autoScrollBodyContent={true}
            >
              <div>
                <form>
                  <TextField
                    floatingLabelText="Node name"
                    value={this.state.nodename}
                    fullWidth={true}
                    onChange={this.handleNodeName}
                  />
                </form>
              </div>
            </Dialog>
            <div style={styles.btnWrap}>
              <FlatButton
                label="Include"
                primary={true}
                onClick={() => this.openNode(true)}
              />
              <FlatButton
                label="Exclude"
                primary={true}
                onClick={() => this.openNode(false)}
              />
              <FlatButton label="Master Code: 99" primary={true} disabled />
            </div>
            <div
              className={Object.keys(data).length == 0 ? "d-block" : "d-none"}
            >
              No Devices
            </div>
            {Object.entries(data).map(([i, item]) => (
              <Card
                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                key={i}
                style={styles.card}
              >
                <CardHeader
                  title={`#${item.number} ${item.node_type}`}
                  subtitle={item.node_subtype}
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText expandable={true} className="display-linebreak">
                  <div>{item.name}</div>
                  <div>{item.status}</div>
                  <div>
                    {item.last_status_at != null
                      ? `Last updated :${Moment(item.last_status_at).fromNow()}`
                      : null}
                  </div>
                  <div>
                    {item.last_status_at != null
                      ? `(${Moment(item.last_status_at).format(
                          "DD-MM-YYYY hh:MM:ss a"
                        )})`
                      : null}
                  </div>
                </CardText>
                <CardActions>
                  <div
                    className={
                      item.node_type == "THERMOSTAT" ? "d-block" : "d-none"
                    }
                  >
                    <FlatButton
                      label="Fan AUTO"
                      primary={true}
                      onClick={() =>
                        this.setThermostat(item, "AUTO", "COOL", "80", "71")
                      }
                    />
                    <FlatButton
                      label="Fan ON"
                      secondary={true}
                      onClick={() =>
                        this.setThermostat(item, "ON", "OFF", "80", "71")
                      }
                    />
                    <FlatButton
                      label="OFF"
                      primary={true}
                      onClick={() =>
                        this.setThermostat(item, "AUTO", "OFF", "80", "71")
                      }
                    />
                    <FlatButton
                      label="COOL"
                      secondary={true}
                      onClick={() =>
                        this.setThermostat(item, "AUTO", "COOL", "80", "71")
                      }
                    />
                    <FlatButton
                      label="HEAT"
                      primary={true}
                      onClick={() =>
                        this.setThermostat(item, "AUTO", "HEAT", "80", "71")
                      }
                    />
                    <FlatButton
                      label="AUTO"
                      secondary={true}
                      onClick={() =>
                        this.setThermostat(item, "AUTO", "AUTO", "80", "71")
                      }
                    />
                  </div>
                  <div
                    className={
                      item.node_type == "LIGHT" && item.node_type !== "BINARY"
                        ? "d-block"
                        : "d-none"
                    }
                  >
                    <FlatButton
                      label="Light OFF"
                      primary={true}
                      onClick={() => this.lightsOn(item, 0)}
                    />
                    <FlatButton
                      label="Light 5%"
                      secondary={true}
                      onClick={() => this.lightsOn(item, 5)}
                    />
                    <FlatButton
                      label="Light 10%"
                      primary={true}
                      onClick={() => this.lightsOn(item, 10)}
                    />
                    <FlatButton
                      label="Light 15%"
                      secondary={true}
                      onClick={() => this.lightsOn(item, 15)}
                    />
                    <FlatButton
                      label="Light ON"
                      primary={true}
                      onClick={() => this.lightsOn(item, 99)}
                    />
                  </div>
                  <div
                    className={
                      item.node_type == "LIGHT" && item.node_type === "BINARY"
                        ? "d-block"
                        : "d-none"
                    }
                  >
                    <FlatButton
                      label="Light OFF"
                      primary={true}
                      onClick={() => this.lightsOn(item, 0)}
                    />
                    <FlatButton
                      label="Light ON"
                      primary={true}
                      onClick={() => this.lightsOn(item, 99)}
                    />
                  </div>
                  <div
                    className={item.node_type == "LOCK" ? "d-block" : "d-none"}
                  >
                    <FlatButton
                      label="Lock"
                      primary={true}
                      onClick={() => this.lockDoor(item, true)}
                    />
                    <FlatButton
                      label="Un-Lock"
                      secondary={true}
                      onClick={() => this.lockDoor(item, false)}
                    />
                  </div>
                  <FlatButton
                    label="Delete device"
                    primary={true}
                    onClick={() => this.deleteDevice(item)}
                  />
                </CardActions>
              </Card>
            ))}
          </div>
          <div className="row" style={styles.slide}>
            <FlatButton
              label="Add user"
              primary={true}
              onClick={() => this.modalOpen()}
            />
            <Dialog
              title={this.state.updateUser ? "Update User" : "Add User"}
              actions={actions}
              modal={false}
              open={this.state.dialog}
              onRequestClose={this.modalClose}
              autoScrollBodyContent={true}
            >
              <div>
                <form>
                  <TextField
                    floatingLabelText="User"
                    value={this.state.userid}
                    fullWidth={true}
                    onChange={this.handleuserId}
                  />
                  <TextField
                    floatingLabelText="Name"
                    value={this.state.username}
                    fullWidth={true}
                    onChange={this.handleuserName}
                  />
                  <TextField
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
                {this.state.users.map((item, i) => (
                  <TableRow key={i}>
                    <TableRowColumn>{item.user_code.number}</TableRowColumn>
                    <TableRowColumn>{item.user_code.name}</TableRowColumn>
                    <TableRowColumn>
                      <FlatButton
                        label="Delete"
                        primary={true}
                        onClick={() => this.removeUser(item)}
                      />
                      <FlatButton
                        label="Update"
                        primary={true}
                        onClick={() => this.updateUser(item)}
                      />
                    </TableRowColumn>
                  </TableRow>
                ))}
                ;
              </TableBody>
            </Table>
          </div>
          <div style={styles.slide}>Activity</div>
          <div style={styles.slide}>
            <div style={styles.btnWrap}>
              <FlatButton
                label="Refresh Z-Wave"
                primary={true}
                onClick={() => this.refreshZwaves()}
              />
            </div>
            <div className="row" style={styles.noMargin}>
              {overview.map((item, i) => (
                <div
                  key={i}
                  className="col-xs-12 col-sm-12 col-md-4 col-lg-4"
                  style={styles.paddingLeft}
                >
                  <Card style={styles.card}>
                    <CardHeader
                      title={`Name : ${item.control_system.name}`}
                      subtitle={`Id : ${
                        item.control_system.panels[0].control_system_id
                      }`}
                      actAsExpander={true}
                      showExpandableButton={true}
                    />
                    <CardText expandable={true} className="display-linebreak">
                      <span>{`Account # : ${
                        item.control_system.panels["0"].account_number
                      }`}</span>
                      <br />
                      {item.control_system.address_1 != "" &&
                      item.control_system.address_1 != null
                        ? "<span>{`Address :item.control_system.address_1`}</span><br/>"
                        : null}
                      <span>{`S/N: ${
                        item.control_system.panels["0"].serial_number
                      } ${
                        item.control_system.panels["0"].connection_status
                      }`}</span>
                      <br />
                      <span>{`Hardware: ${
                        item.control_system.panels["0"].hardware_model
                      } v ${item.control_system.panels["0"].software_version} ${
                        item.control_system.panels["0"].software_date
                      }`}</span>
                      <br />
                      <span>{`Z-Wave Update # : ${
                        item.z_status ? item.z_status : "-"
                      }`}</span>
                      <br />
                      <span>{`Zone Update # : ${
                        item.zon_status ? item.zon_status : "-"
                      }`}</span>
                      <br />
                      {item.z_Lights.map((light, j) => (
                        <div key={j} style={styles.box}>
                          <span>
                            {light.number} - {light.name} &nbsp;
                          </span>
                          {light.cache_status == "ERROR"
                            ? '<span className="error">{item.error_message}</span>'
                            : null}
                          <span className={item.level != "0" ? "error" : ""}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                      {item.z_Locks.map((light, j) => (
                        <div key={j} style={styles.box}>
                          <span>{light.name} &nbsp;</span>
                          {light.cache_status == "ERROR"
                            ? '<span className="error">{item.error_message}</span>'
                            : null}
                          <span
                            className={
                              item.status == "SECURED" &&
                              item.battery_percent > 25
                                ? ""
                                : "error"
                            }
                          >
                            {item.status} {item.battery_percent}
                          </span>
                        </div>
                      ))}
                      {item.z_Thermostats.map((thermomstat, j) => (
                        <div key={j} style={styles.box}>
                          <span>{thermomstat.name} &nbsp;</span>
                          {thermomstat.cache_status == "ERROR"
                            ? '<span className="error">{item.error_message}</span>'
                            : null}
                          <span
                            className={
                              thermomstat.current_temperature <
                                thermomstat.setpoint_heating * 1.0 - 1.0 ||
                              thermomstat.current_temperature >
                                thermomstat.setpoint_cooling * 1.0 + 1.0
                                ? "error"
                                : ""
                            }
                          >
                            <div>{`Fan:${thermomstat.fan_mode} Mode: ${
                              thermomstat.mode
                            }`}</div>
                            <div>{`Temp:${thermomstat.current_temperature} (${
                              thermomstat.setpoint_heating
                            } /${thermomstat.setpoint_cooling})`}</div>
                          </span>
                        </div>
                      ))}
                    </CardText>
                    <CardActions expandable={true}>
                      <FlatButton
                        label="Get Status"
                        primary={true}
                        onClick={() => this.getLightsForPanels(item)}
                      />
                    </CardActions>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </SwipeableViews>
      </div>
    );
  }
}
PanelPage.propTypes = {
  params: PropTypes.object
};
export default PanelPage;
