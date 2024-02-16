import { all, fork } from "redux-saga/effects";
import { watchGetProducts } from "../services/sagas";

const rootSaga = function* () {
    yield all([
      fork(watchGetProducts),
      // Other forks
    ]);
  };
  
  export default rootSaga;