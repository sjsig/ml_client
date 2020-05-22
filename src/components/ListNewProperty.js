import React from 'react'
import { Container, Button, Form, FormGroup, Label, Input, FormText, Row, Col } from 'reactstrap';
import Navbar from "./Navbar";

export default class ListNewProperty extends React.Component {
    state = {
        address : "",
        city : "",
        units : [ {
            price_monthly : 0.0,
            unit_number : ""
        }]
    }

    addUnit = () => {
        const { units } = this.state
        units.push({
            price_monthly : 0.0,
            unit_number : ""
        })
        this.setState({units})
    }
    render() {
        return(
            <div>
                <Navbar/>
                <Container>
                <Col>
                <Row style={{ marginTop: 32, marginBottom :  32}}>
                    <h1>List Your Property</h1>
                </Row>
                <Row>

                <Form>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input type="address" name="address" id="address" placeholder="123 Main Street" />
            </FormGroup>
            <FormGroup>
              <Label for="city">City</Label>
              <Input type="city" name="city" id="city" placeholder="City, State, Zip" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleSelect">Unit(s)</Label>
              <div>
                  {this.state.units.map(unit => (
                      <Row>
                      <Col>
                      <Label for="unit_number">Unit Number</Label>
                      <Input type="text" name="unit_number" id="unit_number" />
                      </Col>
                      <Col>
                      <Label for="monthly_price">Monthly Price</Label>
                      <Input type="price" name="monthly_price" id="monthly_price"  />
                      </Col>
                      <Button style={{ marginTop: 30, marginBottom: 10}} onClick={this.addUnit}>Add Unit</Button>
                  </Row>
                  ))
                  }
              </div>
              </FormGroup>
        
            <Button>Submit</Button>
          </Form>
        
                    
                
                </Row>
                </Col></Container>
            </div>)
    }
}