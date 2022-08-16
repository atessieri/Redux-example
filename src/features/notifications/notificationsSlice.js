import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { client } from "../../api/client";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    const allNotifications = selectNotificationsAllNotifications(getState());
    const [latestNotification] = allNotifications;
    const latestTimestamp = latestNotification ? latestNotification.date : "";
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    );
    return response.data;
  }
);

const initialState = {
  data: [],
  status: "idle",
  error: null
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    allNotificationsRead(state) {
      state.data.forEach((notification) => {
        notification.read = true;
      });
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.data.forEach((item) => (item.read = true));
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        action.payload.forEach((item) =>
          state.data.push({
            ...item,
            read: false
          })
        );
        // Sort with newest first
        state.data.sort((a, b) => b.date.localeCompare(a.date));
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  }
});

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const selectNotificationsAllNotifications = (state) =>
  state.notifications.data;

export const selectNotificationsStatus = (state) => state.notifications.status;

export const selectNotificationsMessageError = (state) => {
  if (state.notifications.error === null) {
    return null;
  }
  return state.notifications.error.message;
};
