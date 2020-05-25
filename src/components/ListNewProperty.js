import React from "react";
import { Container, Button, Form, FormGroup, Label, Input, FormText, Row, Col } from "reactstrap";
import Navbar from "./Navbar";
import { apiCall } from "../services/api";
import { withRouter } from "react-router-dom";

class ListNewProperty extends React.Component {
  state = {
    address: "",
    city: "",
    units: [
      {
        price_monthly: 0.0,
        unit_number: "",
        unit_id: 1,
      },
    ],
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleUnitChange = (e, attribute, unitId) => {
    console.log("Handling change for attr:", attribute, "for unit", unitId, "with value", e.target.value);
    let val = e.target.value;
    this.setState((prevState) => {
      let updatedUnits = prevState.units.map((unit) => {
        if (unit.unit_id == unitId) {
          //   console.log("new unit:", { ...unit, [attribute]: e.target.value });
          return { ...unit, [attribute]: val };
        } else {
          return unit;
        }
      });
      return { ...prevState, units: updatedUnits };
    });
  };
  addUnit = () => {
    const { units } = this.state;
    units.push({
      price_monthly: 0.0,
      unit_number: "",
      unit_id: this.state.units[this.state.units.length - 1].unit_id + 1,
    });
    this.setState({ units });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    let propertyInfo = { address: this.state.address, city: this.state.city };
    console.log("Property info:", propertyInfo);
    let propertyResponse = await apiCall("post", `/api/property`, propertyInfo);
    this.state.units.forEach(async (unit) => {
      await apiCall("post", `/api/property/${propertyResponse.propertyId}/unit`, {
        market_price: unit.price_monthly,
        unit_number: unit.unit_number,
      });
    });
    this.props.history.push("/listings");
  };
  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Col>
            <Row style={{ marginTop: 32, marginBottom: 32 }}>
              <h1>List Your Property</h1>
            </Row>
            <Row>
              <Form onSubmit={this.onSubmit}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    type="address"
                    name="address"
                    id="address"
                    placeholder="123 Main Street"
                    value={this.state.address}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="city">City</Label>
                  <Input
                    type="city"
                    name="city"
                    id="city"
                    placeholder="City, State, Zip"
                    value={this.state.city}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">Unit(s)</Label>
                  <div>
                    {this.state.units.map((unit) => (
                      <Row>
                        <Col>
                          <Label for="unit_number">Unit Number</Label>
                          <Input
                            type="text"
                            name="unit_number"
                            id="unit_number"
                            value={unit.unit_number}
                            onChange={(e) => this.handleUnitChange(e, "unit_number", unit.unit_id)}
                          />
                        </Col>
                        <Col>
                          <Label for="price_monthly">Monthly Price</Label>
                          <Input
                            type="price"
                            name="price_monthly"
                            id="price_monthly"
                            value={unit.price_monthly}
                            onChange={(e) => this.handleUnitChange(e, "price_monthly", unit.unit_id)}
                          />
                        </Col>
                        <Button style={{ marginTop: 30, marginBottom: 10 }} onClick={this.addUnit}>
                          Add Unit
                        </Button>
                      </Row>
                    ))}
                  </div>
                </FormGroup>

                <Button type="submit">Submit</Button>
              </Form>
            </Row>
          </Col>
        </Container>
      </div>
    );
  }
}

export default withRouter(ListNewProperty);
