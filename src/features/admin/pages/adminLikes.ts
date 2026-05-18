let debounceTimer: ReturnType<typeof setTimeout> | null = null

export async function getLikesAnalytics(params?: {
  user?: string
  contentType?: string
}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/likes-analytics?${new URLSearchParams(
            params as Record<string, string>
          )}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        if (!response.ok) throw new Error('Failed to fetch likes analytics')
        resolve(await response.json())
      } catch (err) {
        reject(err)
      }
    }, 500)
  })
}