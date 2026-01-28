import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthUser {
  id: string
  email: string
  displayName: string | null
  phone: string | null
}

type AuthState = { // adding type safety here for the initial state
  user: AuthUser | null
  error: string | null
}

const initialState: AuthState = {
  user: null,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.error = null
    },
    setError(state, action: PayloadAction<string>) {
        state.error = action.payload
    },
    logout(state) {
      state.user = null
    },
  },
})

export const { logout, setUser, setError } = authSlice.actions
export default authSlice.reducer
