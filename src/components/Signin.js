import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { addError, removeError } from "../store/actions/error";
import { authUser } from "../store/actions/auth";

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username === "" || password === "") {
      this.props.addError("Please fill out all fields");
    } else {
      this.props
        .authUser("signin", { username, password })
        .then(() => {
          this.props.history.push("/");
        })
        .catch(() => {
          return;
        });
    }
  };

  render() {
    const { username, password } = this.state;
    const { errors, removeError, history } = this.props;
    history.listen(() => {
      //listens for a change in the page history
      removeError();
    });
    return (
      <div>
        <div className="row justify-content-md-center text-center">
          <div className="col-md-6">
            <form onSubmit={this.handleSubmit}>
              <h2>Sign In</h2>
              {errors.message && <div className="alert alert-danger">{errors.message} </div>}
              <label htmlFor="username">Username:</label>
              <input
                className="form-control"
                id="username"
                type="text"
                name="username"
                onChange={this.handleChange}
                value={username}
              />

              <label htmlFor="password">Password:</label>
              <input
                className="form-control"
                id="password"
                type="password"
                name="password"
                onChange={this.handleChange}
              />

              <button className="btn btn-primary" type="submit">
                SIGN IN!
              </button>
            </form>
            <h1>
              Not a member? <Link to="/signup">Create an account!</Link>
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { errors: state.errors };
}

export default withRouter(connect(mapStateToProps, { addError, removeError, authUser })(Signin));
