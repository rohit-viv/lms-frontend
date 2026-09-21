'use client';

import { useEffect } from 'react';

import {
  connectSocket,
  socket,
} from '@/services/socket';

import {
  useAppDispatch,
  useAppSelector,
} from '@/store/hooks';

import {
  addNotification,
} from '@/store/features/notifications/notificationSlice';

type RealtimeNotification = {
  id?: string;
  _id?: string;
  title?: string;
  message?: string;
  description?: string;
  type?: string;
  createdAt?: string;
  isRead?: boolean;
};

export default function NotificationSocket() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(
    (state) => state.auth.accessToken,
  );

  useEffect(() => {
    if (!accessToken) {
      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }

    connectSocket(accessToken);

    const handleNotification = (
      data: RealtimeNotification,
    ) => {

      dispatch(
        addNotification({
          id: data.id || data._id,
          title:
            data.title || 'New Notification',
          message:
            data.message ||
            data.description ||
            'You have a new notification',
          type: data.type,
          createdAt:
            data.createdAt ||
            new Date().toISOString(),
          isRead: data.isRead ?? false,
        }),
      );
    };

    socket.on(
      'notification',
      handleNotification,
    );

    return () => {
      socket.off(
        'notification',
        handleNotification,
      );
    };
  }, [accessToken, dispatch]);

  return null;
}
