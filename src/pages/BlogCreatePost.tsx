import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { supabase } from '../supabaseClient'
import Header from '../components/Header'

function BlogCreatePost() {
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!user) {
      alert('You must be logged in to create a post')
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

        // Use data.path (not data.fullPath) for getPublicUrl
        const { data: publicUrlData } = supabase.storage
          .from('blog-images')
          .getPublicUrl(data.path)

        uploadedImageUrl = publicUrlData.publicUrl
      }

      const { error: insertError } = await supabase
        .from('blogs')
        .insert([
          {
            title,
            content,
            image_url: uploadedImageUrl,
            user_id: user.id,
            user_email: user.email,
          },
        ])

      if (insertError) {
        alert('Failed to create post')
        setIsSubmitting(false)
        return
      }

      navigate('/blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Create Post</h1>

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

          <div>
            <label className="block text-sm font-medium text-slate-100 mb-2">
              Image (Optional)
            </label>
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
            <div className="rounded-md overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/blog')}
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

export default BlogCreatePost
