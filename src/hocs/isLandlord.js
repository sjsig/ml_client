import React from "react";
import { connect } from "react-redux";

export default function isLandlord(ComponentToBeRendered) {
  class Landlord extends React.Component {
    componentWillMount() {
      if (!this.props.is_landlord) {
        this.props.history.push("/");
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.is_landlord) {
        this.props.history.push("/");
      }
    }
    render() {
      return <ComponentToBeRendered {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      is_landlord: state.currentUser.user.is_landlord,
    };
  }

  return connect(mapStateToProps)(Landlord);
}
