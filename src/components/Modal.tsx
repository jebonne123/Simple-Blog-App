import React from 'react'

interface ModalProps {
  children: React.ReactNode
  title: string
  onClose?: () => void
}

function Modal({ children, title, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        )}

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}

export default Modal
