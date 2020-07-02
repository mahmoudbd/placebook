import React from 'react';

import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import FriendListItem from './FriendListItem';

import './FriendList.css';

const FriendList = (props) => {
  const { isLoading, error, clearError } = useHttpClient();

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      <ul className="friends-list">
        {props.items.map((friend) => {
          return (
            <FriendListItem
              deleteFriend={props.deleteFriend}
              key={friend.userId}
              id={friend.userId}
              name={friend.name}
              image={friend.image}
            />
          );
        })}
      </ul>
    </React.Fragment>
  );
};
export default FriendList;
