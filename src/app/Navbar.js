import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchNotificationsWebsocket,
  selectNotificationsMetadata,
  useGetNotificationsQuery,
  allNotificationsRead,
} from '../features/notifications/notificationsSlice';

export const Navbar = () => {
  const dispatch = useDispatch();

  // Trigger initial fetch of notifications and keep the websocket open to receive updates
  useGetNotificationsQuery();

  const notificationsMetadata = useSelector(selectNotificationsMetadata);
  const numUnreadNotifications = notificationsMetadata.reduce(
    (previousValue, item) => (!item.read ? previousValue + 1 : previousValue),
    0,
  );

  const fetchNewNotifications = () => {
    dispatch(fetchNotificationsWebsocket());
  };

  const notificationsAllRead = () => {
    dispatch(allNotificationsRead());
  };

  let unreadNotificationsBadge;

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = <span className='badge'>{numUnreadNotifications}</span>;
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className='navContent'>
          <div className='navLinks'>
            <Link to='/'>Posts</Link>
            <Link to='/users'>Users</Link>
            <Link to='/notifications'>Notifications {unreadNotificationsBadge}</Link>
          </div>
          <button className='button' onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
          <button className='button' onClick={notificationsAllRead}>
            All Notifications Read
          </button>
        </div>
      </section>
    </nav>
  );
};
