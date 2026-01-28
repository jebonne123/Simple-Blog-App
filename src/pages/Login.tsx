import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setUser, setError } from '../features/auth/authSlice'

function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const user = useAppSelector((state) => state.auth.user)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        dispatch(setError(error?.message ?? 'Login failed'))
        return
      }

      const user = {
        id: data.user.id,
        email: data.user.email ?? '',
        displayName: '',
        phone: '',
      }

      dispatch(setUser(user))
      navigate('/blog')
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'Unexpected error'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-white">My Simple Blog Site</h1>

        <div className="w-full rounded-xl bg-slate-800 p-8 shadow-lg">
          <div className="mb-6 text-center">
            <p className="mt-1 text-base font-medium text-slate-200">Sign in to your account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-100">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-100">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-200">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-500 bg-slate-900" />
                <span className="text-slate-200">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-200">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
