import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './counterSlice'
import shopSlice from './shopSlice'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga';



const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    shop:shopSlice
  },
  middleware:(getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

sagaMiddleware.run(rootSaga)

