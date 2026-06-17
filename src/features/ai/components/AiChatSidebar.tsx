import {
    SquarePen, PanelLeftClose, MessageSquare, Clock, Search, Users, PanelLeftOpen, StepBack, Ellipsis, Pin, Share2, Pencil, Archive, Trash2, Check, X, File, Podcast,
    Video, BookOpen, ChevronDown, PinOff} from 'lucide-react'
import { useAiChatHistory } from '../hooks/useAiChatHistory'
import { useAiChatStore } from '../store/ai-chat.store'
import type { ChatSession } from '@/globals'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

interface AiChatSidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export function AiChatSidebar({ isOpen, onToggle }: AiChatSidebarProps): React.ReactNode {
    const navigate = useNavigate()
    const [showMore, setShowMore] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState('')
    const renameInputRef = useRef<HTMLInputElement>(null)

    const { sessions, loading, fetchSessions, renameSession, deleteSession, pinSession } = useAiChatHistory()
    const { resetChat, loadSession, sessionId: activeSessionId } = useAiChatStore()


    useEffect(() => { fetchSessions() }, [activeSessionId, fetchSessions])
    useEffect(() => { if (renamingId) renameInputRef.current?.focus() }, [renamingId])
    useEffect(() => {
        if (!openMenuId) return
        const handler = () => setOpenMenuId(null)
        window.addEventListener('click', handler)
        return () => window.removeEventListener('click', handler)
    }, [openMenuId])

    const handleStartRename = (session: ChatSession) => {
        setRenamingId(session.sessionId)
        setRenameValue(session.title)
        setOpenMenuId(null)
    }

    const handleRenameSubmit = async (sessionId: string) => {
        if (!renameValue.trim()) return
        await renameSession(sessionId, renameValue.trim())
        setRenamingId(null)
        setRenameValue('')
    }

    const [showPinLimitModal, setShowPinLimitModal] = useState(false)
    const [showPinnedHistory, setShowPinnedHistory] = useState(true)
    const handlePin = async (session: ChatSession) => {
        const isPinned = !!session.pinnedAt
        if (!isPinned && pinned.length >= 10) {
            setShowPinLimitModal(true)
            setOpenMenuId(null)
            return
        }
        await pinSession(session.sessionId, !session.pinnedAt)
        setOpenMenuId(null)
    }
    const pinned = sessions.filter((s) => s.pinnedAt)
        .sort((a, b) => new Date(b.pinnedAt!).getTime() - new Date(a.pinnedAt!).getTime())

    const unpinned = sessions.filter((s) => !s.pinnedAt)


    const grouped = unpinned.reduce<Record<string, ChatSession[]>>((acc, s) => {
        const date = new Date(s.createdAt)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        let label: string
        if (date.toDateString() === today.toDateString()) label = 'Today'
        else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday'
        else label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

            ; (acc[label] ??= []).push(s)
        return acc
    }, {})

