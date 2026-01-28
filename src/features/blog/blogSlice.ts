import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Blog {
  id: string
  title: string
  content: string
  image: { url: string };
  user_id: string
  user_email?: string
  date: string
}

const initialState = {
    blogs: [] as Blog[],
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action: PayloadAction<Blog[]>) {
      state.blogs = action.payload
    },
  },
})

export const { setBlogs } = blogSlice.actions
export default blogSlice.reducer