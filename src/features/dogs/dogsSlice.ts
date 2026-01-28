import { createSlice } from '@reduxjs/toolkit';

interface Breed {
    id: string;
    name: string;
    image: { url: string };
}

const initialState = {
    breeds: [] as Breed[],
}

const dogsSlice = createSlice({
    name: 'dogs',
    initialState,
    reducers: {
        setBreeds: (state, action) => {
            state.breeds = action.payload;
        },
    },
});

export const { setBreeds } = dogsSlice.actions;
export default dogsSlice.reducer;
