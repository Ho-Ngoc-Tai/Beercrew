export const LOADING_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type LoadingStatus = (typeof LOADING_STATUS)[keyof typeof LOADING_STATUS];
