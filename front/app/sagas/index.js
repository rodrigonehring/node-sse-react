import { call, put, takeEvery, takeLatest, fork } from 'redux-saga/effects'


function* enableSse(e) {
  const source = new EventSource('/sse/all')
  source.onmessage = function* (e) {
    const data = JSON.parse(e.data)

    if (data.event === 'user_connection') {
      yield put({ type: 'olar' })
      console.log(event)
    }
  }
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {



  yield fork(enableSse)


  // enableSse('/sse/all', res => yield put(res))

   // try {
   //    const user = yield call(Api.fetchUser, action.payload.userId)
   //    yield put({type: "USER_FETCH_SUCCEEDED", user: user})
   // } catch (e) {
   //    yield put({type: "USER_FETCH_FAILED", message: e.message})
   // }
}

/*
  Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
  Allows concurrent fetches of user.
*/
// function* mySaga() {
//   yield takeEvery("USER_FETCH_REQUESTED", fetchUser)
// }

/*
  Alternatively you may use takeLatest.

  Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
  dispatched while a fetch is already pending, that pending fetch is cancelled
  and only the latest one will be run.
*/
function* mySaga() {
  yield takeLatest('sse/all', fetchUser)
}

export default mySaga
