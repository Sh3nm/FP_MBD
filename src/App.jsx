import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import HomePage from "./pages/HomePage"
import FlightPage from "./pages/FlightPage"
import BookingPage from "./pages/BookingPage"
import MyTicketsPage from "./pages/MyTicketsPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AdminPage from "./pages/AdminPage"

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<FlightPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
