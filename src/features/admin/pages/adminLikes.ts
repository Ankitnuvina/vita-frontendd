

export async function getLikesAnalytics(params?: {
    user?: string
    contentType?: string
}) {
    const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/likes-analytics?${new URLSearchParams(
            params as Record<string, string>
        )}`,
        {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch likes analytics')
    }

    const data = await response.json()

    return data
}