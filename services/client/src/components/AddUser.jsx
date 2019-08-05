import React from 'react';
import PropTypes from 'prop-types';


const AddUser = (props) => {
  return (
    <form onSubmit={(event) => props.addUser(event)}>
      <div className="field">
        <label
          className="label is-large"
          htmlFor="input-username"
        >Username</label>
        <input
          name="username"
          id="input-username"
          className="input is-large"
          type="text"
          placeholder="Enter a username"
          required
          value={props.username}
          onChange={props.handleChange}
        />
      </div>
      <div className="field">
        <label
          className="label is-large"
          htmlFor="input-email"
        >Email</label>
        <input
          name="email"
          id="input-email"
          className="input is-large"
          type="email"
          placeholder="Enter an email address"
          required
          value={props.email}
          onChange={props.handleChange}
        />
      </div>
      <input
        type="submit"
        className="button is-primary is-large is-fullwidth"
        value="Submit"
      />
    </form>
  )
};

AddUser.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
};

export default AddUser;
