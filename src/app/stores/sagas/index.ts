import { all, fork } from "redux-saga/effects";
import financeSaga from "./finance";
import authSaga from "./auth";

export default function* rootSaga() {
  yield all([
    fork(financeSaga),
    fork(authSaga),
  ]);
}
