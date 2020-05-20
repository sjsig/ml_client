import React from "react";
import Navbar from "./Navbar";

class Homepage extends React.Component {
  constructor(props) {
    super(props);
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
