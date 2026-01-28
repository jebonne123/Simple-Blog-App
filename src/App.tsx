import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAppDispatch } from './app/hooks'
import { setUser, logout } from './features/auth/authSlice'
import { supabase } from './supabaseClient'
import Login from './pages/Login'
import Register from './pages/Register'
import Blog from './pages/Blog'
import CreatePost from './pages/BlogCreatePost'
import BlogMyBlogs from './pages/BlogMyBlogs'
import BlogEdit from './pages/BlogEdit'

function AppContent() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    async function restoreSession() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        dispatch(logout())
        return
      }

      if (session?.user) {
        const user = {
          id: session.user.id,
          email: session.user.email ?? '',
          displayName: (session.user.user_metadata as { full_name?: string } | null)?.full_name ?? null,
          phone: session.user.phone ?? null,
        }
        dispatch(setUser(user))
      } else {
        dispatch(logout())
        navigate('/login')
      }
    }

    restoreSession()
  }, [dispatch, navigate])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/my-blogs" element={<BlogMyBlogs />} />
      <Route path="/edit/:id" element={<BlogEdit />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

