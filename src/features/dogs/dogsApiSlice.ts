
import { createSlice } from '@reduxjs/toolkit';

interface Breed {
    id: string;
    name: string;
    image: {
        url: string;
    }
};

const dogsSlice = createSlice({
    name: 'dogsApi',
    initialState: {
        breeds: [] as Breed[],
    },
    reducers: {
        setBreeds: (state, action) => {
            state.breeds = action.payload;
        },
    },
    
});

export const { setBreeds } = dogsSlice.actions;
export default dogsSlice.reducer;