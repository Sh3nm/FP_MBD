"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plane, User, CreditCard, X } from "lucide-react"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { api } from "@/lib/api"

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const response = await api.getBookings()
      if (response.success) {
        setBookings(response.data)
      }
    } catch (error) {
      console.error("Error loading bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true
    return booking.status === activeTab
  })

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
              <Link to="/flights" className="text-gray-600 hover:text-gray-900">
                Cari Penerbangan
              </Link>
              <Button variant="outline" className="bg-white text-blue-600 border-blue-600">
                Profil
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConnectionStatus />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tiket Saya</h1>
          <p className="text-gray-600">Kelola semua pemesanan tiket penerbangan Anda</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "all", label: "Semua", count: bookings.length },
                {
                  id: "confirmed",
                  label: "Terkonfirmasi",
                  count: bookings.filter((b) => b.status === "confirmed").length,
                },
                { id: "pending", label: "Pending", count: bookings.filter((b) => b.status === "pending").length },
                {
                  id: "cancelled",
                  label: "Dibatalkan",
                  count: bookings.filter((b) => b.status === "cancelled").length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat tiket...</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <TicketCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Plane className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === "all" ? "Belum ada tiket" : `Tidak ada tiket ${activeTab}`}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "all"
                  ? "Anda belum memiliki tiket penerbangan. Mulai cari penerbangan sekarang!"
                  : `Tidak ada tiket dengan status ${activeTab}`}
              </p>
              <Link to="/flights">
                <Button className="bg-blue-600 hover:bg-blue-700">Cari Penerbangan</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function TicketCard({ booking }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Terkonfirmasi</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu Pembayaran</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-semibold text-lg">Tiket #{booking.id}</h3>
              <p className="text-sm text-gray-600">Dipesan: {booking.booking_date}</p>
            </div>
            {getStatusBadge(booking.status)}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">
              Rp {booking.total_price?.toLocaleString("id-ID") || "1.500.000"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Flight Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold">08:00</div>
                <div className="text-sm text-gray-600">Jakarta (CGK)</div>
                <div className="text-xs text-gray-500">2024-01-15</div>
              </div>

              <div className="flex-1 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <Plane className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-600">2h 30m</div>
                <div className="text-xs text-gray-500">Garuda Indonesia</div>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold">10:30</div>
                <div className="text-sm text-gray-600">Surabaya (MLG)</div>
                <div className="text-xs text-gray-500">2024-01-15</div>
              </div>
            </div>
          </div>

          {/* Passenger & Seat Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span>{booking.passenger_name}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>Kursi {booking.seat_number} - Economy</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            {booking.status === "pending" && (
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CreditCard className="mr-2 h-4 w-4" />
                Bayar Sekarang
              </Button>
            )}
            {booking.status === "confirmed" && <Button variant="outline">Lihat E-Ticket</Button>}
          </div>

          {(booking.status === "confirmed" || booking.status === "pending") && (
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              <X className="mr-2 h-4 w-4" />
              Batalkan
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
