import {configureStore} from '@reduxjs/toolkit'

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { profileReducer, userReducer } from './reducer/userReducer'
import { postReducer } from './reducer/postReducer'

export const store=configureStore({
    reducer:{
        user:userReducer,
        profile:profileReducer,
        post:postReducer,
    }
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch

export const useAppDispatch:()=>typeof store.dispatch=useDispatch
export const useAppSelector:TypedUseSelectorHook<ReturnType<typeof store.getState>>=useSelector
