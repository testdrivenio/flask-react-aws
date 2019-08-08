import React from "react";
import PropTypes from "prop-types";

const UsersList = props => {
  return (
    <div>
      {props.users.map(user => {
        return (
          <p key={user.id} className="box title is-4 username">
            {user.username}
          </p>
        );
      })}
    </div>
  );
};

UsersList.propTypes = {
  users: PropTypes.array.isRequired
};

export default UsersList;
