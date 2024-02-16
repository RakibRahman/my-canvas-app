import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ShopState,Products } from '../model/shop';


const initialState :ShopState = {products:[]}

export const shopSlice = createSlice({
    name:'shop',
    initialState,
    reducers:{
        getAllProducts:(state,action:PayloadAction<Products[]>)=>{
            state.products = action.payload
        },
    }
});

export const { getAllProducts} = shopSlice.actions
export default shopSlice.reducer;