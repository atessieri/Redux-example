import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { Spinner } from '../../components/Spinner';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { useGetPostsQuery, selectAllPosts } from '../posts/postsSlice';
import { useGetUsersQuery } from '../users/usersSlice';

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
  const {
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
    isSuccess: isSuccessPosts,
    isError: isErrorPosts,
    error: errorPosts,
    refetch: refetchPosts,
  } = useGetPostsQuery();
  const {
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
    isSuccess: isSuccessUsers,
    isError: isErrorUsers,
    error: errorUsers,
    refetch: refetchUsers,
  } = useGetUsersQuery();
  const posts = useSelector(selectAllPosts);

  let content;
  if (isLoadingPosts || isLoadingUsers) {
    content = <Spinner text='Loading...' />;
  } else if (isSuccessPosts && isSuccessUsers) {
    const renderedPosts = posts.map((post) => <PostExcerpt key={post.id} post={post} />);

    const containerClassname = classnames('posts-container', {
      disabled: isFetchingPosts || isFetchingUsers,
    });

    content = <div className={containerClassname}>{renderedPosts}</div>;
  } else if (isErrorPosts) {
    content = <div>{errorPosts}</div>;
  } else if (isErrorUsers) {
    content = <div>{errorUsers}</div>;
  }

  return (
    <section className='posts-list'>
      <h2>Posts</h2>
      <button
        onClick={() => {
          refetchPosts();
          refetchUsers();
        }}
      >
        Refetch Posts
      </button>
      {content}
    </section>
  );
};
