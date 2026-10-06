import { useEffect, useState } from "react"

function Permits() {
  const [permits, setPermits] = useState([])
  const [vendors, setVendors] = useState([])
  const [zones, setZones] = useState([])

  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPermit, setEditingPermit] = useState(null)

  const [formData, setFormData] = useState({
    vendor: "",
    zone: "",
    permit_number: "",
    issue_date: "",
    expiry_date: "",
    status: "Active",
  })

  // Get Permits
  const fetchPermits = () => {
    fetch("http://127.0.0.1:8000/api/permits/")
      .then((response) => response.json())
      .then((data) => {
        setPermits(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching permits:", error)
        setLoading(false)
      })
  }

  // Get Vendors
  const fetchVendors = () => {
    fetch("http://127.0.0.1:8000/api/vendors/")
      .then((response) => response.json())
      .then((data) => {
        setVendors(data)
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error)
      })
  }

  // Get Zones
  const fetchZones = () => {
    fetch("http://127.0.0.1:8000/api/zones/")
      .then((response) => response.json())
      .then((data) => {
        setZones(data)
      })
      .catch((error) => {
        console.error("Error fetching zones:", error)
      })
  }

  useEffect(() => {
    fetchPermits()
    fetchVendors()
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

  // Add / Update Permit
  const handleSubmit = (event) => {
    event.preventDefault()

    const url = editingPermit
      ? `http://127.0.0.1:8000/api/permits/${editingPermit.id}/`
      : "http://127.0.0.1:8000/api/permits/"

    const method = editingPermit ? "PUT" : "POST"

    const dataToSend = {
      ...formData,
      vendor: Number(formData.vendor),
      zone: formData.zone ? Number(formData.zone) : null,
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
          throw new Error("Failed to save permit")
        }

        return response.json()
      })
      .then(() => {
        alert(
          editingPermit
            ? "Permit updated successfully!"
            : "Permit added successfully!"
        )

        resetForm()
        fetchPermits()
      })
      .catch((error) => {
        console.error("Error saving permit:", error)
        alert("Failed to save permit. Please check the details.")
      })
  }

  // Edit Permit
  const handleEdit = (permit) => {
    setEditingPermit(permit)

    setFormData({
      vendor: permit.vendor || "",
      zone: permit.zone || "",
      permit_number: permit.permit_number,
      issue_date: permit.issue_date,
      expiry_date: permit.expiry_date,
      status: permit.status,
    })

    setShowForm(true)
  }

  // Delete Permit
  const handleDelete = (permitId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this permit?"
    )

    if (!confirmDelete) {
      return
    }

    fetch(`http://127.0.0.1:8000/api/permits/${permitId}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete permit")
        }

        return response.json()
      })
      .then(() => {
        alert("Permit deleted successfully!")
        fetchPermits()
      })
      .catch((error) => {
        console.error("Error deleting permit:", error)
        alert("Failed to delete permit.")
      })
  }

  // Reset Form
  const resetForm = () => {
    setFormData({
      vendor: "",
      zone: "",
      permit_number: "",
      issue_date: "",
      expiry_date: "",
      status: "Active",
    })

    setEditingPermit(null)
    setShowForm(false)
  }

  // Find vendor name
  const getVendorName = (vendorId) => {
    const vendor = vendors.find(
      (item) => item.id === vendorId
    )

    return vendor
      ? vendor.full_name
      : "Unknown Vendor"
  }

  // Find zone name
  const getZoneName = (zoneId) => {
    if (!zoneId) {
      return "Not Assigned"
    }

    const zone = zones.find(
      (item) => item.id === zoneId
    )

    return zone
      ? zone.zone_name
      : "Unknown Zone"
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

        {/* Heading */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Permits
            </h2>

            <p className="text-gray-500 mt-1">
              Manage vendor permits and validity
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
            className="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            {showForm
              ? "Close Form"
              : "+ Add Permit"}
          </button>

        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">

            <h3 className="text-xl font-bold text-gray-800 mb-5">
              {editingPermit
                ? "Edit Permit"
                : "Add New Permit"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor
                </label>

                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="">
                    Select Vendor
                  </option>

                  {vendors.map((vendor) => (
                    <option
                      key={vendor.id}
                      value={vendor.id}
                    >
                      {vendor.vendor_code} -{" "}
                      {vendor.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone
                </label>

                <select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="">
                    Select Zone
                  </option>

                  {zones.map((zone) => (
                    <option
                      key={zone.id}
                      value={zone.id}
                    >
                      {zone.zone_code} -{" "}
                      {zone.zone_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Permit Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permit Number
                </label>

                <input
                  type="text"
                  name="permit_number"
                  value={formData.permit_number}
                  onChange={handleChange}
                  placeholder="Example: PERMIT002"
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
                  <option value="Active">
                    Active
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Expired">
                    Expired
                  </option>

                  <option value="Renewed">
                    Renewed
                  </option>
                </select>
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date
                </label>

                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  {editingPermit
                    ? "Update Permit"
                    : "Save Permit"}
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
              Loading permits...
            </p>
          </div>
        )}

        {/* Permit Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Permit Number
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Vendor
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Zone
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Issue Date
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Expiry Date
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

                  {permits.map((permit) => (

                    <tr
                      key={permit.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">
                        {permit.permit_number}
                      </td>

                      <td className="px-6 py-4">
                        {getVendorName(permit.vendor)}
                      </td>

                      <td className="px-6 py-4">
                        {getZoneName(permit.zone)}
                      </td>

                      <td className="px-6 py-4">
                        {permit.issue_date}
                      </td>

                      <td className="px-6 py-4">
                        {permit.expiry_date}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            permit.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : permit.status === "Expired"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {permit.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleEdit(permit)
                            }
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(permit.id)
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

export default Permits