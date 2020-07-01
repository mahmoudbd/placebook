import React from 'react';

import UserItem from './UserItem';
import './UsersList.css';

const UsersList = props => {
  return (
    <ul className="user-Friend">
      {props.friendRequest.filter(user => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
