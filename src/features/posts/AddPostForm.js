import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from '../../components/Spinner';
import { useAddNewPostMutation } from './postsSlice';
import { selectAllUsers, useGetUsersQuery } from '../users/usersSlice';

const AuthorSelect = ({ getUserStatus, users, userId, setUserId }) => {
  const { isFetching, isSuccess, isError, error } = getUserStatus;

  let result;
  if (isFetching) {
    result = (
      <>
        <label>Author:</label>
        <span>Loading...</span>
      </>
    );
  } else if (isSuccess) {
    result = (
      <>
        <label htmlFor='postAuthor'>Author:</label>
        <select id='postAuthor' value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value=''></option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </>
    );
  } else if (isError) {
    result = (
      <>
        <label>Author:</label>
        <span>Error: {error}</span>
      </>
    );
  }

  return result;
};

export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const getUserStatus = useGetUsersQuery();
  const users = useSelector(selectAllUsers);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        await addNewPost({ title, content, user: userId }).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
      } catch (err) {
        console.error('Failed to save the post: ', err);
      }
    }
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChanged}
        />
        <AuthorSelect
          getUserStatus={getUserStatus}
          users={users}
          userId={userId}
          setUserId={setUserId}
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
