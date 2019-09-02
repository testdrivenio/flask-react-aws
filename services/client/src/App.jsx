import React, { Component } from "react";
import axios from "axios";
import { Route, Switch } from "react-router-dom";
import Modal from "react-modal";

import UsersList from "./components/UsersList";
import About from "./components/About";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import UserStatus from "./components/UserStatus";
import Message from "./components/Message";
import AddUser from "./components/AddUser";

const modalStyles = {
  content: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    border: 0,
    background: "transparent"
  }
};

Modal.setAppElement(document.getElementById("root"));

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      title: "TestDriven.io",
      messageType: null,
      messageText: null,
      showModal: false
    };
    this.addUser = this.addUser.bind(this);
    this.handleRegisterFormSubmit = this.handleRegisterFormSubmit.bind(this);
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }
  componentDidMount() {
    this.getUsers();
  }
  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => {
        this.setState({ users: res.data.data.users });
      })
      .catch(err => {
        console.log(err);
      });
  }
  addUser(data) {
    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
        this.getUsers();
        this.setState({ username: "", email: "" });
        this.handleCloseModal();
        this.createMessage("success", "User added.");
      })
      .catch(err => {
        console.log(err);
        this.handleCloseModal();
        this.createMessage("danger", "That user already exists.");
      });
  }
  handleRegisterFormSubmit(data) {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then(res => {
        window.localStorage.setItem("authToken", res.data.auth_token);
        setTimeout(
          function() {
            this.getUsers();
            this.createMessage("success", "You have registered successfully.");
          }.bind(this),
          300
        );
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", "That user already exists.");
      });
  }
  handleLoginFormSubmit(data) {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then(res => {
        window.localStorage.setItem("authToken", res.data.auth_token);
        setTimeout(
          function() {
            this.getUsers();

            this.createMessage("success", "You have logged in successfully.");
          }.bind(this),
          300
        );
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", "Incorrect email and/or password.");
      });
  }
  isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
      const options = {
        url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      return axios(options)
        .then(res => {
          return true;
        })
        .catch(err => {
          this.logoutUser();
          return false;
        });
    }
    return false;
  }
  logoutUser() {
    window.localStorage.removeItem("authToken");
    this.forceUpdate();
    this.createMessage("success", "You have logged out.");
  }
  createMessage(type, text) {
    this.setState({
      messageType: type,
      messageText: text
    });
    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  }
  removeMessage() {
    this.setState({
      messageType: null,
      messageText: null
    });
  }
  handleOpenModal() {
    this.setState({ showModal: true });
  }
  handleCloseModal() {
    this.setState({ showModal: false });
  }
  removeUser(user_id) {
    axios
      .delete(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${user_id}`)
      .then(res => {
        this.getUsers();
        this.createMessage("success", "User removed.");
      })
      .catch(err => {
        console.log(err);
        this.createMessage("danger", "Something went wrong.");
      });
  }
  render() {
    return (
      <div>
        <NavBar
          title={this.state.title}
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
        />
        <section className="section">
          <div className="container">
            {this.state.messageType && this.state.messageText && (
              <Message
                messageType={this.state.messageType}
                messageText={this.state.messageText}
                removeMessage={this.removeMessage}
              />
            )}
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
                        <button
                          onClick={this.handleOpenModal}
                          className="button is-primary"
                        >
                          Add User
                        </button>
                        <br />
                        <br />
                        <Modal
                          isOpen={this.state.showModal}
                          style={modalStyles}
                        >
                          <div className="modal is-active">
                            <div className="modal-background" />
                            <div className="modal-card">
                              <header className="modal-card-head">
                                <p className="modal-card-title">Add User</p>
                                <button
                                  className="delete"
                                  aria-label="close"
                                  onClick={this.handleCloseModal}
                                />
                              </header>
                              <section className="modal-card-body">
                                <AddUser addUser={this.addUser} />
                              </section>
                            </div>
                          </div>
                        </Modal>
                        <UsersList
                          users={this.state.users}
                          removeUser={this.removeUser}
                        />
                      </div>
                    )}
                  />
                  <Route exact path="/about" component={About} />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <RegisterForm
                        handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <LoginForm
                        handleLoginFormSubmit={this.handleLoginFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/status"
                    render={() => (
                      <UserStatus isAuthenticated={this.isAuthenticated} />
                    )}
                  />
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
