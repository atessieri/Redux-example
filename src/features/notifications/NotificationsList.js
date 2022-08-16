import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formatDistanceToNow, parseISO } from "date-fns";
import classnames from "classnames";
import { Spinner } from "../../components/Spinner";

import { selectAllUsers } from "../users/usersSlice";

import {
  fetchNotifications,
  selectNotificationsAllNotifications,
  selectNotificationsStatus,
  selectNotificationsMessageError
} from "./notificationsSlice";

export const NotificationsList = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectNotificationsStatus);
  const notifications = useSelector(selectNotificationsAllNotifications);
  const users = useSelector(selectAllUsers);
  const errorMessage = useSelector(selectNotificationsMessageError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotifications());
    }
  }, [status, dispatch]);

  let renderedNotifications;
  if (status === "loading") {
    renderedNotifications = <Spinner text="Loading..." />;
  } else if (status === "succeeded") {
    renderedNotifications = notifications.map((notification) => {
      const date = parseISO(notification.date);
      const timeAgo = formatDistanceToNow(date);
      const user = users.find((user) => user.id === notification.user) || {
        name: "Unknown User"
      };
      const notificationClassname = classnames("notification", {
        new: !notification.read
      });
      return (
        <div key={notification.id} className={notificationClassname}>
          <div>
            <b>{user.name}</b> {notification.message}
          </div>
          <div title={notification.date}>
            <i>{timeAgo} ago</i>
          </div>
        </div>
      );
    });
  } else if (status === "failed") {
    renderedNotifications = <div>{errorMessage}</div>;
  }
  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  );
};
