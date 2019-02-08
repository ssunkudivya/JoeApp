import React from 'react';
import { Router,Route, IndexRoute } from 'react-router';
import App from './containers/App';
import NotFoundPage from './containers/NotFoundPage.js';
import LoginPage from './containers/LoginPage';
import Dashboard from './containers/DashboardPage';
import PanelPage from './containers/PanelPage';
import PanelList from './containers/PanelList';
function loggedIn() {
  const auth = localStorage.getItem('auth');
  return auth;
}
function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login'
    });
  }
}
function isAuth(nextState, replace) {
  if (loggedIn()) {
    replace({
      pathname: '/'
    });
  }
}
export default (
  <Router>
    <Route path="login" component={LoginPage} onEnter={isAuth}/>
    <Route path="/" component={App} onEnter={requireAuth}>
      <IndexRoute component={Dashboard}/>
      <Route path="customer/:name/:acc/:id" component={PanelList}/>
      <Route path="panel/:name/:acc/:id/:sn/:cid/:panelId/:panelName" component={PanelPage}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);
