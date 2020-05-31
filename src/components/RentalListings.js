import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Col, Card, CardHeader, CardBody, CardFooter, Button, Row } from "reactstrap";
import Navbar from "./Navbar";
import axios from "axios";
import { apiCall } from "../services/api";

// const BASE_URL = "https://landlord-app-backend.herokuapp.com/api"
const BASE_URL = "http://localhost:9090/api";
class RentalListings extends React.Component {
  state = {
    units: [],
  };
  async componentDidMount() {
    console.log("requesting properties");
    const {
      data: { units },
    } = await axios.get(BASE_URL + "/listings");
    this.setState({ units });
    const newUnits = this.state.units.map(async (unit) => {
      let landlord_score = await apiCall("get", `/api/rating/${unit.owner_id}/score`);
      return { ...unit, landlord_score: landlord_score.avg_score };
    });
    Promise.all(newUnits).then((values) => {
      this.setState({ units: values });
      console.log(this.state.units);
    });
  }

  leaseProperty = (e, unitId) => {
    e.preventDefault();
    this.props.history.push(`/lease/new/${unitId}`);
  };

  render() {
    return (
      <div>
        <Navbar />
        <Container style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Row>
            {this.state.units && (
              <Col>
                <h1 style={{ marginTop: 32 }}>All Rental Listings</h1>

                {this.state.units.map((unit) => {
                  if (unit.owner_id != this.props.currentUser.user.userId) {
                    return (
                      <Row>
                        <Card style={{ marginTop: 30, minWidth: 450 }}>
                          <CardHeader>
                            <Col>
                              {" "}
                              <Row>
                                {unit.address} in {unit.city}
                              </Row>
                              <Row> Landlord's Average Score: {unit.landlord_score}</Row>
                            </Col>
                          </CardHeader>
                          <CardBody>
                            <h2>Unit Number: {unit.unit_number}</h2>
                            <h5>Monthly Price: {unit.market_price}</h5>
                          </CardBody>
                          <CardFooter>
                            <Button
                              onClick={(e) => this.props.history.push(`/ratings/${unit.owner_id}`)}
                              color="primary"
                            >
                              See landlord's ratings
                            </Button>
                            <Button onClick={(e) => this.leaseProperty(e, unit.unit_id)} color="success">
                              Lease This Unit
                            </Button>
                          </CardFooter>
                        </Card>
                      </Row>
                    );
                  }
                })}
              </Col>
            )}
          </Row>
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

export default withRouter(connect(mapStateToProps, {})(RentalListings));
