import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { Spinner } from '../../components/Spinner';

import { useGetPostsQuery } from '../api/apiSlice';

const PostExcerpt = ({ post }) => {
  return (
    <article className='post-excerpt'>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className='post-content'>{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className='button muted-button'>
        View Post
      </Link>
    </article>
  );
};

export const PostsList = () => {
  const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();

  let content;

  if (isLoading) {
    content = <Spinner text='Loading...' />;
  } else if (isSuccess) {
    // Sort posts in reverse chronological order by datetime string
    content = posts.map((postId) => <PostExcerpt key={postId} postId={postId} />);
  } else if (isError) {
    content = <div>{error}</div>;
  }

  return (
    <section className='posts-list'>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
