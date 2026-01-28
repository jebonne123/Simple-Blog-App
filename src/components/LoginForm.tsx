import React, { useState } from 'react'

interface LoginFormData {
  email: string
  password: string
}

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
}

function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Email and password are required')
      return
    }

    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
      console.error(err)
    }
  }

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 transition"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 transition"
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              disabled={isLoading}
              className="w-4 h-4 mr-2 rounded cursor-pointer"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <a href="#" className="text-blue-600 font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {/* Divider */}
      <div className="mt-5 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isLoading}
          className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition text-sm"
        >
          <span className="text-lg">🔵</span>
          <span className="ml-1 text-gray-700 font-semibold">Google</span>
        </button>
        <button
          type="button"
          disabled={isLoading}
          className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition text-sm"
        >
          <span className="text-lg">📘</span>
          <span className="ml-1 text-gray-700 font-semibold">GitHub</span>
        </button>
      </div>
    </>
  )
}

export default LoginForm
