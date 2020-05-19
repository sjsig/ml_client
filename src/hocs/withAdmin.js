import React from "react";
import { connect } from "react-redux";

export default function withAdmin(ComponentToBeRendered) {
  class Admin extends React.Component {
    componentWillMount() {
      if (!this.props.isAdmin) {
        this.props.history.push("/");
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.isAdmin) {
        this.props.history.push("/");
      }
    }
    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isAdmin: state.currentUser.user.admin,
    };
  }

  return connect(mapStateToProps)(Admin);
}
