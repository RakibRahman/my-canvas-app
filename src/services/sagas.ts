import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { Products } from '../model/shop';
import { getAllProducts } from '../store/shopSlice';
import { fetchData } from './api';

// Generator function
function* getProductsSaga({ payload: endpoint }: PayloadAction<string>) {
    try {
      // You can also export the axios call as a function.
      const response:AxiosResponse<Products[]> = yield fetchData(endpoint);
      console.log(response)
      yield put(getAllProducts(response.data));
    } catch (error) {
        console.log('error in saga')
    //   yield put(getUserErrorAction(error));
    }
  }
  
  // Generator function
  export function* watchGetProducts() {
    yield takeLatest('shop', getProductsSaga);
  }


  