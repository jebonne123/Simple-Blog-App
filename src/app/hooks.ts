import { useDispatch, type TypedUseSelectorHook, useSelector } from 'react-redux'
import { type RootState, type AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>(); 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; //useSelector is a function we are aliasing it with useAppSelecture using types

//useAppDispatch to dispatch actions
//useAppSelector to read a state