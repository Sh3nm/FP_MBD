"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Plane, ArrowRight } from "lucide-react"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { api } from "@/lib/api"

export default function FlightsPage() {
  const location = useLocation()
  const searchParams = location.state || {}
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFlights()
  }, [])

  const loadFlights = async () => {
    setLoading(true)
    try {
      const response = await api.getFlights(searchParams)
      if (response.success) {
        setFlights(response.data)
      }
    } catch (error) {
      console.error("Error loading flights:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SkyBooking</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/my-tickets" className="text-gray-600 hover:text-gray-900">
                Tiket Saya
              </Link>
              <Button variant="outline" className="bg-white text-blue-600 border-blue-600">
                Masuk
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConnectionStatus />

        {/* Search Summary */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hasil Pencarian Penerbangan</h1>
          <p className="text-gray-600">
            {searchParams.departure && searchParams.arrival
              ? `${searchParams.departure} → ${searchParams.arrival}`
              : "Semua penerbangan"}{" "}
            • {searchParams.date || "Semua tanggal"} • {searchParams.class || "Semua kelas"}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Mencari penerbangan...</p>
          </div>
        )}

        {/* Flight Results */}
        {!loading && (
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && flights.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada penerbangan ditemukan</h3>
              <p className="text-gray-600 mb-4">Coba ubah kriteria pencarian Anda atau pilih tanggal lain</p>
              <Link to="/">
                <Button variant="outline">Cari Lagi</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function FlightCard({ flight }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-8 mb-4">
              {/* Departure */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.departure_time}</div>
                <div className="text-sm text-gray-600">{flight.departure_city}</div>
              </div>

              {/* Flight Info */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <Plane className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{flight.duration || "2h 30m"}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {flight.airline} • {flight.aircraft_type}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.arrival_time}</div>
                <div className="text-sm text-gray-600">{flight.arrival_city}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Economy</Badge>
              <span className="text-sm text-gray-600">{flight.available_seats} kursi tersedia</span>
            </div>
          </div>

          {/* Price and Book Button */}
          <div className="text-right ml-8">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              Rp {flight.price?.toLocaleString("id-ID") || "1.500.000"}
            </div>
            <Link to={`/booking/${flight.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Pilih Penerbangan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
