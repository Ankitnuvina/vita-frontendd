import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { apiClient } from '@/lib/axios'

export function VerifyEmailPage() {
    const [params] = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [errorMsg, setErrorMsg] = useState('Link invalid or expired.')

    useEffect(() => {
        const token = params.get('token')
        if (!token) {
            setStatus('error')
            return
        }

        apiClient.get(`/api/auth/verify-email?token=${token}`)
            .then(() => {
                setStatus('success')
            })
            .catch((err) => {
                const msg = err?.message ?? ''

                if (
                    msg.includes('already been used') ||
                    msg.includes('already verified') ||
                    msg.includes('already verified')
                ) {
                    setStatus('success')
                    return
                }
                setErrorMsg(msg || 'Link invalid or expired.')
                setStatus('error')
            })
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-sm w-full">
                {status === 'loading' && (
                    <div>
                        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-500">Verifying your email...</p>
                    </div>
                )}
                {status === 'success' && (
                    <>
                        <div className="text-4xl mb-4">✅</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-sm text-gray-500 mb-1">Your account is now active.</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="text-4xl mb-4">❌</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-sm text-gray-500 mb-4">{errorMsg}</p>                       
                    </>
                )}
            </div>
        </div>
    )
}