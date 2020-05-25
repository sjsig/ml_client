//higher order components are functions that wrap another component
//this one handles validation to make sure a user is logged in before they see that component
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

export default function isLoggedIn(ComponentToBeRendered) {
  class isLoggedIn extends React.Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.props.history.push("/signin");
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.props.history.push("/signin");
      }
    }
    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAuthenticated: state.currentUser.isAuthenticated,
    };
  }

  return withRouter(connect(mapStateToProps)(isLoggedIn));
}
