import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";
import { logout } from "../store/actions/auth";
import Navbar from "./Navbar";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: { accountBalance: 0, username: "" },
      transactionHistory: [],
      properties: [],
      lease: {},
    };
  }
  async componentDidMount() {
    let userData = await apiCall("get", `/api/users/${this.props.currentUser.user.userId}`);
    let transactionData = await apiCall("get", `/api/user/${this.props.currentUser.user.userId}/transaction`);
    let leaseData = await apiCall("get", `/api/lease/${this.props.currentUser.user.userId}`);
    this.setState({
      userInfo: userData.user,
      transactionHistory: transactionData.transactions,
      lease: leaseData.lease,
    });

    let propertiesData = await apiCall("get", `/api/property/landlord/${this.props.currentUser.user.userId}`);
    let unitsAdded = await propertiesData.properties.map(async (property) => {
      let unitData = await apiCall("get", `/api/property/${property.property_id}/unit`);
      return { ...property, units: unitData.units };
    });
    Promise.all(unitsAdded).then((values) => {
      this.setState({ properties: values });
    });
  }

  testButton = () => {
    console.log("current state:", this.state);
  };

  deleteUser = () => {
    apiCall("delete", `/api/users/${this.props.currentUser.user.userId}`);
    this.props.logout();
    this.props.history.push("/");
  };

  deleteProperty = (propertyId) => {
    apiCall("delete", `/api/property/${propertyId}`);
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };

  terminateLease = () => {
    apiCall("delete", `/api/unit/${this.state.lease.unit_id}/lease/${this.state.lease.lease_id}`);
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };
  render() {
    let properties = this.state.properties.map((property) => {
      let unitList = property.units.map((unit) => (
        <li>
          Unit {unit.unit_number}, {unit.market_price} per month,{" "}
          {unit.is_occupied == 1 ? <em>occupied</em> : <em>unoccupied</em>}
        </li>
      ));
      return (
        <li>
          <div>
            {property.address}, {property.city}
            <ul>{unitList}</ul>
            <button onClick={() => this.props.history.push(`/listings/${property.property_id}`)}>Edit</button>
            <button onClick={() => this.deleteProperty(property.property_id)}>Delete</button>
          </div>
        </li>
      );
    });
    return (
      <div>
        <Navbar />
        <h1>User profile</h1>
        <h1>
          Your username is <em>{this.state.userInfo.username}</em>
        </h1>
        <h1>
          Your account balance is <em>{this.state.userInfo.accountBalance}</em>
        </h1>
        {this.props.currentUser.user.is_landlord && (
          <div>
            <h1>Properties</h1>
            <ul>{properties}</ul>
          </div>
        )}
        {this.props.currentUser.user.is_tenant && this.state.lease && (
          <div>
            <h1>Lease</h1>
            <ul>
              <li>
                Starts {this.state.lease.start_date}, ends {this.state.lease.end_date}
              </li>
              <li>Costs {this.state.lease.price_monthly} per month</li>
            </ul>
            <button onClick={this.terminateLease}>Terminate lease</button>
          </div>
        )}
        <h1>You have {this.state.transactionHistory.length} transactions in your history</h1>
        <button onClick={this.deleteUser}>Delete Account</button>
        <button onClick={this.testButton}>Console.log current state</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
  };
}

export default withRouter(connect(mapStateToProps, { logout })(UserProfile));
