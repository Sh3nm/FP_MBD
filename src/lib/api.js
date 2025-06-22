const API_BASE_URLS = ["http://localhost:3001", "http://localhost:8000"]

let currentApiUrl = null
let isApiAvailable = false

// Mock data untuk fallback
const mockFlights = [
  {
    id: 1,
    airline: "Garuda Indonesia",
    flight_number: "GA-123",
    departure_city: "Jakarta",
    arrival_city: "Surabaya",
    departure_time: "08:00",
    arrival_time: "10:30",
    departure_date: "2024-01-15",
    price: 1500000,
    available_seats: 45,
    aircraft_type: "Boeing 737",
    duration: "2h 30m",
  },
  {
    id: 2,
    airline: "Lion Air",
    flight_number: "JT-456",
    departure_city: "Jakarta",
    arrival_city: "Denpasar",
    departure_time: "14:15",
    arrival_time: "17:00",
    departure_date: "2024-01-15",
    price: 1200000,
    available_seats: 32,
    aircraft_type: "Airbus A320",
    duration: "2h 45m",
  },
  {
    id: 3,
    airline: "Batik Air",
    flight_number: "ID-789",
    departure_city: "Surabaya",
    arrival_city: "Jakarta",
    departure_time: "19:30",
    arrival_time: "22:00",
    departure_date: "2024-01-15",
    price: 1350000,
    available_seats: 28,
    aircraft_type: "Boeing 737-800",
    duration: "2h 30m",
  },
]

const mockBookings = [
  {
    id: "BK001",
    flight_id: 1,
    passenger_name: "John Doe",
    passenger_email: "john@example.com",
    seat_number: "12A",
    booking_date: "2024-01-10",
    status: "confirmed",
    total_price: 1500000,
  },
]

// Test API connection
async function testApiConnection() {
  for (const url of API_BASE_URLS) {
    try {
      console.log(`Testing API connection to: ${url}`)
      const response = await fetch(`${url}/flights`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      })

      if (response.ok) {
        currentApiUrl = url
        isApiAvailable = true
        console.log(`✅ API connected successfully: ${url}`)
        return true
      }
    } catch (error) {
      console.log(`❌ Failed to connect to: ${url}`, error.message)
    }
  }

  console.log("🔄 Using mock data - API not available")
  isApiAvailable = false
  return false
}

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  if (!isApiAvailable) {
    return handleMockRequest(endpoint, options)
  }

  try {
    const url = `${currentApiUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("API request failed:", error)
    // Fallback to mock data
    return handleMockRequest(endpoint, options)
  }
}

// Handle mock requests
function handleMockRequest(endpoint, options) {
  console.log(`🔄 Mock request: ${options.method || "GET"} ${endpoint}`)

  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint === "/flights") {
        resolve({ success: true, data: mockFlights })
      } else if (endpoint === "/bookings") {
        if (options.method === "POST") {
          const newBooking = {
            id: `BK${Date.now()}`,
            ...JSON.parse(options.body),
            booking_date: new Date().toISOString().split("T")[0],
            status: "confirmed",
          }
          mockBookings.push(newBooking)
          resolve({ success: true, data: newBooking })
        } else {
          resolve({ success: true, data: mockBookings })
        }
      } else if (endpoint.startsWith("/flights/")) {
        const id = Number.parseInt(endpoint.split("/")[2])
        const flight = mockFlights.find((f) => f.id === id)
        resolve({ success: true, data: flight })
      } else if (endpoint === "/auth/login") {
        resolve({
          success: true,
          data: {
            token: "mock-jwt-token",
            user: { id: 1, name: "Demo User", email: "demo@example.com" },
          },
        })
      } else if (endpoint === "/auth/register") {
        resolve({
          success: true,
          data: {
            message: "User registered successfully",
            user: { id: 2, name: "New User", email: "new@example.com" },
          },
        })
      } else {
        resolve({ success: false, error: "Endpoint not found" })
      }
    }, 500) // Simulate network delay
  })
}

// API functions
export const api = {
  // Initialize API connection
  async init() {
    return await testApiConnection()
  },

  // Get connection status
  getStatus() {
    return {
      isConnected: isApiAvailable,
      currentUrl: currentApiUrl,
      mode: isApiAvailable ? "api" : "demo",
    }
  },

  // Flights
  async getFlights(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/flights${queryString ? `?${queryString}` : ""}`
    return await apiRequest(endpoint)
  },

  async getFlight(id) {
    return await apiRequest(`/flights/${id}`)
  },

  // Bookings
  async createBooking(bookingData) {
    return await apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  },

  async getBookings() {
    return await apiRequest("/bookings")
  },

  async getUserBookings(userId) {
    return await apiRequest(`/bookings/user/${userId}`)
  },

  // Authentication
  async login(credentials) {
    return await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  async register(userData) {
    return await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Retry connection
  async retryConnection() {
    return await testApiConnection()
  },
}

// Initialize API on module load
api.init()
