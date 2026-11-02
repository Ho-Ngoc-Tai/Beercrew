"use client";

import React, { useEffect, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import { authSelector, getUserInfoAction } from "@stores/reducers/auth";
import { socketService } from "@services/socket-service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(authSelector);

  useEffect(() => {
    // Verify user profile upon mounting
    dispatch(getUserInfoAction());

    // Connect realtime socket
    socketService.initialize();

    return () => {
      // Cleanup on unmount
    };
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      socketService.subscribe(`user:${user.id}`);
      socketService.subscribe("chot-keo:feed");
    }
  }, [user]);

  return <>{children}</>;
}
