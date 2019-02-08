import React,{Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import {grey500, white} from 'material-ui/styles/colors';
//import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Help from 'material-ui/svg-icons/action/help';
import TextField from 'material-ui/TextField';
import {Link} from 'react-router';
import ThemeDefault from '../theme-default';
const styles = {
  loginContainer: {
    minWidth: 320,
    maxWidth: 400,
    height: 'auto',
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    margin: 'auto'
  },
  paper: {
    padding: 20,
    overflow: 'auto'
  },
  buttonsDiv: {
    textAlign: 'center',
    padding: 10
  },
  flatButton: {
    color: grey500
  },
  checkRemember: {
    style: {
      float: 'left',
      maxWidth: 180,
      paddingTop: 5
    },
    labelStyle: {
      color: grey500
    },
    iconStyle: {
      color: grey500,
      borderColor: grey500,
      fill: grey500
    }
  },
  loginBtn: {
    float: 'right'
  },
  btn: {
    background: '#4f81e9',
    color: white,
    padding: 7,
    borderRadius: 2,
    margin: 2,
    fontSize: 13
  },
  btnSpan: {
    marginLeft: 5
  },
};
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password:''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  handleEmailChange(e) {
     this.setState({email: e.target.value});
  }
  handlePasswordChange(e) {
     this.setState({password: e.target.value});
  }
  handleClick(){
    localStorage.setItem('auth',JSON.stringify({email:this.state.email}));
  }
   render(){
      return (
        <MuiThemeProvider muiTheme={ThemeDefault}>
          <div>
            <div style={styles.loginContainer}>
                <Paper style={styles.paper}>
                  <form>
                    <TextField
                      hintText="E-mail"
                      floatingLabelText="E-mail"
                      fullWidth={true}
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                    />
                    <TextField
                      hintText="Password"
                      floatingLabelText="Password"
                      fullWidth={true}
                      type="password"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                    />

                    <div>
                      <Checkbox
                        label="Remember me"
                        style={styles.checkRemember.style}
                        labelStyle={styles.checkRemember.labelStyle}
                        iconStyle={styles.checkRemember.iconStyle}
                      />

                      <Link to="/">
                        <RaisedButton label="Login"
                            primary={true}
                            style={styles.loginBtn}
                            onClick={this.handleClick.bind(this)}/>
                      </Link>
                    </div>
                  </form>
                </Paper>
                <div style={styles.buttonsDiv}>
                  <FlatButton
                    label="Forgot Password?"
                    href="/login"
                    style={styles.flatButton}
                    icon={<Help />}
                  />
                </div>
            </div>
          </div>
        </MuiThemeProvider>
      );
  }
}
export default LoginPage;
