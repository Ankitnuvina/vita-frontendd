import React, { useRef, useEffect, useState } from 'react'
import { Settings, LogOut, } from 'lucide-react'
import type { UserProfile } from '../hook/useUserProfile'
import { useToastStore } from '@/store/toast.store'

interface UserAvatarDropdownProps {
    profile: UserProfile
    onSettingsClick: () => void
    onLogout: () => void
}

export function UserAvatarDropdown({
    profile,
    onSettingsClick,
    onLogout,
}: UserAvatarDropdownProps): React.ReactNode {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const addToast = useToastStore((s) => s.addToast)

    useEffect(() => {
        if (!open) return
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false)
        }
        window.addEventListener('mousedown', handler)
        return () => window.removeEventListener('mousedown', handler)
    }, [open])


    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full"
            >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 border-2 border-green-200 flex items-center justify-center shrink-0">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt="avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/vitalizeLogo/defaultUser.png'
                            }}
                        />
                    ) : (
                        <img
                            src="/vitalizeLogo/defaultUser.png"
                            alt="default avatar"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>               
            </button>

            {open && (
                <div className="absolute right-0 top-11 z-[200] w-56 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 border border-green-200 flex items-center justify-center shrink-0">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/vitalizeLogo/defaultUser.png'
                                    }}
                                />
                            ) : (
                                <img
                                    src="/vitalizeLogo/defaultUser.png"
                                    alt="default avatar"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{profile.username}</p>
                            <p className="text-[13px] text-gray-400 truncate">{profile.email}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => { setOpen(false); onSettingsClick() }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-100 hover:text-black transition-colors"
                        >
                            <Settings size={15} className="text-black" />
                            Account Settings
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false)
                                addToast({type: 'success', message: 'Signed out successfully',})
                                onLogout()
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-100 transition-colors">
                            <LogOut size={15} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}