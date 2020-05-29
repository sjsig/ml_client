import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";
import Navbar from "./Navbar";
import { Container, Row, Col, Button } from "reactstrap";

class AllLandlordRatings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratings: [],
    };
  }
  async componentDidMount() {
    let ratingInfo = await apiCall("get", `/api/rating/${this.props.match.params.landlord_id}`);
    this.setState({ ratings: ratingInfo.ratings });
    console.log(ratingInfo);
  }

  render() {
    let ratings = this.state.ratings.map((rating, index) => {
      if (index % 2 == 1) {
        return (
          <Row>
            {rating.score >= 5 ? (
              <Col style={{ color: "green" }}>{rating.score}</Col>
            ) : (
              <Col style={{ color: "red" }}>{rating.score}</Col>
            )}
            <Col>{rating.text}</Col>
          </Row>
        );
      } else {
        return (
          <Row style={{ backgroundColor: "lightgrey" }}>
            {rating.score >= 5 ? (
              <Col style={{ color: "green" }}>{rating.score}</Col>
            ) : (
              <Col style={{ color: "red" }}>{rating.score}</Col>
            )}
            <Col>{rating.text}</Col>
          </Row>
        );
      }
    });
    return (
      <div>
        <Navbar />
        <h1>Ratings</h1>
        <Container>
          <Col>{ratings}</Col>
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

export default withRouter(connect(mapStateToProps, {})(AllLandlordRatings));
