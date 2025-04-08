import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

interface TUser  {
    user: object | null,
    token: string | null,
}

const initialState: TUser = {
    user:  null,
    token: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: ({
        setUser: (state, action) => {
            const {user, token} = action.payload
            state.user = user;
            state.token = token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    })
})

export const {setUser, logout} = authSlice.actions

export default authSlice.reducer;
export const currentToken = (state: RootState) => state.auth.token
export const currentUser = (state: RootState) => state.auth.user
