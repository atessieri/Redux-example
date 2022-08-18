import React from 'react';
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';

import { Spinner } from '../../components/Spinner';
import { useGetPostQuery } from '../api/apiSlice';

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params;

  const { data: post, isFetching, isSuccess, isError, error } = useGetPostQuery(postId);

  let content;
  if (isFetching) {
    content = <Spinner text='Loading...' />;
  } else if (isSuccess) {
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
  } else if (isError) {
    content = <h2>error</h2>;
  }

  return <section>{content}</section>;
};
