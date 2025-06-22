"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plane } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok")
      setLoading(false)
      return
    }

    try {
      const result = await register(formData)
      if (result.success) {
        setSuccess("Registrasi berhasil! Silakan login.")
        setTimeout(() => navigate("/login"), 2000)
      } else {
        setError(result.error || "Registrasi gagal")
      }
    } catch (error) {
      setError("Terjadi kesalahan saat registrasi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">SkyBooking</span>
          </div>
          <CardTitle>Daftar Akun Baru</CardTitle>
          <CardDescription>Buat akun untuk mulai memesan tiket penerbangan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
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
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+62 812 3456 7890"
                value={formData.phone}
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
                placeholder="Buat password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-600">Sudah punya akun? </span>
            <Link to="/login" className="text-blue-600 hover:underline">
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
