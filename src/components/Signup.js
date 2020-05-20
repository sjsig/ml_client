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
      name: "",
      password: "",
      checkedPassword: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, name, password, checkedPassword } = this.state;
    if (username === "" || name === "" || password === "" || checkedPassword === "") {
      this.props.addError("Please fill out all fields");
    } else if (password !== checkedPassword) {
      this.props.addError("Those passwords don't match");
    } else {
      this.props
        .authUser("signup", { username, password, name })
        .then(() => {
          this.props.history.push("/");
        })
        .catch(() => {
          return;
        });
    }
  };

  render() {
    const { username, name, password, checkedPassword } = this.state;
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

              <label htmlFor="name">Name:</label>
              <input
                className="form-control"
                id="name"
                type="text"
                name="name"
                onChange={this.handleChange}
                value={name}
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

              <label htmlFor="password">Password:</label>
              <input
                className="form-control"
                id="password"
                type="password"
                name="password"
                onChange={this.handleChange}
              />
              <label htmlFor="checkedPassword">Type Password Again:</label>
              <input
                className="form-control"
                id="checkedPassword"
                type="password"
                name="checkedPassword"
                onChange={this.handleChange}
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
