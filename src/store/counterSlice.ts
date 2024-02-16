import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { CounterState } from '../model/counter'


const initialState : CounterState = {count:0}

export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        incrementCount:(state)=>{
            state.count += 1
        },
        decrementCount:(state)=>{
            state.count -= 1
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.count += action.payload
          },
    }
});

export const { incrementCount, decrementCount, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer;