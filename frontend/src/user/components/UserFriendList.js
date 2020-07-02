import React from 'react';

import UserFriend from './UserFriend';
import Card from '../../shared/components/UIElements/Card';
import './UserFriendList.css';

const UserFriends = props => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Friend Found</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="user-friendList">
      {props.UserFriend.map(user => (
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


export default UserFriends;