import React from "react";
import { Container, Button, Form, FormGroup, Label, Input, FormText, Row, Col } from "reactstrap";
import Navbar from "./Navbar";
import { apiCall } from "../services/api";
import { withRouter } from "react-router-dom";

class ListNewProperty extends React.Component {
  state = {
    address: "",
    city: "",
    units: [],
  };
  async componentDidMount() {
    let propertyInfo = await apiCall("get", `/api/property/${this.props.match.params.property_id}`);
    this.setState({ address: propertyInfo.property.address, city: propertyInfo.property.city });
    let unitInfo = await apiCall("get", `/api/property/${this.props.match.params.property_id}/unit`);
    let units = unitInfo.units.map((unit) => ({ ...unit, existed: 1 }));
    this.setState({ units });
    console.log("State:", this.state);
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleUnitChange = (e, attribute, unitId) => {
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
      existed: 0,
      price_monthly: 0.0,
      unit_number: "",
      //   unit_id: this.state.units[this.state.units.length - 1].unit_id + 1,
    });
    this.setState({ units });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    let propertyInfo = { address: this.state.address, city: this.state.city };
    console.log("Property info:", propertyInfo);
    let propertyResponse = await apiCall("put", `/api/property/${this.props.match.params.property_id}`, propertyInfo);
    this.state.units.forEach(async (unit) => {
      if (unit.existed == 1) {
        await apiCall("put", `/api/unit/${unit.unit_id}`, {
          market_price: unit.market_price,
          unit_number: unit.unit_number,
        });
      } else {
        //adding a new unit
        await apiCall("post", `/api/property/${this.props.match.params.property_id}/unit`, {
          market_price: unit.market_price,
          unit_number: unit.unit_number,
        });
      }
    });
    this.props.history.push(`/listings`);
  };
  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Col>
            <Row style={{ marginTop: 32, marginBottom: 32 }}>
              <h1>Edit Your Property</h1>
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
                <Button style={{ marginTop: 30, marginBottom: 10 }} onClick={this.addUnit}>
                  Add Unit
                </Button>
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
                          <Label for="market_price">Monthly Price</Label>
                          <Input
                            type="price"
                            name="market_price"
                            id="market_price"
                            value={unit.market_price}
                            onChange={(e) => this.handleUnitChange(e, "market_price", unit.unit_id)}
                          />
                        </Col>
                      </Row>
                    ))}
                  </div>
                </FormGroup>

                <Button type="submit">Edit</Button>
              </Form>
            </Row>
          </Col>
        </Container>
      </div>
    );
  }
}

export default withRouter(ListNewProperty);
