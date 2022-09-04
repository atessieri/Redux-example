import React from 'react';
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { useSelector } from 'react-redux';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { useGetPostsQuery, selectPostById } from './postsSlice';
import { useGetUsersQuery } from '../users/usersSlice';
import { Spinner } from '../../components/Spinner';

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params;
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
  const post = useSelector((state) => selectPostById(state, postId));

  let content;
  if (isFetchingPosts || isFetchingUsers) {
    content = <Spinner text='Loading...' />;
  } else if (isSuccessPosts && isSuccessUsers) {
    content = (
      <article className='post'>
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className='post-content'>{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className='button'>
          Edit Post
        </Link>
      </article>
    );
  } else if (isErrorPosts) {
    content = <h2>{errorPosts}</h2>;
  } else if (isErrorUsers) {
    content = <h2>{errorUsers}</h2>;
  }

  return <section>{content}</section>;
};
