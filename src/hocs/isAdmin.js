import React from "react";
import { connect } from "react-redux";

export default function isAdmin(ComponentToBeRendered) {
  class Admin extends React.Component {
    componentWillMount() {
      if (!this.props.is_admin) {
        this.props.history.push("/");
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.is_admin) {
        this.props.history.push("/");
      }
    }
    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      is_admin: state.currentUser.user.is_admin,
    };
  }

  return connect(mapStateToProps)(Admin);
}
