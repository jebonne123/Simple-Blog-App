import { useEffect, useState, useMemo } from 'react'
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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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

  const totalPages = Math.ceil(blogs.length / itemsPerPage)
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return blogs.slice(startIndex, endIndex)
  }, [blogs, currentPage, itemsPerPage])

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Blog Posts</h1>
          
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2.5 py-1.5 rounded-md text-sm ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                        } cursor-pointer`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-slate-400 px-1 text-sm">...</span>
                  }
                  return null
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>

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
            {paginatedBlogs.map((blog) => (
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
