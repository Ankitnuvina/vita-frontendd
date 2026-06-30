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
                className="flex items-center gap-2 rounded-full max-w-[220px]"
            >
                {/* Avatar */}
                <div className=" flex items-center gap-[5px] justify-start w-full">
                    <div className='user_img w-10 h-10 rounded-full overflow-hidden border border-[#3a9158] shrink-0'>
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
                    <div className="User_name flex-1 min-w-0 text-left">
                        <p className="truncate text-sm font-semibold text-gray-900">
                            {profile.username}
                        </p>
                        <p className="truncate text-[12px] text-gray-400">
                            {profile.email}
                        </p>
                    </div>
                </div>
            </button>

            {open && (
                <div className="absolute right-0 top-11 z-[200] w-56 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
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
                                addToast({ type: 'success', message: 'Signed out successfully', })
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