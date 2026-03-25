import {createSlice, type Reducer} from "@reduxjs/toolkit";
import type {IUser} from "../../types/userType.ts";

const initialState: IUser = {
    username: "",
    email: "",
    isAdmin: false,
    id: 0,
    createdAt: new Date()

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
        },
        clearUser(state) {
            state.username = ""
            state.email = ""
            state.isAdmin = false
            state.id = 0
            state.createdAt = new Date()
        }
    },
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer:Reducer = userSlice.reducer;
