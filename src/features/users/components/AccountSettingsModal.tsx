import React, { useRef, useState, useEffect } from 'react'
import { X, Camera, Loader2, Trash2 } from 'lucide-react'
import type { UserProfile } from '../hook/useUserProfile'

interface AccountSettingsModalProps {
    profile: UserProfile
    onClose: () => void
    onUpdate: (data: { username?: string; email?: string }) => Promise<UserProfile>
    onAvatarUpload: (file: File) => Promise<string>
    onDelete: () => Promise<void>
    onLogout: () => void
}

export function AccountSettingsModal({
    profile,
    onClose,
    onUpdate,
    onAvatarUpload,
    onDelete,
    onLogout,
}: AccountSettingsModalProps): React.ReactNode {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [username, setUsername] = useState(profile.username)
    const [email, setEmail] = useState(profile.email)
    const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl ?? '')
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarPreview(URL.createObjectURL(file))
        setIsUploading(true)
        setError(null)
        try {
            await onAvatarUpload(file)
            setSuccess('Avatar updated!')
        } catch {
            setError('Avatar upload failed.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsUpdating(true)
        try {
            await onUpdate({ username, email })
            setSuccess('Profile updated successfully!')
        } catch (err: any) {
            setError(err?.message ?? 'Update failed.')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await onDelete()
            onLogout()
            onClose()
        } catch {
            setError('Failed to delete account.')
            setIsDeleting(false)
        }
    }


    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-[420px] max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Account Settings</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = '/vitalizeLogo/defaultUser.png'
                                        }}
                                    />
                                ) : (
                                    <img
                                        src="/vitalizeLogo/defaultUser.png"
                                        alt="Default Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute bottom-0 right-0 w-7 h-7 bg-green-400 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors shadow-md"
                            >
                                {isUploading ? (
                                    <Loader2 size={13} className="animate-spin" />
                                ) : (
                                    <Camera size={13} />
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>

                        {/* Role badge */}
                        {/* <span className={`mt-2 px-3 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${profile.role === 'admin'
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-green-100 text-green-600'
                            }`}>
                            {profile.role}
                        </span> */}
                    </div>

                    {/* Form */}
                    <form onSubmit={(e) => void handleUpdate(e)}>
                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-400 transition-colors"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-green-400 transition-colors"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Role
                            </label>
                            <input
                                type="text"
                                value={profile.role}
                                disabled
                                className="w-full border border-gray-100 rounded-xl px-3.5 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                            />
                        </div>

                        {error && (
                            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
                                ⚠️ {error}
                            </p>
                        )}
                        {success && (
                            <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-3">
                                ✓ {success}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-green-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUpdating && <Loader2 size={14} className="animate-spin" />}
                            {isUpdating ? 'Updating…' : 'Update Profile'}
                        </button>
                    </form>

                    {/* Delete */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        {!showDeleteConfirm ? (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                            >
                                <Trash2 size={15} />
                                Delete Account
                            </button>
                        ) : (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                <p className="text-sm text-red-700 font-medium mb-1">Are you sure?</p>
                                <p className="text-xs text-red-500 mb-3">
                                    This action cannot be undone. Your account will be permanently deactivated.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleDelete()}
                                        disabled={isDeleting}
                                        className="flex-1 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                    >
                                        {isDeleting && <Loader2 size={12} className="animate-spin" />}
                                        {isDeleting ? 'Deleting…' : 'Yes, Delete'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}