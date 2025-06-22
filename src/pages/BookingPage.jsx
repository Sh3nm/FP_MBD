"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plane, ArrowRight } from "lucide-react"
import { ConnectionStatus } from "@/components/ConnectionStatus"
import { api } from "@/lib/api"

export default function BookingPage() {
  const { id } = useParams()
  const [flight, setFlight] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState("")
  const [step, setStep] = useState("seat")
  const [passengerData, setPassengerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFlight()
  }, [id])

  const loadFlight = async () => {
    setLoading(true)
    try {
      const response = await api.getFlight(id)
      if (response.success) {
        setFlight(response.data)
      }
    } catch (error) {
      console.error("Error loading flight:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setPassengerData({
      ...passengerData,
      [e.target.name]: e.target.value,
    })
  }

  const handleBooking = async () => {
    try {
      const bookingData = {
        flight_id: flight.id,
        passenger_name: `${passengerData.firstName} ${passengerData.lastName}`,
        passenger_email: passengerData.email,
        passenger_phone: passengerData.phone,
        seat_number: selectedSeat,
        total_price: flight.price + 150000,
      }

      const response = await api.createBooking(bookingData)
      if (response.success) {
        alert(`Pemesanan berhasil! Kode booking: ${response.data.id}`)
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("Terjadi kesalahan saat melakukan pemesanan")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail penerbangan...</p>
        </div>
      </div>
    )
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Penerbangan tidak ditemukan</h3>
            <Link to="/flights">
              <Button>Kembali ke Pencarian</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
              <Link to="/flights" className="text-gray-600 hover:text-gray-900">
                Kembali ke Pencarian
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConnectionStatus />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Penerbangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-xl font-bold">{flight.departure_time}</div>
                      <div className="text-sm text-gray-600">{flight.departure_city}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="w-16 h-px bg-gray-300"></div>
                      <Plane className="h-4 w-4 text-gray-400" />
                      <div className="w-16 h-px bg-gray-300"></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{flight.arrival_time}</div>
                      <div className="text-sm text-gray-600">{flight.arrival_city}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{flight.departure_date}</span>
                  <span>•</span>
                  <span>{flight.duration || "2h 30m"}</span>
                  <span>•</span>
                  <span>{flight.airline}</span>
                  <Badge variant="secondary">Economy</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Seat Selection */}
            {step === "seat" && <SeatSelection selectedSeat={selectedSeat} onSeatSelect={setSelectedSeat} />}

            {/* Passenger Information */}
            {step === "passenger" && <PassengerForm data={passengerData} onChange={handleInputChange} />}

            {/* Payment */}
            {step === "payment" && <PaymentForm />}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === "passenger") setStep("seat")
                  else if (step === "payment") setStep("passenger")
                }}
                disabled={step === "seat"}
              >
                Kembali
              </Button>
              <Button
                onClick={() => {
                  if (step === "seat" && selectedSeat) setStep("passenger")
                  else if (step === "passenger") setStep("payment")
                  else if (step === "payment") handleBooking()
                }}
                disabled={step === "seat" && !selectedSeat}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {step === "payment" ? "Bayar Sekarang" : "Lanjutkan"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar - Booking Summary */}
          <BookingSummary flight={flight} selectedSeat={selectedSeat} />
        </div>
      </div>
    </div>
  )
}

function SeatSelection({ selectedSeat, onSeatSelect }) {
  const seats = [
    { number: "1A", available: true },
    { number: "1B", available: false },
    { number: "1C", available: true },
    { number: "1D", available: true },
    { number: "2A", available: true },
    { number: "2B", available: true },
    { number: "2C", available: false },
    { number: "2D", available: true },
    { number: "3A", available: true },
    { number: "3B", available: true },
    { number: "3C", available: true },
    { number: "3D", available: true },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Kursi</CardTitle>
        <CardDescription>Pilih kursi yang Anda inginkan untuk penerbangan ini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Tersedia</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Terisi</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Dipilih</span>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-center text-sm text-gray-600 mb-4">Economy Class</div>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              {seats.map((seat) => (
                <button
                  key={seat.number}
                  onClick={() => seat.available && onSeatSelect(seat.number)}
                  disabled={!seat.available}
                  className={`
                    w-12 h-12 rounded text-xs font-medium transition-colors
                    ${
                      !seat.available
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : selectedSeat === seat.number
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>

          {selectedSeat && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800">
                Kursi terpilih: <strong>{selectedSeat}</strong> - Economy Class
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PassengerForm({ data, onChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Penumpang</CardTitle>
        <CardDescription>Masukkan data penumpang sesuai dengan dokumen perjalanan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nama Depan</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Nama depan"
              value={data.firstName}
              onChange={onChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nama Belakang</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Nama belakang"
              value={data.lastName}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            value={data.email}
            onChange={onChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input id="phone" name="phone" placeholder="+62 812 3456 7890" value={data.phone} onChange={onChange} />
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pembayaran</CardTitle>
        <CardDescription>Pilih metode pembayaran untuk menyelesaikan pemesanan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Metode Pembayaran</Label>
          <Select>
            <option value="">Pilih metode pembayaran</option>
            <option value="bca">Transfer BCA</option>
            <option value="mandiri">Transfer Mandiri</option>
            <option value="bni">Transfer BNI</option>
            <option value="bri">Transfer BRI</option>
            <option value="gopay">GoPay</option>
            <option value="ovo">OVO</option>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

function BookingSummary({ flight, selectedSeat }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Pemesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Penerbangan</h4>
            <p className="text-sm text-gray-600">
              {flight.departure_city} → {flight.arrival_city}
            </p>
            <p className="text-sm text-gray-600">{flight.departure_date}</p>
            <p className="text-sm text-gray-600">{flight.airline}</p>
          </div>

          {selectedSeat && (
            <div>
              <h4 className="font-medium mb-2">Kursi</h4>
              <p className="text-sm text-gray-600">{selectedSeat} - Economy</p>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Harga tiket</span>
                <span>Rp {flight.price?.toLocaleString("id-ID") || "1.500.000"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pajak & biaya</span>
                <span>Rp 150.000</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {((flight.price || 1500000) + 150000).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Kebijakan Pembatalan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-600">
            Tiket dapat dibatalkan hingga 24 jam sebelum keberangkatan dengan biaya pembatalan sesuai ketentuan
            maskapai.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
