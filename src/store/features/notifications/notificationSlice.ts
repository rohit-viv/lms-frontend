import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import api from '@/services/api';

export type Notification = {
  id?: string;
  _id?: string;
  title: string;
  message: string;
  type?: string;
  createdAt?: string;
  isRead?: boolean;
};

type NotificationState = {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
};

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

const getErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error
  ) {
    return (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response?.data?.message;
  }

  return undefined;
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        '/notifications',
      );

      return response.data.data as Notification[];
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to fetch notifications',
      );
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/notifications/${id}/read`,
      );

      return response.data.data as Notification;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error) ||
          'Failed to mark notification as read',
      );
    }
  },
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Notification>,
    ) => {
      const incomingId =
        action.payload._id ||
        action.payload.id;

      state.notifications = [
        action.payload,
        ...state.notifications.filter(
          (notification) =>
            (notification._id ||
              notification.id) !== incomingId,
        ),
      ];
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchNotifications.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addCase(
        fetchNotifications.fulfilled,
        (state, action) => {
          state.loading = false;
          state.notifications =
            action.payload;
        },
      )
      .addCase(
        fetchNotifications.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            (action.payload as string) ||
            'Failed to fetch notifications';
        },
      )
      .addCase(
        markNotificationRead.fulfilled,
        (state, action) => {
          state.notifications =
            state.notifications.map(
              (notification) =>
                (notification._id ||
                  notification.id) ===
                (action.payload._id ||
                  action.payload.id)
                  ? action.payload
                  : notification,
            );
        },
      );
  },
});

export const {
  addNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
