import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";
import Navbar from "./Navbar";

import {Container, Row, Col, Button } from 'reactstrap'

class NewLease extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyInfo: {},
      unitInfo: {},
      start_date: "",
      end_date: "",
    };
  }
  async componentDidMount() {
    let unitInfo = await apiCall("get", `/api/unit/${this.props.match.params.unit_id}`);
    this.setState({ unitInfo: unitInfo.units });
    console.log(unitInfo);
    const propertyId = unitInfo.units.property_id;
    let propertyInfo = await apiCall("get", `/api/property/${propertyId}`);
    this.setState({ propertyInfo: propertyInfo.property });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  signLease = async (e) => {
    e.preventDefault();
    const { start_date, end_date } = this.state;
    let leaseInfo = {
      price_monthly: this.state.unitInfo.market_price,
      start_date,
      end_date,
    };
    console.log(leaseInfo);
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Col>
          <Row>
        <h3>Property Info</h3>
        </Row>
        <Row>

        <ul>
          <li>Address: {this.state.propertyInfo.address}</li>
          <li>City: {this.state.propertyInfo.city}</li>
        </ul>
        </Row>

        <Row>

        <h3>Unit Info</h3>
        </Row>
        <Row>

        <ul>
          <li>Unit Number: {this.state.unitInfo.unit_number}</li>
          <li>Monthly price: {this.state.unitInfo.market_price}</li>
        </ul>
        </Row>

        <Row>

        <h3>Lease</h3>
        </Row>
        <form onSubmit={this.signLease}>
          <label htmlFor="start_date">Start date:</label>
          <input
            className="form-control"
            id="start_date"
            type="date"
            name="start_date"
            onChange={this.handleChange}
            value={this.state.start_date}
          />

          <label htmlFor="end_date">End date:</label>
          <input
            className="form-control"
            id="end_date"
            type="date"
            name="end_date"
            onChange={this.handleChange}
            value={this.state.end_date}
          />
          <Button type="submit">Sign lease</Button>
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

export default withRouter(connect(mapStateToProps, {})(NewLease));
