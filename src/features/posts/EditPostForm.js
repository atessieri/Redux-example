import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPostById, useEditPostMutation } from './postsSlice';
import { Spinner } from '../../components/Spinner';

export const EditPostForm = ({ match }) => {
  const { postId } = match.params;
  const post = useSelector((state) => selectPostById(state, postId));
  const [updatePost, { isLoading }] = useEditPostMutation();

  const [title, setTitle] = useState(post?.title ?? '');
  const [content, setContent] = useState(post?.content ?? '');

  const history = useHistory();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const canSave = [title, content].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      await updatePost({ id: postId, title, content });
      history.push(`/posts/${postId}`);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor='postContent'>Content:</label>
        <textarea id='postContent' name='postContent' value={content} onChange={onContentChanged} />
        <button type='button' onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
        {isLoading && <Spinner text='Saving...' />}
      </form>
    </section>
  );
};
