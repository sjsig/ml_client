import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import withAuthorization from "../hocs/withAuthorization";
import withAdmin from "../hocs/withAdmin";
import Homepage from "./Homepage";
import Signup from "./Signup";
import Signin from "./Signin";
import PageNotFound from "./PageNotFound";
import UserProfile from "./UserProfile";
import RentalListings from "./RentalListings";
import ListNewProperty from "./ListNewProperty";

const Main = (props) => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/listings" component={RentalListings} />
        <Route exact path="/listings/new" component={ListNewProperty} />
        <Route exact path="/users/:id" component={UserProfile} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

export default withRouter(connect(mapStateToProps, {})(Main));
