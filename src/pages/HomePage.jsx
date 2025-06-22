"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export default function HomePage() {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
  })

  const handleSearch = (e) => {
    e.preventDefault()
    navigate("/flights", { state: searchData })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">✈</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SkyBook</span>
            </div>
            <nav className="flex space-x-6">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Masuk
              </Button>
              <Button onClick={() => navigate("/register")}>Daftar</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Temukan Penerbangan Terbaik</h1>
          <p className="text-xl text-gray-600">Pesan tiket pesawat dengan mudah dan cepat</p>
        </div>

        {/* Search Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Cari Penerbangan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">Dari</Label>
                  <Select
                    value={searchData.from}
                    onValueChange={(value) => setSearchData({ ...searchData, from: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kota asal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jakarta">Jakarta (CGK)</SelectItem>
                      <SelectItem value="Surabaya">Surabaya (SUB)</SelectItem>
                      <SelectItem value="Medan">Medan (KNO)</SelectItem>
                      <SelectItem value="Denpasar">Denpasar (DPS)</SelectItem>
                      <SelectItem value="Makassar">Makassar (UPG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">Ke</Label>
                  <Select value={searchData.to} onValueChange={(value) => setSearchData({ ...searchData, to: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kota tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jakarta">Jakarta (CGK)</SelectItem>
                      <SelectItem value="Surabaya">Surabaya (SUB)</SelectItem>
                      <SelectItem value="Medan">Medan (KNO)</SelectItem>
                      <SelectItem value="Denpasar">Denpasar (DPS)</SelectItem>
                      <SelectItem value="Makassar">Makassar (UPG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal Berangkat</Label>
                  <Input
                    type="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Penumpang</Label>
                  <Select
                    value={searchData.passengers}
                    onValueChange={(value) => setSearchData({ ...searchData, passengers: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Penumpang</SelectItem>
                      <SelectItem value="2">2 Penumpang</SelectItem>
                      <SelectItem value="3">3 Penumpang</SelectItem>
                      <SelectItem value="4">4 Penumpang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                🔍 Cari Penerbangan
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
