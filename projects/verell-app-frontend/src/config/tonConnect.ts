import { CHAIN } from '@tonconnect/ui'

type TonConnectNetworkKey = 'mainnet' | 'testnet'
export type TonConnectChain = (typeof CHAIN)[keyof typeof CHAIN]

const TONCONNECT_NETWORK_MAP: Record<TonConnectNetworkKey, TonConnectChain> = {
  mainnet: CHAIN.MAINNET,
  testnet: CHAIN.TESTNET,
}

export const getTonConnectManifestUrl = () => {
  const fromEnv = import.meta.env.VITE_TONCONNECT_MANIFEST_URL
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/tonconnect-manifest.json`
  }

  return '/tonconnect-manifest.json'
}

export const getTonConnectNetwork = (): TonConnectChain => {
  const fallback: TonConnectNetworkKey = 'mainnet'
  const key = String(import.meta.env.VITE_TONCONNECT_NETWORK || fallback).toLowerCase() as TonConnectNetworkKey
  return TONCONNECT_NETWORK_MAP[key] ?? TONCONNECT_NETWORK_MAP[fallback]
}

export const getTonConnectPreferredWallet = () => import.meta.env.VITE_TONCONNECT_PREFERRED_WALLET || 'telegram-wallet'
