import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchNotifications,
  selectNotificationsAllNotifications,
  selectNotificationsStatus,
  allNotificationsRead,
} from '../features/notifications/notificationsSlice';

export const Navbar = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotificationsAllNotifications);
  const numUnreadNotifications = notifications.reduce(
    (previousValue, item) => (!item.read ? previousValue + 1 : previousValue),
    0,
  );
  const notificationsStatus = useSelector(selectNotificationsStatus);

  const fetchNewNotifications = () => {
    if (notificationsStatus !== 'loading') {
      dispatch(fetchNotifications());
    }
  };

  const notificationsAllRead = () => {
    if (notificationsStatus !== 'loading') {
      dispatch(allNotificationsRead());
    }
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
