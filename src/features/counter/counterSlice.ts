import {createSlice, } from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface CounterState { //Type of the state    
    value: number;
}

const initialState: CounterState = { //Initial Value
    value: 5,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment(state) {
            state.value += 1;
        },
        incrementByAmount(state, action: PayloadAction<number>) {
            state.value += action.payload;
        }

    }
});

export const { increment, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;