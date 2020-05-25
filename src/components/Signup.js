import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { addError, removeError } from "../store/actions/error";
import { authUser } from "../store/actions/auth";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      checkedPassword: "",
      age: "",
      is_tenant: true,
      is_landlord: false,
    };
  }

  handleChange = (e) => {
    if (e.target.name === "is_tenant") {
      this.setState((prevState) => ({
        is_tenant: !prevState.is_tenant,
      }));
    } else if (e.target.name === "is_landlord") {
      this.setState((prevState) => ({
        is_landlord: !prevState.is_lord,
      }));
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, first_name, last_name, password, checkedPassword, age, is_tenant, is_landlord } = this.state;
    if (
      username === "" ||
      first_name === "" ||
      last_name === "" ||
      password === "" ||
      checkedPassword === "" ||
      age === 0
    ) {
      this.props.addError("Please fill out all fields");
    } else if (password !== checkedPassword) {
      this.props.addError("Those passwords don't match");
    } else {
      this.props
        .authUser("signup", { username, password, first_name, last_name, age, is_tenant, is_landlord })
        .then(() => {
          this.props.history.push("/");
        })
        .catch(() => {
          return;
        });
    }
  };

  render() {
    const { username, first_name, last_name, password, checkedPassword, age, is_tenant, is_landlord } = this.state;
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
              <h2>Sign Up</h2>
              {errors.message && <div className="alert alert-danger">{errors.message} </div>}

              <label htmlFor="first_name">First name:</label>
              <input
                className="form-control"
                id="first_name"
                type="text"
                name="first_name"
                onChange={this.handleChange}
                value={first_name}
              />

              <label htmlFor="last_name">Last name:</label>
              <input
                className="form-control"
                id="last_name"
                type="text"
                name="last_name"
                onChange={this.handleChange}
                value={last_name}
              />

              <label htmlFor="username">Username:</label>
              <input
                className="form-control"
                id="username"
                type="text"
                name="username"
                onChange={this.handleChange}
                value={username}
              />

              <label htmlFor="age">Age:</label>
              <input
                className="form-control"
                id="age"
                type="number"
                name="age"
                onChange={this.handleChange}
                value={age}
              />

              <label htmlFor="password">Password:</label>
              <input
                className="form-control"
                id="password"
                type="password"
                name="password"
                onChange={this.handleChange}
                value={password}
              />
              <label htmlFor="checkedPassword">Type Password Again:</label>
              <input
                className="form-control"
                id="checkedPassword"
                type="password"
                name="checkedPassword"
                onChange={this.handleChange}
                value={checkedPassword}
              />

              <label htmlFor="is_tenant">I plan to use this site as a tenant: </label>
              <input
                className="form-control"
                id="is_tenant"
                type="checkbox"
                name="is_tenant"
                onChange={this.handleChange}
                checked={is_tenant}
              />

              <label htmlFor="is_landlord">I plan to use this site as a landlord: </label>
              <input
                className="form-control"
                id="is_landlord"
                type="checkbox"
                name="is_landlord"
                onChange={this.handleChange}
                checked={is_landlord}
              />

              <button className="btn btn-primary" type="submit">
                SIGN UP!
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { errors: state.errors };
}

export default withRouter(connect(mapStateToProps, { addError, removeError, authUser })(Signup));
