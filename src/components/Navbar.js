import React from "react";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { logout } from "../store/actions/auth";

class Navbar extends React.Component {
  render() {
    const active = { textDecoration: "none", cursor: "default", color: "grey" };
    const defaultStyle = {
      margin: "5px",
    };
    const { currentUser, logout } = this.props;
    return (
      <nav className="navbar navbar-expand" style={{ backgroundColor : 'red'}}>
        <div className="container-fluid">
          <div className="navbar-brand">
            <NavLink exact style={defaultStyle} activeStyle={active} to="/">
              MeetLandlords.com
            </NavLink>
          </div>
          {currentUser.user.is_admin == 1 && (
            <div className="navbar-brand">
              <NavLink exact style={defaultStyle} activeStyle={active} to="/admin">
                Admin Center
              </NavLink>
            </div>
          )}
          <div className="navbar-brand">
            <NavLink exact style={defaultStyle} activeStyle={active} to="/listings">
              View Vacant Rentals
            </NavLink>
          </div>
          <div className="navbar-brand">
            <NavLink exact style={defaultStyle} activeStyle={active} to="/listings/new">
              List Your Property
            </NavLink>
          </div>
          {!currentUser.isAuthenticated ? (
            <div className="nav navbar-nav navbar-right">
              <NavLink exact style={defaultStyle} activeStyle={active} to="/signup">
                SIGN UP
              </NavLink>
              <NavLink exact style={defaultStyle} activeStyle={active} to="/signin">
                LOG IN
              </NavLink>
            </div>
          ) : (
            <div className="nav navbar-nav navbar-right">
              <Link exact style={defaultStyle} to={`/users/${currentUser.user.id}`}>
                Hello, {currentUser.user.name}
              </Link>
              <Link exact style={defaultStyle} to="/">
                <a onClick={logout}>LOGOUT</a>
              </Link>
            </div>
          )}
        </div>
        <div style={{ fontSize: "3em", margin: "25px" }}></div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps, { logout })(Navbar);
