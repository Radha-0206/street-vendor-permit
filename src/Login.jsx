import { useState } from "react"

function Login({ onLogin }) {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {

    e.preventDefault()

    setError("")

    if (!username || !password) {
      setError("Please enter username and password.")
      return
    }

    setLoading(true)

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {

        localStorage.setItem(
          "token",
          data.token
        )

        localStorage.setItem(
          "username",
          data.username
        )

        localStorage.setItem(
          "is_staff",
          data.is_staff
        )

        localStorage.setItem(
          "is_superuser",
          data.is_superuser
        )

        onLogin()

      } else {

        setError(
          data.message || "Invalid username or password."
        )

      }

    } catch (error) {

      setError(
        "Unable to connect to the server."
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">

            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              SV
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mt-4">
              Street Vendor Permit
            </h1>

            <p className="text-gray-500 mt-1">
              Municipal Vendor Management System
            </p>

          </div>

          <h2 className="text-xl font-semibold text-gray-700 mb-5">
            Login
          </h2>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="mb-4">

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Enter username"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Street Vendor Permit Management System
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login