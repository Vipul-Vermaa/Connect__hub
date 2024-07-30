import { createAction, createReducer } from '@reduxjs/toolkit'

export const createPostRequest = createAction('createPostRequest')
export const createPostSuccess = createAction<string>('createPostSuccess')
export const createPostFail = createAction<string>('createPostFail')


export const getAllPostRequest = createAction('getAllPostRequest')
export const getAllPostSuccess = createAction<Post[]>('getAllPostSuccess')
export const getAllPostFail = createAction<string>('getAllPostFail')


export const deletePostRequest = createAction('deletePostRequest')
export const deletePostSuccess = createAction<string>('deletePostSuccess')
export const deletePostFail = createAction<string>('deletePostFail')


export const likeAndUnlikePostRequest = createAction('likeAndUnlikePostRequest')
export const likeAndUnlikePostSuccess = createAction<string>('likeAndUnlikePostSuccess')
export const likeAndUnlikePostFail = createAction<string>('likeAndUnlikePostFail')

export const myPostRequest = createAction('myPostRequest')
export const myPostSuccess = createAction<Post[]>('myPostSuccess')
export const myPostFail = createAction<string>('myPostFail')

export const userPostRequest = createAction('userPostRequest')
export const userPostSuccess = createAction<Post[]>('userPostSuccess')
export const userPostFail = createAction<string>('userPostFail')


export const clearError = createAction('clearError')
export const clearMessage = createAction('clearMessage')

export interface Post{
    _id:string;
    description:string;
    postImage?:string;
    userImage?:string;
    owner?:string
}

export interface PostState{
    loading:boolean;
    posts:Post[];
    message:string | null;
    error:string | null
}

const initialState:PostState = {
    loading: false,
    posts: [],
    message: null,
    error: null,
}


export const postReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(createPostRequest, state => {
            state.loading = true;
            
        })
        .addCase(createPostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload
        })
        .addCase(createPostFail, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })


        .addCase(getAllPostRequest, state => {
            state.loading = true;
        })
        .addCase(getAllPostSuccess, (state, action) => {
            state.loading = false;
            state.posts = action.payload
        })
        .addCase(getAllPostFail, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })


        .addCase(likeAndUnlikePostRequest, state => {
            state.loading = true;
        })
        .addCase(likeAndUnlikePostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload
        })
        .addCase(likeAndUnlikePostFail, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })

        .addCase(deletePostRequest, state => {
            state.loading = true;
        })
        .addCase(deletePostSuccess, (state, action) => {
            state.loading = false;
            state.message = action.payload;
        })
        .addCase(deletePostFail, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        .addCase(myPostRequest, state => {
            state.loading = true;
        })
        .addCase(myPostSuccess, (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        })
        .addCase(myPostFail, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })
        
        
        .addCase(userPostRequest, state => {
            state.loading = true;
        })
        .addCase(userPostSuccess, (state, action) => {
            state.loading = false;
            state.posts = action.payload;
        })
        .addCase(userPostFail, (state, action) => {
            state.loading = false;
            state.error = action.payload
        })

        .addMatcher(
            (action) => action.type === clearError.type, state => {
                state.error = null;
            })
        .addMatcher(
            (action) => action.type === clearMessage.type, state => {
                state.message = null;
            }
        )
})