import React from "react";
import { Link } from "react-router-dom";

class PageNotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Page not found</h1>
        <Link to="/">Homepage</Link>
      </div>
    );
  }
}

export default PageNotFound;
