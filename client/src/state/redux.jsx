import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: []
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        //state for changing the theme
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        //state to login the user via the token
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        //state to logout the user and reset the state to null
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        //set the friends to local state to keep info
        setFriends: (state, action) => {
            //if friends found then show them to user
            if (state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error('No friends to show');
            }
        },
        //show the posts in the feed
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        //set a post by the user
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) return action.payload.post;
                return post;
            });
            state.posts = updatedPosts;
        },
    },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;