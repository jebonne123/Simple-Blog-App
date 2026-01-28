import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice'
import { supabase } from '../supabaseClient'

function Header() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
    } finally {
      dispatch(logout())
      navigate('/login')
    }
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800">
       <div className="w-full px-6 py-3 flex items-center justify-end gap-6">
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/blog"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Home
          </Link>
          <span className="text-slate-600">|</span>
          <Link
            to="/my-blogs"
            className="text-slate-300 hover:text-white transition-colors"
          >
            My Blogs
          </Link>
          <span className="text-slate-600">|</span>
          <Link
            to="/create-post"
            className="text-slate-300 hover:text-white transition-colors"
          >
            Create Post
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:inline text-xs text-slate-400">
              {user.email}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

