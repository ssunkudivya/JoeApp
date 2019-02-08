import React, { Component }  from 'react';
import RecentlyProducts from '../components/dashboard/RecentlyProducts';
import globalStyles from '../styles';
export default class DashboardPage extends Component {
  constructor(props) {
      super(props);
  }
  render(){
    return (
      <div>
        <h3 style={globalStyles.navigation}>Customers</h3>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 m-b-15 ">
            <RecentlyProducts />
          </div>
        </div>
      </div>
    );
  }
}
