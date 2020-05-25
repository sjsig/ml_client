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
    };
  }
  async componentDidMount() {
    let userData = await apiCall("get", `/api/users/${this.props.currentUser.user.userId}`);
    let transactionData = await apiCall("get", `/api/user/${this.props.currentUser.user.userId}/transaction`);
    console.log("User data:", userData);
    console.log("Transactions", transactionData);
    this.setState({ userInfo: userData.user, transactionHistory: transactionData.transactions });
  }
  deleteUser = () => {
    apiCall("delete", `/api/users/${this.props.currentUser.user.userId}`);
    this.props.logout();
    this.props.history.push("/");
  };
  render() {
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
