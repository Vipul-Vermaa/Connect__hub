import { createAction, createReducer ,PayloadAction} from '@reduxjs/toolkit'

export const loginRequest = createAction('loginRequest')
export const loginSuccess = createAction<{users:User[],message:string}>('loginSuccess')
export const loginFail = createAction<string>('loginFail')

export const registerRequest = createAction('registerRequest')
export const registerSuccess = createAction<{ users: User[], message: string }>('registerSuccess')
export const registerFail = createAction<string>('registerFail')

export const loadUserRequest = createAction('loadUserRequest')
export const loadUserSuccess = createAction<{ users: User[] }>('loadUserSuccess')
export const loadUserFail = createAction<string>('loadUserFail')

export const logoutRequest = createAction('logoutRequest')
export const logoutSuccess = createAction<{ message: string }>('logoutSuccess')
export const logoutFail = createAction<string>('logoutFail')

export const allUserRequest=createAction('allUserRequest')
export const allUserSuccess=createAction<{ users: User[] }>('allUserSuccess')
export const allUserFail=createAction<string>('allUserFail')

export const followAndUnfollowUserRequest = createAction('followAndUnfollowUserRequest')
export const followAndUnfollowUserSuccess = createAction<{ message: string }>('followAndUnfollowUserSuccess')
export const followAndUnfollowUserFail = createAction<string>('followAndUnfollowUserFail')




export const getMyProfileRequest = createAction('getMyProfileRequest')
export const getMyProfileSuccess = createAction<{ message: string }>('getMyProfileSuccess')
export const getMyProfileFail = createAction<string>('getMyProfileFail')

export const userProfileRequest = createAction('userProfileRequest')
export const userProfileSuccess = createAction<{ message: string }>('userProfileSuccess')
export const userProfileFail = createAction<string>('userProfileFail')

export const updateProfileRequest = createAction('updateProfileRequest')
export const updateProfileSuccess = createAction<{ message: string }>('updateProfileSuccess')
export const updateProfileFail = createAction<string>('updateProfileFail')

export const changePasswordRequest = createAction('changePasswordRequest')
export const changePasswordSuccess = createAction<{ message: string }>('changePasswordSuccess')
export const changePasswordFail = createAction<string>('changePasswordFail')







export const clearError = createAction('clearError');
export const clearMessage = createAction('clearMessage');

export interface User{
    _id:string;
    name?:string;
    email?:string;
    password?:string;
    avatar?:{url:string} | File
    followers?:string[];
    following?:string[];
}

interface AuthState{
    loading:boolean;
    isAuthenticated:boolean;
    users:User[] 
    message:string | null
    error:string | null;
}
interface ProfileState{
    loading:boolean;
    message:string | null;
    error:string | null
}

const initialUserState:AuthState = {
    loading: false,
    isAuthenticated: false,
    users: [],
    message: null,
    error: null,
}

const initialProfileState :ProfileState= {
    loading: false,
    message: null,
    error: null,
}




export const userReducer = createReducer(initialUserState, (builder) => {
    builder
        .addCase(loginRequest, (state) => {
            state.loading = true;
        })
        .addCase(loginSuccess, (state, action:PayloadAction<{users:User[],message:string}>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.users = action.payload.users;
            state.message = action.payload.message;
        })
        .addCase(loginFail, (state, action:PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload
        })


        .addCase(registerRequest, (state) => {
            state.loading = true;
        })
        .addCase(registerSuccess, (state, action:PayloadAction<{ users: User[], message: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.users = action.payload.users;
            state.message = action.payload.message;
        })
        .addCase(registerFail, (state, action:PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload
        })


        .addCase(logoutRequest, (state) => {
            state.loading = true;
        })
        .addCase(logoutSuccess, (state, action:PayloadAction<{ message: string }>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.users = [];
            state.message = action.payload.message
        })
        .addCase(logoutFail, (state, action:PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.error = action.payload
        })


        .addCase(followAndUnfollowUserRequest, state => {
            state.loading = true;
        })
        .addCase(followAndUnfollowUserSuccess, (state, action: PayloadAction<{ message: string }>) => {
            state.loading = false;
            state.message = action.payload.message;
        })
        .addCase(followAndUnfollowUserFail, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload
        })

        .addCase(loadUserRequest, state => {
            state.loading = true;
        })
        .addCase(loadUserSuccess, (state, action: PayloadAction<{ users: User[] }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.users = action.payload.users;
        })
        .addCase(loadUserFail, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        })

        .addCase(allUserRequest,state=>{
            state.loading=true;
        })
        .addCase(allUserSuccess,(state,action: PayloadAction<{ users: User[] }>)=>{
            state.loading=false;
            state.users=action.payload.users;
        })
        .addCase(allUserFail,(state,action: PayloadAction<string>)=>{
            state.loading=false;
            state.error=action.payload;
        })



        .addMatcher(
            (action)=>action.type===clearError.type,state=>{
            state.error=null;
        })
        .addMatcher(
            (action)=>action.type===clearMessage.type,state=>{
            state.message=null
        })

})

export const profileReducer=createReducer(initialProfileState,(builder)=>{
    builder
    .addCase(updateProfileRequest, state => {
        state.loading = true;
    })
    .addCase(updateProfileSuccess, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.message = action.payload.message;
    })
    .addCase(updateProfileFail, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload
    })

    .addCase(changePasswordRequest, state => {
        state.loading = true;
    })
    .addCase(changePasswordSuccess, (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.message = action.payload.message;
    })
    .addCase(changePasswordFail, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload
    })


    
    .addCase(getMyProfileRequest, state => {
        state.loading = true;
    })
    .addCase(getMyProfileSuccess, (state, action:PayloadAction<{message:string}>) => {
        state.loading = false;
        state.message = action.payload.message;
    })
    .addCase(getMyProfileFail, (state, action) => {
        state.loading = false;
        state.error = action.payload
    })

    
    

    
    .addCase(userProfileRequest, state => {
        state.loading = true;
    })
    .addCase(userProfileSuccess, (state, action:PayloadAction<{message:string}>) => {
        state.loading = false;
        state.message = action.payload.message;
    })
    .addCase(userProfileFail, (state, action) => {
        state.loading = false;
        state.error = action.payload
    })



    .addMatcher(
        (action) => action.type === clearError.type, state => {
            state.error = null;
        })
    .addMatcher(
        (action) => action.type === clearMessage.type, state => {
            state.message = null
        })
})

