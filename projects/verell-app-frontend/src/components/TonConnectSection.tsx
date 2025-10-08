import type { FC } from 'react'
import { useEffect } from 'react'
import { TonConnectButton, useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import type { TonConnectChain } from '../config/tonConnect'

interface TonConnectSectionProps {
  network: TonConnectChain
}

const TonConnectSection: FC<TonConnectSectionProps> = ({ network }) => {
  const [tonConnectUI] = useTonConnectUI()
  const tonWallet = useTonWallet()
  const tonAddress = useTonAddress()

  useEffect(() => {
    tonConnectUI.setConnectParameters({
      network,
    })
  }, [network, tonConnectUI])

  return (
    <div className="card bg-slate-100 text-gray-900 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Conecta tu billetera TON</h2>
      <p className="text-sm mb-4">
        Escanea el código QR o abre Telegram Wallet directamente para conectar tu cuenta mediante TON Connect en la red
        principal.
      </p>
      <div className="flex justify-center mb-4" data-test-id="ton-connect-button">
        <TonConnectButton />
      </div>
      {tonWallet && (
        <div className="text-xs text-left">
          <p className="font-semibold uppercase tracking-wide text-gray-600 mb-1">Wallet conectado</p>
          <p className="font-mono break-all" data-test-id="ton-wallet-address">
            {tonAddress}
          </p>
        </div>
      )}
    </div>
  )
}

export default TonConnectSection
