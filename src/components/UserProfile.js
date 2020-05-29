import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { apiCall } from "../services/api";
import { logout } from "../store/actions/auth";
import Navbar from "./Navbar";
import { Container, Row, Col, Button, Card, CardBody, CardHeader, CardFooter } from "reactstrap";
import dateFormat from "dateformat";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      transactionHistory: [],
      balance: 0,
      properties: [],
      lease: {},
      delta: 0,
    };
  }
  async componentDidMount() {
    let userData = await apiCall("get", `/api/users/${this.props.currentUser.user.userId}`);
    let transactionData = await apiCall("get", `/api/user/${this.props.currentUser.user.userId}/transaction`);
    let balanceData = await apiCall("get", `/api/user/${this.props.currentUser.user.userId}/balance`);
    console.log("b", balanceData);
    let leaseData = await apiCall("get", `/api/lease/${this.props.currentUser.user.userId}`);
    this.setState({
      userInfo: userData.user,
      transactionHistory: transactionData.transactions,
      lease: leaseData.lease,
      balance: balanceData.balance,
    });

    let propertiesData = await apiCall("get", `/api/property/landlord/${this.props.currentUser.user.userId}`);
    let unitsAdded = await propertiesData.properties.map(async (property) => {
      let unitData = await apiCall("get", `/api/property/${property.property_id}/unit`);
      return { ...property, units: unitData.units };
    });
    Promise.all(unitsAdded).then((values) => {
      this.setState({ properties: values });
    });
    console.log("State:", this.state);
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

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

  addBalance = async (e) => {
    e.preventDefault();
    console.log("b add:", this.state.delta);
    let data = { delta: this.state.delta, description: `Added ${this.state.delta} to account balance` };
    await apiCall("post", `/api/user/${this.props.currentUser.user.userId}/balance`, data);
    window.location.reload();
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
            <Button color="primary" onClick={() => this.props.history.push(`/listings/${property.property_id}`)}>
              Edit
            </Button>
            <Button color="danger" onClick={() => this.deleteProperty(property.property_id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      );
    });

    let transactions = this.state.transactionHistory.map((transaction, index) => {
      if (index % 2 == 1) {
        return (
          <Row>
            {transaction.delta >= 0 ? (
              <Col style={{ color: "green" }}>{transaction.delta}</Col>
            ) : (
              <Col style={{ color: "red" }}>{transaction.delta}</Col>
            )}
            <Col>{dateFormat(transaction.date)}</Col>
            <Col>{transaction.description}</Col>
          </Row>
        );
      } else {
        return (
          <Row style={{ backgroundColor: "lightgrey" }}>
            {transaction.delta >= 0 ? (
              <Col style={{ color: "green" }}>{transaction.delta}</Col>
            ) : (
              <Col style={{ color: "red" }}>{transaction.delta}</Col>
            )}
            <Col>{dateFormat(transaction.date)}</Col>
            <Col>{transaction.description}</Col>
          </Row>
        );
      }
    });
    return (
      <div>
        <Navbar />
        <Container style={{ marginTop: 64 }}>
          <Col>
            <Row style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h1>Account</h1>
            </Row>
            <Row>
              <h1>
                Username: <em>{this.state.userInfo.username}</em>
              </h1>
            </Row>
            <Row>
              <h1>
                Balance: $<em>{this.state.balance}</em>
              </h1>
            </Row>
            <Row>
              <form onSubmit={this.addBalance}>
                <input
                  type="number"
                  placeholder="0"
                  name="delta"
                  id="delta"
                  value={this.state.delta}
                  onChange={(e) => this.handleChange(e)}
                />
                <Button color="primary" type="submit">
                  Add to balance
                </Button>
              </form>
            </Row>

            <Row style={{ marginTop: 64 }}>
              <Col>
                <Row>
                  {this.props.currentUser.user.is_landlord == 1 && (
                    <div>
                      <h1>Properties</h1>
                      <ul>{properties}</ul>
                    </div>
                  )}
                </Row>
              </Col>

              <Col>
                <Row>
                  {this.props.currentUser.user.is_tenant == 1 && this.state.lease && (
                    <Card style={{ marginTop: 30, minWidth: 450 }}>
                      <CardHeader>Current lease</CardHeader>
                      <Col>
                        <Row>
                          Starts {dateFormat(this.state.lease.start_date, "shortDate")}, ends{" "}
                          {dateFormat(this.state.lease.end_date, "shortDate")}
                        </Row>
                        <Row>Costs {this.state.lease.price_monthly} per month</Row>
                      </Col>
                      <CardFooter>
                        <Button
                          color="primary"
                          onClick={() => this.props.history.push(`/rating/${this.state.lease.owner_id}`)}
                        >
                          Rate landlord
                        </Button>
                        <Button color="danger" onClick={this.terminateLease}>
                          Terminate lease
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </Row>
                <Row>
                  {this.state.transactionHistory.length > 0 && (
                    <Col>
                      <h1>Trasaction History</h1>
                      {transactions}
                    </Col>
                  )}
                </Row>
                <Row>
                  <Button color="danger" onClick={this.deleteUser}>
                    Delete Account
                  </Button>
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
