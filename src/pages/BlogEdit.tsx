import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { updateBlog } from '../features/blog/blogSlice'
import { supabase } from '../supabaseClient'
import Header from '../components/Header'

function BlogEdit() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { id } = useParams<{ id: string }>()
  const user = useAppSelector((state) => state.auth.user)
  const allBlogs = useAppSelector((state) => state.blogs.blogs)
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogToEdit() {
      if (!id) {
        navigate('/my-blogs')
        return
      }

      const blog = allBlogs.find((b) => b.id === id) //only if its still stored in redux
      
      if (blog) {
        setTitle(blog.title)
        setContent(blog.content)
        setImageUrl(blog.image?.url || '')
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !data) {
          alert('Blog post not found')
          navigate('/my-blogs')
          return
        }

        if (user && data.user_id !== user.id) {
          alert('You do not have permission to edit this post')
          navigate('/my-blogs')
          return
        }

        setTitle(data.title)
        setContent(data.content || '')
        setImageUrl(data.image_url || '')
      } catch (err) {
        alert('Failed to load blog post')
        navigate('/my-blogs')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogToEdit()
  }, [id, allBlogs, user, navigate])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!user || !id) {
      alert('You must be logged in to edit a post')
      return
    }

    setIsSubmitting(true)

    try {
      const { error: updateError } = await supabase
        .from('blogs')
        .update({
          title,
          content,
        })
        .eq('id', id)

      if (updateError) {
        alert(`Failed to update post: ${updateError.message}`)
        setIsSubmitting(false)
        return
      }

      const updatedBlog = {
        id,
        title,
        content,
        image: { url: imageUrl },
        user_id: user.id,
        user_email: user.email,
        date: new Date().toISOString(),
      }
      dispatch(updateBlog(updatedBlog))

      navigate('/my-blogs')
    } catch (err) {
      alert('Failed to update blog post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center text-slate-400 py-8">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Edit Post</h1>

        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
              className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              required
              rows={10}
              className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {imageUrl && imageUrl.trim() !== '' && (
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Current Image
              </label>
              <div className="rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Current"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-blogs')}
              className="flex-1 rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default BlogEdit
