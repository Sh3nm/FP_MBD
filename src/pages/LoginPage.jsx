"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plane } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, demoLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(formData)
      if (result.success) {
        navigate("/")
      } else {
        setError(result.error || "Login gagal")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    demoLogin()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">SkyBooking</span>
          </div>
          <CardTitle>Masuk ke Akun</CardTitle>
          <CardDescription>Masuk untuk mengakses tiket dan pemesanan Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Atau</span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full bg-green-50 text-green-600 border-green-600 hover:bg-green-100"
          >
            Demo Login
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Belum punya akun? </span>
            <Link to="/register" className="text-blue-600 hover:underline">
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
