import React from "react";
import { connect } from "react-redux";

export default function isTenant(ComponentToBeRendered) {
  class Tenant extends React.Component {
    componentWillMount() {
      if (!this.props.is_tenant) {
        this.props.history.push("/");
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.is_tenant) {
        this.props.history.push("/");
      }
    }
    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      is_tenant: state.currentUser.user.is_tenant,
    };
  }

  return connect(mapStateToProps)(Tenant);
}