    const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
    const confirmDelete = async () => {
        if (!deleteSessionId) return

        await deleteSession(deleteSessionId)

        if (deleteSessionId === activeSessionId) {
            resetChat()
        }

        setOpenMenuId(null)
        setDeleteSessionId(null)
    }
    // Reusable session row
    const SessionRow = ({ session }: { session: ChatSession }) => (
        <div
            className={`group relative flex items-center rounded-lg text-[12px] transition-colors ${session.sessionId === activeSessionId ? 'bg-gray-100 text-black' : 'text-black hover:bg-gray-100'
                }`}
        >
            {renamingId === session.sessionId ? (
                <div className="flex items-center gap-1 w-full px-2.5 py-1.5">
                    <input
                        ref={renameInputRef}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') void handleRenameSubmit(session.sessionId)
                            if (e.key === 'Escape') setRenamingId(null)
                        }}
                        className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-[12px] outline-none focus:border-green-400"
                    />
                    <button onClick={() => void handleRenameSubmit(session.sessionId)} className="text-green-600 hover:text-green-800">
                        <Check size={14} />
                    </button>
                    <button onClick={() => setRenamingId(null)} className="text-gray-400 hover:text-gray-700">
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        onClick={() => loadSession(session)}
                        className="flex-1 text-left px-2.5 py-2 truncate"
                        title={session.title}
                    >
                        {session.title}
                    </button>

                    <div className="hidden group-hover:flex items-center gap-1 pr-2 shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setOpenMenuId(openMenuId === session.sessionId ? null : session.sessionId)
                            }}
                            className="text-gray-400 hover:text-black"
                        >
                            <Ellipsis size={15} />
                        </button>
                    </div>

                    {openMenuId === session.sessionId && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 z-50 min-w-[160px] rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
                        >
                            <button
                                onClick={() => void handlePin(session)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {session.pinnedAt ? (
                                    <PinOff size={14} className="text-black rotate-[40deg]" />
                                ) : (
                                    <Pin size={14} className="rotate-[40deg]" />
                                )}

                                {session.pinnedAt ? 'Unpin chat' : 'Pin chat'}
                            </button>

                            <button
                                onClick={() => handleStartRename(session)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Pencil size={14} /> Rename
                            </button>

                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Share2 size={14} /> Share
                            </button>

                            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Archive size={14} /> Archive
                            </button>

                            <hr className="my-1" />

                            <button
                                onClick={() => setDeleteSessionId(session.sessionId)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </>
            )}
            {deleteSessionId && (
                <div className="bg-black/5 fixed inset-0 z-[999] flex items-center justify-center backdrop-blur-[1px]">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Delete Chat
                        </h3>

                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to delete this chat session?
                            This action cannot be undone.
                        </p>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteSessionId(null)}
                                className="rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-100" style={{ border: '1px solid gray' }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => void confirmDelete()}
                                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const [isScrolled, setIsScrolled] = useState(false)
    const asideRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = asideRef.current
        if (!el) return

        const handleScroll = () => {
            setIsScrolled(el.scrollTop > 20)
        }

        el.addEventListener('scroll', handleScroll)

        return () => {
            el.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const searchInputRef = useRef<HTMLInputElement>(null)

    const searchResults = sessions.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            <div className="absolute">
                {!isOpen && (
                    <button
                        onClick={onToggle}
                        className="flex h-[49px] w-[56px] items-center justify-center border border-white/10 bg-white text-gray-500 hover:text-black"
                    >
                        <PanelLeftOpen size={18} />
                    </button>
                )}
            </div>

            <aside
                ref={asideRef}
                className={`h-screen flex flex-col shrink-0 overflow-y-auto bg-white/[0.03] border-r transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-[57px]'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-3 border-b border-black/[0.07] bg-white max-h-[50.59px] min-w-64">
                        <div className={isOpen ? 'opacity-100 flex gap-[5px]' : 'opacity-0 hidden'} >
                            <img
                                src="/vitalizeLogo/logo-icon.svg"
                                alt="Vitalize AI"
                                className="w-6 h-6 object-contain"
                                />
                            <span><span className="text-green-500">Vita</span> Wellness AI </span>
                        </div>
                        <button onClick={onToggle} className="p-1.5 rounded-lg text-gray-500 hover:text-black">
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Body */}
                    <div className="flex-1 overflow-y-auto pb-8 px-2 bg-white">
                        <div
                            className={`sticky top-0 z-10 transition-all bg-white shadow-sm py-2 ${isScrolled ? 'bg-white shadow-sm' : ''
                                }`}
                        >
                            <button
                                onClick={resetChat}
                                className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-black transition-all hover:bg-gray-100 w-full"
                            >
                                <SquarePen className="h-4 w-4 shrink-0" />
                                <span className={isOpen ? 'opacity-100' : 'opacity-0 hidden'}>
                                    New Chat
                                </span>
                            </button>
                            <button
                                onClick={() => { setShowSearch(true); setSearchQuery('') }}
                                className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-black transition-all hover:bg-gray-100 w-full"
                            >
                                <Search className="h-4 w-4 shrink-0" />
                                <span className={isOpen ? 'opacity-100' : 'opacity-0 hidden'}>
                                    Search Chats
                                </span>
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">

                            <button className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-black transition-all hover:bg-gray-100">
                                <Users className="h-4 w-4 shrink-0" />
                                <span className={isOpen ? 'opacity-100' : 'opacity-0 hidden'}>Health Experts</span>
                            </button>
                            <button className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-black transition-all hover:bg-gray-100">
                                <File className="h-4 w-4 shrink-0" />
                                <span className={isOpen ? 'opacity-100' : 'opacity-0 hidden'}>Health Articles</span>
                            </button>

                            <button
                                onClick={() => setShowMore(!showMore)}
                                className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-black transition-all hover:bg-gray-100"
                            >
                                <Ellipsis className="h-4 w-4 shrink-0" />
                                <span className={isOpen ? 'opacity-100' : 'opacity-0 hidden'}>
                                    More
                                </span>
                            </button>

                            {showMore && (
                                <div className="absolute left-full top-0 ml-2 min-w-[180px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50">
                                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
                                        <Podcast size={16} />
                                        Podcasts
                                    </button>

                                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
                                        <Video size={16} />
                                        Videos
                                    </button>

                                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
                                        <BookOpen size={16} />
                                        Blogs
                                    </button>
                                </div>
                            )}

                        </div>

                        <hr className="my-3 border-black/10" />

                        {isOpen && (
                            <>
                                {loading ? (
                                    <div className="space-y-2 px-1 mt-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="h-8 rounded-lg bg-black/10 animate-pulse" />
                                        ))}
                                    </div>
                                ) : sessions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-32 gap-2 text-black/25">
                                        <MessageSquare className="w-6 h-6" />
                                        <p className="text-xs">No chats yet</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Pinned section */}
                                        {pinned.length > 0 && (
                                            <div className="mb-2">
                                                <p
                                                    onClick={() => setShowPinnedHistory(!showPinnedHistory)}
                                                    className="px-2 mb-1 text-[11px] font-bold tracking-widest text-black/40 flex items-center gap-1.5 cursor-pointer select-none"
                                                >
                                                    <Pin className="w-3 h-3 rotate-[40deg]" />
                                                    Pinned ({pinned.length}/10)

                                                    <ChevronDown
                                                        className={`w-3 h-3 transition-transform duration-200 ${showPinnedHistory ? 'rotate-0' : '-rotate-90'
                                                            }`}
                                                    />
                                                </p>
                                                {showPinnedHistory && (
                                                    <div
                                                        className={`transition-all duration-300 ${showPinnedHistory ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                                            }`}
                                                    >
                                                        {pinned.map((session) => (
                                                            <SessionRow key={session.sessionId} session={session} />
                                                        ))}
                                                    </div>
                                                )}
                                                {showPinLimitModal && (
                                                    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                Pin Limit Reached
                                                            </h3>

                                                            <p className="mt-2 text-sm text-gray-600">
                                                                You can pin a maximum of 10 chat sessions.
                                                                Please unpin an existing session before pinning a new one.
                                                            </p>

                                                            <div className="mt-5 flex justify-end">
                                                                <button
                                                                    onClick={() => setShowPinLimitModal(false)}
                                                                    className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
                                                                >
                                                                    Got it
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Divider between pinned and recent */}
                                        {pinned.length > 0 && unpinned.length > 0 && (
                                            <hr className="border-black/10" />
                                        )}

                                        {/* Grouped recent chats */}
                                        {Object.entries(grouped).map(([label, items]) => (
                                            <div key={label}>
                                                <p className="px-2 my-2 text-[12px] font-bold tracking-widest text-black flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" /> {label}
                                                </p>
                                                <div className="space-y-0.5">
                                                    {items.map((session) => (
                                                        <SessionRow key={session.sessionId} session={session} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </>
                        )}

                        {/* Back to Home */}
                        <div>
                            <button
                                onClick={() => navigate('/')}
                                className={`flex items-center text-sm font-medium transition-all absolute bottom-0 left-0 w-full justify-center bg-black rounded-none py-2 text-white ${isOpen ? 'gap-2' : 'justify-center'}`}
                            >
                                <StepBack className="w-4 h-4 shrink-0" />
                                <span className={isOpen ? 'opacity-100' : 'opacity-0 hidden'}>Back to Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
            {/* Search Modal */}
            {showSearch && (
                <div
                    className="fixed inset-0 z-[999] flex items-start justify-center bg-black/30 backdrop-blur-[2px] pt-[15vh]"
                    onClick={() => setShowSearch(false)}
                >
                    <div
                        className="w-full max-w-[650px] rounded-2xl bg-white shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <Search className="h-4 w-4 text-gray-400 shrink-0" />
                            <input
                                ref={searchInputRef}
                                autoFocus
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search your chats..."
                                className="flex-1 text-sm outline-none text-black placeholder:text-gray-400"
                            />
                            <button
                                onClick={() => setShowSearch(false)}
                                className="p-1 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Results */}
                        <div>
                            <div>
                                <button
                                    onClick={() => {
                                        resetChat();
                                        setShowSearch(false);
                                    }}
                                    className="flex items-center gap-[10px] px-[15px] py-[10px] w-[calc(100%-30px)] mx-[15px] mt-[10px] rounded-[14px] hover:bg-[#f1f1f1]"
                                >
                                    <SquarePen className="h-4 w-4 shrink-0" />
                                    <span >
                                        New Chat
                                    </span>
                                </button>
                            </div>

                            <div className="max-h-[50vh] overflow-y-auto py-2">
                                {searchQuery.trim() === '' ? (
                                    // No query — show all sessions grouped
                                    sessions.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-300">
                                            <MessageSquare className="w-6 h-6" />
                                            <p className="text-xs">No chats yet</p>
                                        </div>
                                    ) : (
                                        Object.entries(
                                            sessions.reduce<Record<string, ChatSession[]>>((acc, s) => {
                                                const date = new Date(s.createdAt)
                                                const today = new Date()
                                                const yesterday = new Date(today)
                                                yesterday.setDate(yesterday.getDate() - 1)
                                                let label: string
                                                if (date.toDateString() === today.toDateString()) label = 'Today'
                                                else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday'
                                                else label = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                                    ; (acc[label] ??= []).push(s)
                                                return acc
                                            }, {})
                                        ).map(([label, items]) => (
                                            <div key={label} className="mb-2">
                                                <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                                    {label}
                                                </p>
                                                {items.map((session) => (
                                                    <button
                                                        key={session.sessionId}
                                                        onClick={() => { loadSession(session); setShowSearch(false) }}
                                                        className="w-[calc(100%-30px)] mx-[15px] rounded-[14px] text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 truncate flex items-center gap-2"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                                        {session.title}
                                                    </button>
                                                ))}
                                            </div>
                                        ))
                                    )
                                ) : searchResults.length === 0 ? (
                                    // No results
                                    <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-300">
                                        <Search className="w-6 h-6" />
                                        <p className="text-xs text-gray-400">No chats found for "<span className="font-medium">{searchQuery}</span>"</p>
                                    </div>
                                ) : (
                                    // Search results
                                    <div>
                                        <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                        </p>
                                        {searchResults.map((session) => (
                                            <button
                                                key={session.sessionId}
                                                onClick={() => { loadSession(session); setShowSearch(false) }}
                                                className="w-[calc(100%-30px)] mx-[15px] rounded-[14px] text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <MessageSquare className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                                <span className="truncate flex-1">{session.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}