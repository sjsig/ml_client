import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";
import { logout } from "../store/actions/auth";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountBalance: 0,
      username: "",
    };
  }
  async componentDidMount() {
    let userData = await apiCall("get", `/api/users/${this.props.currentUser.user.userId}`);
    console.log("User data:", userData);
    this.setState({ ...userData.user });
  }
  deleteUser = () => {
    apiCall("delete", `/api/users/${this.props.currentUser.user.userId}`);
    this.props.logout();
    this.props.history.push("/");
  };
  testy = () => {
    this.props.history.push("/");
  };
  render() {
    return (
      <div>
        <h1>User profile</h1>
        <Link to="/events">Back to events</Link>
        <h1>
          Your username is <em>{this.state.username}</em>
        </h1>
        <h1>
          Your account balance is <em>{this.state.accountBalance}</em>
        </h1>

        <button onClick={this.deleteUser}>Delete Account</button>
        <button onClick={this.testy}>Test button</button>
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
