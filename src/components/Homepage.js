import React from "react";
import Navbar from "./Navbar";
import { apiCall } from "../services/api";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    let userData = await apiCall("get", `/api/`);
    alert(userData.message);
  }
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <h1>Homepage!</h1>
      </div>
    );
  }
}

export default Homepage;
