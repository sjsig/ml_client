import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";
import { logout } from "../store/actions/auth";
import Navbar from "./Navbar";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, CardFooter } from "reactstrap";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: { accountBalance: 0, username: "" },
      transactionHistory: [],
      properties: [],
      lease: {},
    };
  }
  async componentDidMount() {
    let userData = await apiCall("get", `/api/users/${this.props.currentUser.user.userId}`);
    let transactionData = await apiCall("get", `/api/user/${this.props.currentUser.user.userId}/transaction`);
    let leaseData = await apiCall("get", `/api/lease/${this.props.currentUser.user.userId}`);
    this.setState({
      userInfo: userData.user,
      transactionHistory: transactionData.transactions,
      lease: leaseData.lease,
    });

    let propertiesData = await apiCall("get", `/api/property/landlord/${this.props.currentUser.user.userId}`);
    let unitsAdded = await propertiesData.properties.map(async (property) => {
      let unitData = await apiCall("get", `/api/property/${property.property_id}/unit`);
      return { ...property, units: unitData.units };
    });
    Promise.all(unitsAdded).then((values) => {
      this.setState({ properties: values });
    });
  }

  testButton = () => {
    console.log("current state:", this.state);
  };

  deleteUser = () => {
    apiCall("delete", `/api/users/${this.props.currentUser.user.userId}`);
    this.props.logout();
    this.props.history.push("/");
  };

  deleteProperty = (propertyId) => {
    apiCall("delete", `/api/property/${propertyId}`);
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };

  terminateLease = () => {
    apiCall("delete", `/api/unit/${this.state.lease.unit_id}/lease/${this.state.lease.lease_id}`);
    this.props.history.push(`/users/${this.props.currentUser.user.userId}`);
  };
  render() {
    let properties = this.state.properties.map((property) => {
      let unitList = property.units.map((unit) => (
        <CardBody>
          <h2>{unit.is_occupied == 1 ? <em>occupied</em> : <em>unoccupied</em>}</h2>
          <h2>Unit Number: {unit.unit_number}</h2>
          <h5>Monthly Price: {unit.market_price}</h5>
        </CardBody>          
      ));
      
      
      return (
        <Card style={{ marginTop: 30, minWidth: 450 }}>
        <CardHeader>
          {property.address} in {property.city}
        </CardHeader>
        <ul>{unitList}</ul>
        <CardFooter>
            <Button color="primary" onClick={() => this.props.history.push(`/listings/${property.property_id}`)}>Edit</Button>
            <Button color="danger" onClick={() => this.deleteProperty(property.property_id)}>Delete</Button>        
        </CardFooter>
      </Card>
        
     
      );
    });
    return (
      <div>
        <Navbar />
        <Container style={{ marginTop: 64}}>
          <Col>
            <Row style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <h1>Account</h1>
          </Row>
            <Row>
              <h1>
                Username: <em>{this.state.userInfo.username}</em>
              </h1>
            </Row>
            <Row>
            <h1>
              Balance: $<em>{this.state.userInfo.account_balance}</em>
            </h1>
            </Row>
        
        <Row style={{ marginTop: 64}}>
        <Col>
        <Row>
        {this.props.currentUser.user.is_landlord && (
          <div>
            <h1>Properties</h1>
            <ul>{properties}</ul>
          </div>
        )}
        </Row>

        {this.props.currentUser.user.is_tenant && this.state.lease && (
          <Row>
            <h1>Lease</h1>
            <ul>
              <li>
                Starts {this.state.lease.start_date}, ends {this.state.lease.end_date}
              </li>
              <li>Costs {this.state.lease.price_monthly} per month</li>
            </ul>
            <button onClick={this.terminateLease}>Terminate lease</button>
            </Row>
        )}

        </Col>
        
        <Col>
        <Row>
          <Col>
        <h1>Trasaction History</h1>
        <h5>Transaction Count: {this.state.transactionHistory.length}</h5>
        </Col>
        </Row>
        <Row>
        <Button color="danger" onClick={this.deleteUser}>Delete Account</Button>
        <button onClick={this.testButton}>Console.log current state</button>
        </Row>
        </Col>

       </Row>
       
       
       
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

export default withRouter(connect(mapStateToProps, { logout })(UserProfile));
