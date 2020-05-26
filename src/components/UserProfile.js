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
    let propertiesData = await apiCall("get", `/api/property/landlord/${this.props.currentUser.user.userId}`);
    let leaseData = await apiCall("get", `/api/lease/${this.props.currentUser.user.userId}`);
    this.setState({
      userInfo: userData.user,
      transactionHistory: transactionData.transactions,
      properties: propertiesData.properties,
      lease: leaseData.lease,
    });
    console.log("User state:", this.state);
  }
  deleteUser = () => {
    apiCall("delete", `/api/users/${this.props.currentUser.user.userId}`);
    this.props.logout();
    this.props.history.push("/");
  };

  terminateLease = () => {
    apiCall("delete", `/api/unit/${this.state.lease.unit_id}/lease/${this.state.lease.lease_id}`);
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };
  render() {
    let properties = this.state.properties.map((property) => (
      <li>
        <div>
          {property.address}, {property.city}
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </li>
    ));
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
