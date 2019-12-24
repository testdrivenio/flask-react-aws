import React, { Component } from "react";
import axios from "axios";
import { Route, Switch } from "react-router-dom";

import UsersList from "./components/UsersList";
import AddUser from "./components/AddUser";
import About from "./components/About";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

class App extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      username: "",
      email: "",
      title: "TestDriven.io" // new
    };

    this.addUser = this.addUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  addUser(event) {
    event.preventDefault();

    const data = {
      username: this.state.username,
      email: this.state.email
    };

    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
        this.getUsers();
        this.setState({ username: "", email: "" });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleChange(event) {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  }

  render() {
    return (
      <div>
        <NavBar title={this.state.title} />
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half">
                <br />
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <div>
                        <h1 className="title is-1">Users</h1>
                        <hr />
                        <br />
                        <AddUser
                          username={this.state.username}
                          email={this.state.email}
                          addUser={this.addUser}
                          // eslint-disable-next-line react/jsx-handler-names
                          handleChange={this.handleChange}
                        />
                        <br />
                        <br />
                        <UsersList users={this.state.users} />
                      </div>
                    )}
                  />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/register" component={RegisterForm} />
                  <Route exact path="/login" component={LoginForm} />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
