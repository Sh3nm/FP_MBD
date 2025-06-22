"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plane, Plus, Edit, Trash2 } from "lucide-react"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { api } from "@/lib/api"

export default function AdminPage() {
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("flights")
  const [showAddFlight, setShowAddFlight] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [flightsResponse, bookingsResponse] = await Promise.all([api.getFlights(), api.getBookings()])

      if (flightsResponse.success) setFlights(flightsResponse.data)
      if (bookingsResponse.success) setBookings(bookingsResponse.data)
    } catch (error) {
      console.error("Error loading admin data:", error)
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
              <span className="text-xl font-bold text-gray-900">SkyBooking Admin</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Kembali ke Website
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConnectionStatus />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Kelola penerbangan dan pemesanan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penerbangan</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flights.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pemesanan</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pemesanan Aktif</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter((b) => b.status === "confirmed").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "flights", label: "Penerbangan" },
                { id: "bookings", label: "Pemesanan" },
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
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Flights Tab */}
        {activeTab === "flights" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Kelola Penerbangan</h2>
              <Button onClick={() => setShowAddFlight(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Penerbangan
              </Button>
            </div>

            {showAddFlight && <AddFlightForm onClose={() => setShowAddFlight(false)} />}

            <div className="space-y-4">
              {flights.map((flight) => (
                <FlightAdminCard key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Kelola Pemesanan</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingAdminCard key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AddFlightForm({ onClose }) {
  const [formData, setFormData] = useState({
    airline: "",
    flight_number: "",
    departure_city: "",
    arrival_city: "",
    departure_time: "",
    arrival_time: "",
    departure_date: "",
    price: "",
    available_seats: "",
    aircraft_type: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Adding flight:", formData)
    // Here you would call the API to add the flight
    onClose()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Penerbangan Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="airline">Maskapai</Label>
              <Input
                id="airline"
                name="airline"
                placeholder="Garuda Indonesia"
                value={formData.airline}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flight_number">Nomor Penerbangan</Label>
              <Input
                id="flight_number"
                name="flight_number"
                placeholder="GA-123"
                value={formData.flight_number}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure_city">Kota Asal</Label>
              <Input
                id="departure_city"
                name="departure_city"
                placeholder="Jakarta"
                value={formData.departure_city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival_city">Kota Tujuan</Label>
              <Input
                id="arrival_city"
                name="arrival_city"
                placeholder="Surabaya"
                value={formData.arrival_city}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departure_time">Waktu Berangkat</Label>
              <Input
                id="departure_time"
                name="departure_time"
                type="time"
                value={formData.departure_time}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrival_time">Waktu Tiba</Label>
              <Input
                id="arrival_time"
                name="arrival_time"
                type="time"
                value={formData.arrival_time}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departure_date">Tanggal</Label>
              <Input
                id="departure_date"
                name="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="1500000"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_seats">Kursi Tersedia</Label>
              <Input
                id="available_seats"
                name="available_seats"
                type="number"
                placeholder="150"
                value={formData.available_seats}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aircraft_type">Tipe Pesawat</Label>
              <Input
                id="aircraft_type"
                name="aircraft_type"
                placeholder="Boeing 737"
                value={formData.aircraft_type}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Simpan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function FlightAdminCard({ flight }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="font-semibold text-lg">{flight.airline}</h3>
              <Badge variant="secondary">{flight.flight_number}</Badge>
            </div>
            <div className="flex items-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold">{flight.departure_time}</div>
                <div className="text-sm text-gray-600">{flight.departure_city}</div>
              </div>
              <div className="flex-1 text-center">
                <Plane className="h-4 w-4 text-gray-400 mx-auto" />
                <div className="text-xs text-gray-500">{flight.aircraft_type}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{flight.arrival_time}</div>
                <div className="text-sm text-gray-600">{flight.arrival_city}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{flight.departure_date}</span>
              <span>•</span>
              <span>{flight.available_seats} kursi tersedia</span>
            </div>
          </div>
          <div className="text-right ml-8">
            <div className="text-xl font-bold text-blue-600 mb-4">Rp {flight.price?.toLocaleString("id-ID")}</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BookingAdminCard({ booking }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Terkonfirmasi</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="font-semibold text-lg">Booking #{booking.id}</h3>
              {getStatusBadge(booking.status)}
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Penumpang:</strong> {booking.passenger_name}
              </p>
              <p>
                <strong>Email:</strong> {booking.passenger_email}
              </p>
              <p>
                <strong>Kursi:</strong> {booking.seat_number}
              </p>
              <p>
                <strong>Tanggal Booking:</strong> {booking.booking_date}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600 mb-2">
              Rp {booking.total_price?.toLocaleString("id-ID")}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
