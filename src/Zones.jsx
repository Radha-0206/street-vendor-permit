import { useEffect, useState } from "react"

function Zones() {
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editingZone, setEditingZone] = useState(null)

  const [formData, setFormData] = useState({
    zone_code: "",
    zone_name: "",
    location: "",
    capacity: "",
    status: "Available",
  })

  // Fetch Zones
  const fetchZones = () => {
    fetch("http://127.0.0.1:8000/api/zones/")
      .then((response) => response.json())
      .then((data) => {
        setZones(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching zones:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchZones()
  }, [])

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Add / Update Zone
  const handleSubmit = (event) => {
    event.preventDefault()

    const url = editingZone
      ? `http://127.0.0.1:8000/api/zones/${editingZone.id}/`
      : "http://127.0.0.1:8000/api/zones/"

    const method = editingZone ? "PUT" : "POST"

    const dataToSend = {
      ...formData,
      capacity: Number(formData.capacity),
    }

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save zone")
        }

        return response.json()
      })
      .then(() => {
        alert(
          editingZone
            ? "Zone updated successfully!"
            : "Zone added successfully!"
        )

        resetForm()
        fetchZones()
      })
      .catch((error) => {
        console.error("Error saving zone:", error)
        alert("Failed to save zone. Please check the details.")
      })
  }

  // Edit Zone
  const handleEdit = (zone) => {
    setEditingZone(zone)

    setFormData({
      zone_code: zone.zone_code,
      zone_name: zone.zone_name,
      location: zone.location,
      capacity: zone.capacity,
      status: zone.status,
    })

    setShowForm(true)
  }

  // Delete Zone
  const handleDelete = (zoneId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this zone?"
    )

    if (!confirmDelete) {
      return
    }

    fetch(`http://127.0.0.1:8000/api/zones/${zoneId}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete zone")
        }

        return response.json()
      })
      .then(() => {
        alert("Zone deleted successfully!")
        fetchZones()
      })
      .catch((error) => {
        console.error("Error deleting zone:", error)
        alert("Failed to delete zone.")
      })
  }

  // Reset Form
  const resetForm = () => {
    setFormData({
      zone_code: "",
      zone_name: "",
      location: "",
      capacity: "",
      status: "Available",
    })

    setEditingZone(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-700 text-white px-8 py-5 shadow">
        <h1 className="text-2xl font-bold">
          Street Vendor Permit
        </h1>

        <p className="text-blue-100 text-sm">
          Municipal Vendor Management System
        </p>
      </header>

      {/* Main */}
      <main className="p-8">

        {/* Page Heading */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Zones
            </h2>

            <p className="text-gray-500 mt-1">
              Manage vendor vending zones
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                resetForm()
              } else {
                setShowForm(true)
              }
            }}
            className="bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            {showForm ? "Close Form" : "+ Add Zone"}
          </button>

        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">

            <h3 className="text-xl font-bold text-gray-800 mb-5">
              {editingZone ? "Edit Zone" : "Add New Zone"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* Zone Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Code
                </label>

                <input
                  type="text"
                  name="zone_code"
                  value={formData.zone_code}
                  onChange={handleChange}
                  placeholder="Example: ZONE001"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Zone Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone Name
                </label>

                <input
                  type="text"
                  name="zone_name"
                  value={formData.zone_name}
                  onChange={handleChange}
                  placeholder="Example: Main Market Zone"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Example: Main Market"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Example: 50"
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="Available">
                    Available
                  </option>

                  <option value="Full">
                    Full
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  {editingZone
                    ? "Update Zone"
                    : "Save Zone"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">
              Loading zones...
            </p>
          </div>
        )}

        {/* Zone Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Zone Code
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Zone Name
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Location
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Capacity
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {zones.map((zone) => (

                    <tr
                      key={zone.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">
                        {zone.zone_code}
                      </td>

                      <td className="px-6 py-4">
                        {zone.zone_name}
                      </td>

                      <td className="px-6 py-4">
                        {zone.location}
                      </td>

                      <td className="px-6 py-4">
                        {zone.capacity}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            zone.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : zone.status === "Full"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {zone.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleEdit(zone)
                            }
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(zone.id)
                            }
                            className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </main>

    </div>
  )
}

export default Zones