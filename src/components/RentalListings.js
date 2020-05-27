import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Col, Card, CardHeader, CardBody, CardFooter, Button, Row } from "reactstrap";
import Navbar from "./Navbar";
import axios from "axios";

const BASE_URL = "https://landlord-app-backend.herokuapp.com/api"

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
    console.log(this.state.units);
  }

  leaseProperty = (e, unitId) => {
    e.preventDefault();
    this.props.history.push(`/lease/new/${unitId}`);
  };

  render() {
    return (
      <div>
        <Navbar/>
        <Container style={{ display: 'flex', alignItems:'center', justifyContent: 'center' }}>
          <Row>
          {this.state.units && (

            <Col>
                        <h1 style={{ marginTop:  32}}>All Rental Listings</h1>

              {this.state.units.map((unit) => {
                return (
                  <Row>
                    <Card style={{ marginTop: 30, minWidth: 450 }}>
                      <CardHeader>
                        {unit.address} in {unit.city}
                      </CardHeader>
                      <CardBody>
                        <h2>Unit Number: {unit.unit_number}</h2>
                        <h5>Monthly Price: {unit.market_price}</h5>
                      </CardBody>
                      <CardFooter>
                        <Button onClick={(e) => this.leaseProperty(e, unit.unit_id)}>Lease This Property</Button>
                      </CardFooter>
                    </Card>
                  </Row>
                );
              })}
            </Col>
          )}
                        </Row>

        </Container>
      </div>
    );
  }
}

export default withRouter(RentalListings);
