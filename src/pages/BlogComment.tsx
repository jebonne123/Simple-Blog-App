import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setComments, addComment } from '../features/comments/commentSlice'
import { supabase } from '../supabaseClient'
import Header from '../components/Header'

function BlogComment() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { id: blogId } = useParams<{ id: string }>()
  const user = useAppSelector((state) => state.auth.user)
  const allComments = useAppSelector((state) => state.comments.comments)
  const allBlogs = useAppSelector((state) => state.blogs.blogs)

  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [blog, setBlog] = useState<{
    id: string
    title: string
    content: string
    image: { url: string }
    user_id: string
    user_email?: string
    date: string
  } | null>(null)

  const commentsForBlog = allComments.filter((comment) => comment.blog_id === blogId)

  useEffect(() => {
    async function fetchBlogAndComments() {
      if (!blogId) {
        navigate('/blog')
        return
      }

      try {
        setLoading(true)

        // We try to get blog from Redux first otherwise fetch from database
        const blogFromRedux = allBlogs.find((b) => b.id === blogId)
        
        if (blogFromRedux) {
          setBlog(blogFromRedux)
        } else {
          const { data: blogData, error: blogError } = await supabase
            .from('blogs')
            .select('*')
            .eq('id', blogId)
            .single()

          if (blogError || !blogData) {
            alert('Blog post not found')
            navigate('/blog')
            return
          }

          const fetchedBlog = {
            id: blogData.id,
            title: blogData.title,
            content: blogData.content || '',
            image: blogData.image_url ? { url: blogData.image_url } : { url: '' },
            user_id: blogData.user_id,
            user_email: blogData.user_email,
            date: blogData.created_at,
          }
          setBlog(fetchedBlog)
        }

        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .eq('blog_id', blogId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching comments:', error)
          return
        }

        const comments = (data || []).map((comment) => ({
          id: comment.id,
          blog_id: comment.blog_id,
          content: comment.content,
          image_url: comment.image_url,
          user_id: comment.user_id,
          user_email: comment.user_email,
          created_at: comment.created_at,
        }))

        dispatch(setComments(comments))
      } catch (err) {
        console.error('Failed to fetch blog/comments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogAndComments()
  }, [blogId, dispatch, navigate, allBlogs])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!user || !blogId) {
      alert('You must be logged in to comment')
      return
    }

    if (!content.trim() && !imageFile) {
      alert('Please enter a comment or upload an image')
      return
    }

    setIsSubmitting(true)

    try {
      let uploadedImageUrl: string | null = null

      if (imageFile) {
        const fileName = `${user.id}-${Date.now()}-${imageFile.name}`

        const { data, error } = await supabase.storage.from('blog-images').upload(fileName, imageFile)

        if (error || !data) {
          alert(`Failed to upload image: ${error?.message || 'Unknown error'}`)
          setIsSubmitting(false)
          return
        }

        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(data.path)

        uploadedImageUrl = publicUrlData.publicUrl
      }

      const { data: newComment, error: insertError } = await supabase
        .from('comments')
        .insert([
          {
            blog_id: blogId,
            content: content.trim() || null,
            image_url: uploadedImageUrl,
            user_id: user.id,
            user_email: user.email,
          },
        ])
        .select()
        .single()

      if (insertError || !newComment) {
        alert(`Failed to add comment: ${insertError?.message || 'Unknown error'}`)
        setIsSubmitting(false)
        return
      }

      const comment = {
        id: newComment.id,
        blog_id: newComment.blog_id,
        content: newComment.content,
        image_url: newComment.image_url,
        user_id: newComment.user_id,
        user_email: newComment.user_email,
        created_at: newComment.created_at,
      }

      dispatch(addComment(comment))
      setContent('')
      setImageFile(null)
      setImagePreview('')
    } catch (err) {
      alert('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!blog) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center text-slate-400 py-8">Blog post not found</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate('/blog')}
          className="mb-6 text-slate-400 hover:text-white cursor-pointer"
        >
          ← Back to Blog
        </button>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <p className="text-slate-400 text-sm mb-2">
            Posted by: <span className="text-slate-300 font-medium">{blog.user_email || blog.user_id}</span>
          </p>

          <h1 className="text-3xl font-bold text-white mb-3">{blog.title}</h1>

          <p className="text-slate-300 mb-4">{blog.content}</p>

          {blog.image?.url && blog.image.url.trim() !== '' && (
            <div className="rounded-md overflow-hidden mb-4 max-w-2xl">
              <img
                src={blog.image.url}
                alt={blog.title}
                className="w-full h-auto max-h-200 object-contain"
              />
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Comments</h2>

          {loading && (
            <div className="text-center text-slate-400 py-4">Loading comments...</div>
          )}

          {!loading && commentsForBlog.length === 0 && (
            <div className="text-center text-slate-400 py-4 mb-6">No comments yet. Be the first to comment!</div>
          )}

          <div className="space-y-4 mb-6">
            {commentsForBlog.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-900 rounded-lg border border-slate-700 p-4"
              >
                <p className="text-slate-400 text-xs mb-2">
                  User: <span className="text-slate-300 font-medium">{comment.user_email || comment.user_id}</span> • {new Date(comment.created_at).toLocaleString()}
                </p>

                {comment.content && (
                  <p className="text-slate-200 mb-2">{comment.content}</p>
                )}

                {comment.image_url && (
                  <div className="rounded-md overflow-hidden mb-2 max-w-md">
                    <img
                      src={comment.image_url}
                      alt="Comment"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {user ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write a comment..."
                  rows={4}
                  className="w-full rounded-md border border-slate-600 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null
                    setImageFile(file ?? null)
                    if (file) {
                      setImagePreview(URL.createObjectURL(file))
                    } else {
                      setImagePreview('')
                    }
                  }}
                  className="block w-full text-sm text-slate-100 file:mr-4 file:rounded-md file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-100 hover:file:bg-slate-600 cursor-pointer"
                />
              </div>

              {imagePreview && (
                <div className="rounded-md overflow-hidden max-w-xs">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="text-slate-400">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Log in
              </button>
              {' '}to post a comment
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default BlogComment
