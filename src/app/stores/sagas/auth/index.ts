import { call, put, takeLatest, all } from "redux-saga/effects";
import { get, post } from "@commons/ajax/client";
import {
  NEXT_AUTH_SIGNIN_ENDPOINT,
  NEXT_AUTH_ME_ENDPOINT,
  NEXT_AUTH_SIGNOUT_ENDPOINT,
} from "@routes/next.api";
import {
  loginAction,
  loginSuccess,
  loginFailure,
  getUserInfoAction,
  getUserInfoSuccess,
  getUserInfoFailure,
  logoutAction,
  logoutSuccess,
} from "@stores/reducers/auth";
import { ApiResponse } from "@interfaces/base";
import { UserProfile } from "@interfaces/auth";

function* callApiLogin(action: ReturnType<typeof loginAction>): Generator<any, void, any> {
  try {
    const response: ApiResponse<{ user: UserProfile }> = yield call(
      post,
      NEXT_AUTH_SIGNIN_ENDPOINT,
      action.payload
    );

    if (response?.code === 200 && response?.data?.user) {
      yield put(loginSuccess(response.data.user));
    } else {
      yield put(loginFailure(response?.message || "Đăng nhập không thành công"));
    }
  } catch (error: any) {
    yield put(loginFailure(error?.message || "Lỗi mạng khi đăng nhập"));
  }
}

function* callApiGetUserInfo(): Generator<any, void, any> {
  try {
    const response: ApiResponse<UserProfile> = yield call(get, NEXT_AUTH_ME_ENDPOINT);
    if (response?.code === 200 && response?.data) {
      yield put(getUserInfoSuccess(response.data));
    } else {
      yield put(getUserInfoFailure("Chưa xác thực"));
    }
  } catch (error: any) {
    yield put(getUserInfoFailure(error?.message));
  }
}

function* callApiLogout(): Generator<any, void, any> {
  try {
    yield call(post, NEXT_AUTH_SIGNOUT_ENDPOINT);
  } finally {
    yield put(logoutSuccess());
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  }
}

export default function* authSaga() {
  yield all([
    takeLatest(loginAction.type, callApiLogin),
    takeLatest(getUserInfoAction.type, callApiGetUserInfo),
    takeLatest(logoutAction.type, callApiLogout),
  ]);
}
