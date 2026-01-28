import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  displayName: string | null
  phone: string | null
}

const initialState = {
  users: [] as User[],
  error: null as string | null,
}

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload
      state.error = null
    },
    setError(state, action: PayloadAction<string>) {
        state.error = action.payload
    },
  },
})

export const { setUsers } = userSlice.actions
export default userSlice.reducer