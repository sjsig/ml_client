import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import isAuthorized from "../hocs/isAuthorized";
import isAdmin from "../hocs/isAdmin";
import isLandlord from "../hocs/isLandlord";
import isTenant from "../hocs/isTenant";
import isLoggedIn from "../hocs/isLoggedIn";
import Homepage from "./Homepage";
import Signup from "./Signup";
import Signin from "./Signin";
import PageNotFound from "./PageNotFound";
import UserProfile from "./UserProfile";
import RentalListings from "./RentalListings";
import ListNewProperty from "./ListNewProperty";
import NewLease from "./NewLease";
import EditProperty from "./EditProperty";

const Main = (props) => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/listings" component={isLoggedIn(RentalListings)} />
        <Route exact path="/listings/new" component={isLandlord(ListNewProperty)} />
        <Route exact path="/listings/:property_id" component={isLandlord(EditProperty)} />
        <Route exact path="/lease/new/:unit_id" component={isLoggedIn(NewLease)} />
        <Route exact path="/users/:id" component={isAuthorized(UserProfile)} />
        <Route path="*" component={PageNotFound} />
      </Switch>
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

export default withRouter(connect(mapStateToProps, {})(Main));
