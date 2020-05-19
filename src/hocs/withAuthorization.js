//higher order components are functions that wrap another component
//this one handles validation to make sure a user is logged in before they see that component
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

export default function withAuthorization(ComponentToBeRendered) {
  class Authorize extends React.Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.props.history.push("/signin");
      } else if (this.props.userId != this.props.match.params.id && !this.props.isAdmin) {
        this.props.history.push("/");
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.props.history.push("/signin");
      } else if (this.props.userId != this.props.match.params.id && !this.props.isAdmin) {
        this.props.history.push("/");
      }
    }
    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.currentUser.isAuthenticated,
      userId: state.currentUser.user.id,
      isAdmin: state.currentUser.user.admin,
    };
  }

  return withRouter(connect(mapStateToProps)(Authorize));
}
