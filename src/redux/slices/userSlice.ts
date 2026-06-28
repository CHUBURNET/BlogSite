import {createSlice, type Reducer} from "@reduxjs/toolkit";
import type {IUser} from "../../types/userType.ts";

const initialState: IUser = {
    username: "",
    email: "",
    isAdmin: false,
    id: 0,
    createdAt: "",
    post_count: "0",
    following_count: "0",
    following: [],

};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser(state, action) {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.isAdmin = action.payload.is_admin;
            state.id = action.payload.id;
            state.createdAt = action.payload.created_at;
            state.post_count = action.payload.post_count;
            state.following_count = action.payload.following_count;
            state.following = action.payload.following;
        },
        clearUser(state) {
            state.username = ""
            state.email = ""
            state.isAdmin = false
            state.id = 0
            state.createdAt = ""
            state.post_count = "0"
            state.following_count = "0"
            state.following = []
        }
    },
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer:Reducer = userSlice.reducer;
