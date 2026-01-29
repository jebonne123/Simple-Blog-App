import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setBlogs } from '../features/blog/blogSlice'
import Header from '../components/Header'

interface Blog {
  id: string
  title: string
  content: string
  image: { url: string }
  user_id: string
  user_email?: string
  date: string
}

function Blog() {
  const dispatch = useAppDispatch()
  const blogs = useAppSelector((state) => state.blogs.blogs)
  const comments = useAppSelector((state) => state.comments.comments)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          setError(error.message)
          return
        }

        const transformedBlogs: Blog[] = (data || []).map((blog) => ({
          id: blog.id,
          title: blog.title,
          content: blog.content || '',
          image: blog.image_url ? { url: blog.image_url } : { url: '' },
          user_id: blog.user_id,
          user_email: blog.user_email || blog.user_id,
          date: blog.created_at,
        }))

        dispatch(setBlogs(transformedBlogs))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Blog Posts</h1>

        {loading && (
          <div className="text-center text-slate-400 py-8">Loading blogs...</div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200 mb-4">
            Error: {error}
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center text-slate-400 py-8">No blog posts yet.</div>
        )}

        <div className="space-y-6">
            {blogs.map((blog) => (
                <div
                key={blog.id}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6"
                >
                    <p className="text-slate-400 text-sm mb-2">
                        Posted by: <span className="text-slate-300 font-medium">{blog.user_email || blog.user_id}</span>
                    </p>

                    <h2 className="text-2xl font-bold text-white mb-3">
                        {blog.title}
                    </h2>

                    <p className="text-slate-300 mb-4">
                        {blog.content}
                    </p>

                    {blog.image?.url && blog.image.url.trim() !== '' && (
                        <div className="rounded-md overflow-hidden mb-4 max-w-2xl mx-auto">
                        <img
                            src={blog.image.url}
                            alt={blog.title}
                            className="w-full h-auto max-h-200 object-contain"
                        />
                        </div>
                    )}

                    <Link
                      to={`/blog/${blog.id}/comments`}
                      className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>
                        {comments.filter((c) => c.blog_id === blog.id).length} Comment
                        {comments.filter((c) => c.blog_id === blog.id).length !== 1 ? 's' : ''}
                      </span>
                    </Link>
                </div>
            ))}
        </div>
      </main>
    </div>
  )
}

export default Blog
