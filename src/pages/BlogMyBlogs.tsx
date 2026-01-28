import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setBlogs, deleteBlog } from '../features/blog/blogSlice'
import { supabase } from '../supabaseClient'
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

function BlogMyBlogs() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const allBlogs = useAppSelector((state) => state.blogs.blogs)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchBlogs() {

      if (allBlogs.length > 0) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching blogs:', error)
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
        console.error('Failed to fetch blogs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [dispatch, allBlogs.length])

  const myBlogs = useMemo(() => {
    if (!user) return []
    return allBlogs.filter((blog) => blog.user_id === user.id)
  }, [allBlogs, user])

  async function handleDelete(blogId: string, imageUrl?: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId)

      if (deleteError) {
        alert(`Failed to delete blog: ${deleteError.message}`)
        return
      }

      if (imageUrl) {
        const urlParts = imageUrl.split('/')
        const fileName = urlParts[urlParts.length - 1]
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('blog-images')
            .remove([fileName])

          if (storageError) {
            console.error('Failed to delete image:', storageError)
          }
        }
      }

      dispatch(deleteBlog(blogId))
    } catch (err) {
      console.error('Failed to delete blog:', err)
      alert('Failed to delete blog post')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">My Blogs</h1>

        {!user && (
          <div className="text-center text-slate-400 py-8">You must be logged in to view your blogs.</div>
        )}

        {loading && (
          <div className="text-center text-slate-400 py-8">Loading blogs...</div>
        )}

        {!loading && user && myBlogs.length === 0 && (
          <div className="text-center text-slate-400 py-8">You haven't created any blog posts yet.</div>
        )}

        <div className="space-y-6">
          {myBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 relative"
            >
              <div className="absolute top-6 right-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/edit/${blog.id}`)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(blog.id, blog.image?.url)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

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

              <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>24 Comments</span>
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default BlogMyBlogs
