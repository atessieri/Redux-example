import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetPostsQuery, selectPostByUserId } from '../posts/postsSlice';
import { Spinner } from '../../components/Spinner';
import { selectUserById, useGetUsersQuery } from './usersSlice';

export const UserPage = ({ match }) => {
  const { userId } = match.params;
  const {
    isFetching: isFetchingPosts,
    isSuccess: isSuccessPosts,
    isError: isErrorPosts,
    error: errorPosts,
  } = useGetPostsQuery();
  const {
    isFetching: isFetchingUsers,
    isSuccess: isSuccessUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useGetUsersQuery();
  const user = useSelector((state) => selectUserById(state, userId));
  const postsForUser = useSelector((state) => selectPostByUserId(state, userId));

  let content;
  if (isFetchingPosts || isFetchingUsers) {
    content = <Spinner text='Loading...' />;
  } else if (isSuccessPosts && isSuccessUsers) {
    content = postsForUser.map((post) => (
      <li key={post.id}>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </li>
    ));
  } else if (isErrorPosts) {
    content = <div>{errorPosts}</div>;
  } else if (isErrorUsers) {
    content = <div>{errorUsers}</div>;
  }

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{content}</ul>
    </section>
  );
};
