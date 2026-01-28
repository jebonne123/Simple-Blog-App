import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import dogsReducer from "../features/dogs/dogsSlice";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/userSlice";
import blogsReducer from "../features/blog/blogSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        dogs: dogsReducer,
        auth: authReducer,
        users: usersReducer,
        blogs: blogsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;