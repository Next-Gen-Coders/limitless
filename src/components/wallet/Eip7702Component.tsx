import { usePrivy, useWallets, useSign7702Authorization } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Shield, Zap, Database, AlertCircle, CheckCircle, Info } from 'lucide-react'

// EIP-7702 is supported on these chains (as of 2025)
const EIP_7702_SUPPORTED_CHAINS = [
    1,          // Ethereum Mainnet
    11155111,   // Sepolia Testnet  
    10,         // Optimism
    42161,      // Arbitrum One
    8453,       // Base
    137,        // Polygon
]

// Chain name mapping for display
const CHAIN_NAMES: Record<number, string> = {
    1: 'Ethereum Mainnet',
    11155111: 'Sepolia Testnet',
    10: 'Optimism',
    42161: 'Arbitrum One',
    8453: 'Base',
    137: 'Polygon',
}

interface DelegationTuple {
    address: string
    nonce: string
    implementation: string
    signature: string
    chainId: number
    r: string
    s: string
    yParity: number
}

interface Eip7702ComponentProps {
    onDelegationCreated?: (delegation: DelegationTuple) => void
    existingDelegations?: DelegationTuple[]
    userId?: string // Add userId prop to pass from parent component
}

export default function Eip7702Component({ onDelegationCreated, existingDelegations = [], userId }: Eip7702ComponentProps) {
    const { authenticated } = usePrivy()
    const { wallets } = useWallets()
    const { signAuthorization } = useSign7702Authorization()
    const [isLoading, setIsLoading] = useState(false)
    const [delegations, setDelegations] = useState<DelegationTuple[]>(existingDelegations)
    const [status, setStatus] = useState<'idle' | 'signing' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState<string>('')

    // Update delegations when existingDelegations prop changes
    useEffect(() => {
        setDelegations(existingDelegations)
    }, [existingDelegations])

    // Smart contract implementation address for delegation
    // This should be a deployed smart wallet implementation contract
    // You can make this configurable via environment variables
    const SMART_WALLET_IMPLEMENTATION = import.meta.env.VITE_SMART_WALLET_IMPLEMENTATION || '0x000000004F43C49e93C970E84001853a70923B03' // Example Biconomy Nexus implementation

    const createDelegation = async () => {
        if (!authenticated || wallets.length === 0) {
            setErrorMessage('Please connect your wallet first')
            setStatus('error')
            return
        }

        // Debug: Log available wallets
        console.log('Available wallets:', wallets.map(w => ({
            address: w.address,
            type: w.walletClientType,
            chainId: w.chainId
        })))

        // EIP-7702 requires a Privy embedded wallet specifically
        const embeddedWallet = wallets.find(w => w.walletClientType === 'privy')

        if (!embeddedWallet) {
            setErrorMessage('EIP-7702 delegation requires a Privy embedded wallet. External wallets like MetaMask are not supported for EIP-7702 by Privy.')
            setStatus('error')
            return
        }

        setIsLoading(true)
        setStatus('signing')
        setErrorMessage('')

        try {
            // Use the Privy embedded wallet for EIP-7702
            console.log('Using embedded wallet:', {
                address: embeddedWallet.address,
                type: embeddedWallet.walletClientType,
                chainId: embeddedWallet.chainId
            })

            // Parse the chain ID - it might be in format "eip155:1"
            const chainIdString = embeddedWallet.chainId.toString()
            const chainId = chainIdString.includes(':')
                ? parseInt(chainIdString.split(':')[1])
                : parseInt(chainIdString)

            console.log('Parsed chain ID:', chainId)

            // Check if the current chain supports EIP-7702
            if (!EIP_7702_SUPPORTED_CHAINS.includes(chainId)) {
                const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`
                throw new Error(
                    `EIP-7702 is not supported on ${chainName}. ` +
                    `Please switch to a supported chain: Ethereum, Sepolia, Optimism, Arbitrum, Base, or Polygon.`
                )
            }

            // Use the official Privy hook to sign EIP-7702 authorization
            const authorization = await signAuthorization({
                contractAddress: SMART_WALLET_IMPLEMENTATION,
                chainId: chainId,
                // nonce is optional - Privy will fetch current nonce if not provided
            })

            const delegationTuple: DelegationTuple = {
                address: embeddedWallet.address,
                nonce: authorization.nonce.toString(),
                implementation: SMART_WALLET_IMPLEMENTATION,
                signature: `${authorization.r}${authorization.s}${authorization.yParity.toString(16).padStart(2, '0')}`,
                chainId: authorization.chainId,
                r: authorization.r,
                s: authorization.s,
                yParity: authorization.yParity,
            }

            // Store delegation tuple in local state
            setDelegations(prev => [...prev, delegationTuple])

            // Store in Supabase
            await storeDelegationInSupabase(delegationTuple)

            setStatus('success')
            onDelegationCreated?.(delegationTuple)

        } catch (error) {
            console.error('Failed to create delegation:', error)
            setErrorMessage(`Failed to create delegation: ${error instanceof Error ? error.message : 'Unknown error'}`)
            setStatus('error')
        } finally {
            setIsLoading(false)
        }
    }

    const storeDelegationInSupabase = async (delegation: DelegationTuple) => {
        try {
            // Check if we have userId - if not, log a warning but still try to store
            if (!userId) {
                console.warn('No userId provided - backend may not be able to associate delegation with user')
            }

            // Replace VITE_API_URL with your actual backend URL
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
            const response = await fetch(`${apiUrl}/users/delegations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId || delegation.address, // Use provided userId or fallback to wallet address
                    delegator: delegation.address, // User's wallet address as delegator
                    delegatee: delegation.implementation, // Smart wallet implementation as delegatee
                    nonce: delegation.nonce,
                    authority: delegation.implementation, // Authority is typically the implementation contract
                    signature: delegation.signature,
                    chainId: delegation.chainId,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error('Backend error:', errorData)
                throw new Error(`Failed to store delegation: ${errorData.message || 'Unknown error'}`)
            }

            console.log('Delegation stored in Supabase successfully')
        } catch (error) {
            console.error('Error storing delegation in Supabase:', error)
            throw error
        }
    }

    if (!authenticated) {
        return (
            <div className="p-6 border rounded-lg">
                <div className="text-center space-y-4">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                        <h3 className="text-lg font-medium">EIP-7702 Smart Wallet Features</h3>
                        <p className="text-sm text-muted-foreground">
                            Please sign in to access smart wallet delegation features
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="p-6 border rounded-lg">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">EIP-7702 Smart Wallet Delegation</h3>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Transform your Privy embedded wallet into a smart wallet with features like gas sponsorship,
                        batch transactions, and granular permissions using EIP-7702 delegation.
                        <br /><br />
                        <strong>Note:</strong> EIP-7702 delegation only works with Privy embedded wallets,
                        not external wallets like MetaMask. You need to create an embedded wallet through Privy authentication.
                    </p>

                    {/* Show wallet status */}
                    <div className="p-3 bg-muted rounded-lg">
                        <div className="text-sm">
                            <p><strong>Connected Wallets:</strong></p>
                            {wallets.length === 0 ? (
                                <p className="text-muted-foreground">No wallets connected</p>
                            ) : (
                                <div className="space-y-1 mt-1">
                                    {wallets.map((wallet) => {
                                        const chainIdString = wallet.chainId.toString()
                                        const chainId = chainIdString.includes(':')
                                            ? parseInt(chainIdString.split(':')[1])
                                            : parseInt(chainIdString)
                                        const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`
                                        const isEip7702Supported = EIP_7702_SUPPORTED_CHAINS.includes(chainId)

                                        return (
                                            <div key={wallet.address} className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span>{wallet.walletClientType}</span>
                                                    <span className="text-xs text-muted-foreground">{chainName}</span>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-mono text-xs">{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</span>
                                                    {wallet.walletClientType === 'privy' && (
                                                        <span className={`text-xs ${isEip7702Supported ? 'text-green-600' : 'text-orange-600'}`}>
                                                            {isEip7702Supported ? '✅ EIP-7702' : '⚠️ No EIP-7702'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            {wallets.some(w => w.walletClientType === 'privy') ? (
                                <p className="text-green-600 mt-2">✅ Privy embedded wallet detected</p>
                            ) : (
                                <p className="text-orange-600 mt-2">⚠️ No Privy embedded wallet found - EIP-7702 not available</p>
                            )}
                        </div>
                    </div>

                    {/* EIP-7702 Chain Support Info */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-900 dark:text-blue-100">EIP-7702 Chain Support</p>
                                <p className="text-blue-800 dark:text-blue-200 mt-1">
                                    Supported chains: <strong>Ethereum, Sepolia, Optimism, Arbitrum, Base, Polygon</strong>
                                </p>
                                <p className="text-blue-700 dark:text-blue-300 mt-1 text-xs">
                                    EIP-7702 is now widely supported across major L1 and L2 networks as of 2025.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={createDelegation}
                            disabled={isLoading || !wallets.some(w => w.walletClientType === 'privy')}
                            className="min-w-[160px]"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            ) : (
                                <Shield className="h-4 w-4 mr-2" />
                            )}
                            {isLoading ? 'Creating...' : 'Create Delegation'}
                        </Button>

                        {status === 'success' && (
                            <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm">Delegation created successfully!</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex items-center text-red-600">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                <span className="text-sm">{errorMessage}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {delegations.length > 0 && (
                <div className="p-6 border rounded-lg">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Database className="h-5 w-5" />
                            <h4 className="text-md font-medium">Active Delegations</h4>
                        </div>

                        <div className="space-y-3">
                            {delegations.map((delegation, index) => (
                                <div key={index} className="p-3 bg-muted rounded-lg space-y-2">
                                    <div className="text-sm space-y-1">
                                        <p><strong>Wallet:</strong> {delegation.address}</p>
                                        <p><strong>Implementation:</strong> {delegation.implementation}</p>
                                        <p><strong>Nonce:</strong> {delegation.nonce}</p>
                                        <p><strong>Chain ID:</strong> {delegation.chainId}</p>
                                        <p><strong>Signature:</strong> {delegation.signature.slice(0, 20)}...{delegation.signature.slice(-20)}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <p><strong>R:</strong> {delegation.r.slice(0, 10)}...</p>
                                            <p><strong>S:</strong> {delegation.s.slice(0, 10)}...</p>
                                            <p><strong>Y Parity:</strong> {delegation.yParity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="space-y-2">
                    <h4 className="text-md font-medium text-blue-900 dark:text-blue-100">
                        Smart Wallet Benefits
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Gas-sponsored transactions</li>
                        <li>• Batch multiple operations</li>
                        <li>• Granular permission controls</li>
                        <li>• Enhanced security features</li>
                        <li>• Social recovery options</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
