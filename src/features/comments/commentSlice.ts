import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Comment {
  id: string
  blog_id: string
  content: string | null
  image_url: string | null
  user_id: string
  user_email?: string
  created_at: string
}

const initialState = {
  comments: [] as Comment[],
}

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments(state, action: PayloadAction<Comment[]>) {
      state.comments = action.payload
    },
    addComment(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload)
    },
    deleteComment(state, action: PayloadAction<string>) {
      state.comments = state.comments.filter((comment) => comment.id !== action.payload)
    },
    updateComment(state, action: PayloadAction<Comment>) {
      const index = state.comments.findIndex((comment) => comment.id === action.payload.id)
      if (index !== -1) {
        state.comments[index] = action.payload
      }
    },
  },
})

export const { setComments, addComment, deleteComment, updateComment } = commentSlice.actions
export default commentSlice.reducer
