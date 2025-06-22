"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, Server, RefreshCw } from "lucide-react"
import { api } from "@/lib/api"

export function ConnectionStatus() {
  const [status, setStatus] = useState({ isConnected: false, mode: "checking" })
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = () => {
    const currentStatus = api.getStatus()
    setStatus(currentStatus)
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    await api.retryConnection()
    checkStatus()
    setIsRetrying(false)
  }

  if (status.mode === "checking") {
    return (
      <Alert variant="info" className="mb-4">
        <Server className="h-4 w-4" />
        <AlertDescription>Memeriksa koneksi API...</AlertDescription>
      </Alert>
    )
  }

  if (status.isConnected) {
    return (
      <Alert variant="info" className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertDescription>✅ Terhubung ke API: {status.currentUrl}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="warning" className="mb-4">
      <WifiOff className="h-4 w-4" />
      <div className="flex items-center justify-between">
        <AlertDescription>🔄 Mode Demo - API tidak tersedia. Menggunakan data contoh.</AlertDescription>
        <Button variant="outline" size="sm" onClick={handleRetry} disabled={isRetrying} className="ml-4">
          {isRetrying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Coba Lagi
        </Button>
      </div>
    </Alert>
  )
}
