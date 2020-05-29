import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";
import Navbar from "./Navbar";

import { Container, Row, Col, Button } from "reactstrap";

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 5,
      text: "",
      existed: 0,
    };
  }
  async componentDidMount() {
    let ratingInfo = await apiCall(
      "get",
      `/api/rating/${this.props.match.params.landlord_id}/rater/${this.props.currentUser.user.userId}`
    );
    if (ratingInfo.rating) {
      this.setState({ score: ratingInfo.rating.score, text: ratingInfo.rating.text, existed: 1 });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  deleteRating = () => {
    apiCall("delete", `/api/rating/${this.props.match.params.landlord_id}/rater/${this.props.currentUser.user.userId}`);
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };

  submitRating = async (e) => {
    e.preventDefault();
    const { score, text } = this.state;
    if (this.state.existed === 1) {
      await apiCall(
        "put",
        `/api/rating/${this.props.match.params.landlord_id}/rater/${this.props.currentUser.user.userId}`,
        { score: score, text }
      );
    } else {
      await apiCall(
        "post",
        `/api/rating/${this.props.match.params.landlord_id}/rater/${this.props.currentUser.user.userId}`,
        { score, text }
      );
    }
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Col>
            <form onSubmit={(e) => this.submitRating(e)}>
              <label htmlFor="score">Score: {this.state.score}</label>
              <input
                className="form-control"
                id="score"
                type="range"
                name="score"
                min="0"
                max="10"
                onChange={this.handleChange}
                value={this.state.score}
              />

              <label htmlFor="text">Comments:</label>
              <input
                className="form-control"
                id="text"
                type="text"
                name="text"
                onChange={this.handleChange}
                value={this.state.text}
              />
              <Button type="submit" color="primary">
                Submit
              </Button>
              <Button color="danger" onClick={this.deleteRating}>
                Delete
              </Button>
            </form>
          </Col>
        </Container>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
  };
}

export default withRouter(connect(mapStateToProps, {})(Rating));
