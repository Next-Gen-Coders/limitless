import { usePrivy, useWallets } from '@privy-io/react-auth'
import type { User } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useCallback, useRef } from 'react'
import { User as UserIcon, Wallet, LogOut, Shield, Database } from 'lucide-react'

interface AuthProps {
    onUserAuthenticated?: (user: User, userSyncResponse?: UserSyncResponse) => void
}

interface UserSyncData {
    privyId: string
    email?: string
    walletAddress?: string
    linkedAccounts: unknown[]
    createdAt: Date
}


interface UserSyncResponse {
    success: boolean
    user: {
        id: string
        privy_id: string
        email?: string
        wallet_address?: string
        linked_accounts?: unknown[]
        created_at: string
        updated_at: string
    }
    message: string
}

export default function AuthComponent({ onUserAuthenticated }: AuthProps) {
    const { ready, authenticated, user, login, logout } = usePrivy()
    const { wallets } = useWallets()
    const [isLoading, setIsLoading] = useState(false)
    const [hasSynced, setHasSynced] = useState(false)
    const onUserAuthenticatedRef = useRef(onUserAuthenticated)

    // Keep ref current
    useEffect(() => {
        onUserAuthenticatedRef.current = onUserAuthenticated
    }, [onUserAuthenticated])

    const handleLogin = async () => {
        setIsLoading(true)
        try {
            await login()
        } catch (error) {
            console.error('Login failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await logout()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const syncUserToBackend = useCallback(async (userData: User) => {
        try {
            const syncData: UserSyncData = {
                privyId: userData.id,
                email: userData.email?.address,
                walletAddress: userData.wallet?.address,
                linkedAccounts: userData.linkedAccounts,
                createdAt: userData.createdAt,
            }

            // Replace VITE_API_URL with your actual backend URL
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
            const response = await fetch(`${apiUrl}/users/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(syncData),
            })

            if (!response.ok) {
                throw new Error('Failed to sync user to backend')
            }

            const result: UserSyncResponse = await response.json()
            console.log('User synced to backend:', result)

            // Mark as synced and pass full response to parent component
            setHasSynced(true)
            onUserAuthenticatedRef.current?.(userData, result)
        } catch (error) {
            console.error('Error syncing user to backend:', error)
            // Still call onUserAuthenticated even if backend sync fails
            setHasSynced(true)
            onUserAuthenticatedRef.current?.(userData)
        }
    }, [])

    // Sync user to backend when authenticated (only once per user)
    useEffect(() => {
        if (authenticated && user && !hasSynced) {
            syncUserToBackend(user)
        }
    }, [authenticated, user, hasSynced, syncUserToBackend])

    // Reset sync state when user changes
    useEffect(() => {
        if (!authenticated) {
            setHasSynced(false)
        }
    }, [authenticated, user?.id])

    if (!ready) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!authenticated) {
        return (
            <div className="flex flex-col items-center space-y-6 p-8">
                <div className="text-center space-y-4">
                    <Shield className="h-16 w-16 mx-auto text-primary" />
                    <h1 className="text-3xl font-bold">Welcome to Limitless</h1>
                    <p className="text-muted-foreground max-w-md">
                        Sign in to access your embedded wallet and start your Web3 journey
                    </p>
                </div>

                <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    size="lg"
                    className="min-w-[200px]"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    ) : (
                        <UserIcon className="h-4 w-4 mr-2" />
                    )}
                    Sign In
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">Welcome back!</h2>
                    <p className="text-muted-foreground">
                        {user?.email?.address || 'Authenticated user'}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    disabled={isLoading}
                    className='text-white'
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                </Button>
            </div>

            <div className="grid gap-4">
                <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4" />
                        <span className="font-medium">User Details</span>
                    </div>
                    <div className="text-sm space-y-1">
                        <p><strong>Privy ID:</strong> {user?.id}</p>
                        <p><strong>Email:</strong> {user?.email?.address || 'Not provided'}</p>
                        <p><strong>Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span className="font-medium">Embedded Wallets</span>
                    </div>
                    {wallets.length > 0 ? (
                        <div className="space-y-2">
                            {wallets.map((wallet, index) => (
                                <div key={wallet.address} className="text-sm p-2 bg-muted rounded">
                                    <p><strong>Wallet {index + 1}:</strong> {wallet.address}</p>
                                    <p><strong>Type:</strong> {wallet.walletClientType}</p>
                                    <p><strong>Chain:</strong> {wallet.chainId}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No wallets found</p>
                    )}
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span className="font-medium">Linked Accounts</span>
                    </div>
                    {user?.linkedAccounts && user.linkedAccounts.length > 0 ? (
                        <div className="space-y-1">
                            {user.linkedAccounts.map((account, index: number) => (
                                <div key={index} className="text-sm p-2 bg-muted rounded">
                                    <p><strong>Type:</strong> {account.type}</p>
                                    {'address' in account && account.address && <p><strong>Address:</strong> {account.address}</p>}
                                    {'email' in account && account.email && <p><strong>Email:</strong> {account.email}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No linked accounts</p>
                    )}
                </div>
            </div>
        </div>
    )
}
