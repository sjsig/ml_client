import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
    };
  }
  async componentDidMount() {
    let userData = await apiCall("get", `/api/users/${this.props.currentUser.user.id}`);
    this.setState({ userData });
  }
  render() {
    return (
      <div>
        <Link to="/events">Back to events</Link>
        <h1>Your email is: {this.state.userData.email}</h1>
        <h1>Your user id is:{this.state.userData.id}</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
  };
}

export default withRouter(connect(mapStateToProps, {})(UserProfile));
