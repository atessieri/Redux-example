import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAllUsers, useGetUsersQuery } from './usersSlice';
import { Spinner } from '../../components/Spinner';

export const UsersList = () => {
  const { isFetching, isSuccess, isError, error } = useGetUsersQuery();
  const users = useSelector(selectAllUsers);

  let content;
  if (isFetching) {
    content = <Spinner text='Loading...' />;
  } else if (isSuccess) {
    content = users.map((user) => (
      <li key={user.id}>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </li>
    ));
  } else if (isError) {
    content = <div>{error}</div>;
  }

  return (
    <section>
      <h2>Users</h2>

      <ul>{content}</ul>
    </section>
  );
};
