import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

import { client } from '../../api/client';

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = notificationsAdapter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { getState }) => {
  const allNotifications = selectNotificationsAllNotifications(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification ? latestNotification.date : '';
  const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`);
  return response.data;
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true;
      });
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        Object.values(state.entities).forEach((notification) => {
          notification.read = true;
        });
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newNotifications = action.payload.map((notification) => {
          notification.read = false;
          return notification;
        });
        notificationsAdapter.upsertMany(state, newNotifications);
        // Sort with newest first
        Object.values(state.entities).sort((a, b) => b.date.localeCompare(a.date));
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error;
      });
  },
});

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const { selectAll: selectNotificationsAllNotifications } = notificationsAdapter.getSelectors(
  (state) => state.notifications,
);

export const selectNotificationsStatus = (state) => state.notifications.status;

export const selectNotificationsMessageError = (state) => {
  if (state.notifications.error === null) {
    return null;
  }
  return state.notifications.error.message;
};
