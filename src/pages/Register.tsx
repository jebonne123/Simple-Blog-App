import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setUser, setError } from '../features/auth/authSlice'

function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error } = useAppSelector((state) => state.auth)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (password !== confirmPassword) {
      dispatch(setError('Passwords do not match'))
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error || !data.user) {
        dispatch(setError(error?.message ?? 'Registration failed'))
        return
      }

      const user = {
        id: data.user.id,
        email: data.user.email ?? '',
        displayName: '',
        phone: '',
      }

      dispatch(setUser(user))
      navigate('/login')
    } catch (err) {
      
      dispatch(setError(err instanceof Error ? err.message : 'Unexpected error'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-4">

        <div className="w-full rounded-xl bg-slate-800 p-8 shadow-lg">
          <div className="mb-6 text-center">
            <p className="mt-1 text-base font-medium text-slate-200">Create your account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-900/50 border border-red-700 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

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
                required
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
                required
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-100">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
