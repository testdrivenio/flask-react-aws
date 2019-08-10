import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class UserStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      id: "",
      username: ""
    };
  }
  componentDidMount() {
    this.getUserStatus();
  }
  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    };
    return axios(options)
      .then(res => {
        this.setState({
          email: res.data.data.email,
          id: res.data.data.id,
          username: res.data.data.username
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    if (!this.props.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <ul>
          <li>
            <strong>User ID:</strong>&nbsp;
            <span data-testid="user-id">{this.state.id}</span>
          </li>
          <li>
            <strong>Email:</strong>&nbsp;
            <span data-testid="user-email">{this.state.email}</span>
          </li>
          <li>
            <strong>Username:</strong>&nbsp;
            <span data-testid="user-username">{this.state.username}</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserStatus;
