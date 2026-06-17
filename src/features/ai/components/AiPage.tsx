import React, { useState } from 'react'
import { AiChatWidget } from '@/features/ai/components/AiChatWidget'
import { AiChatSidebar } from '@/features/ai/components/AiChatSidebar'

export function AiPage(): React.ReactNode {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <main id="main-content" className="min-h-screen bg-ink flex">
      {/* Sidebar */}
      <div className="relative">
        <AiChatSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[100%] mx-auto">
          <AiChatWidget />
        </div>
      </div>
    </main>
  )
}