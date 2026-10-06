import { useEffect, useState } from "react"

function Vendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)

  const [formData, setFormData] = useState({
    vendor_code: "",
    full_name: "",
    mobile: "",
    email: "",
    address: "",
    business_type: "",
    status: "Pending",
  })

  // Get Vendors
  const fetchVendors = () => {
    fetch("http://127.0.0.1:8000/api/vendors/")
      .then((response) => response.json())
      .then((data) => {
        setVendors(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching vendors:", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Add or Update Vendor
  const handleSubmit = (event) => {
    event.preventDefault()

    const url = editingVendor
      ? `http://127.0.0.1:8000/api/vendors/${editingVendor.id}/`
      : "http://127.0.0.1:8000/api/vendors/"

    const method = editingVendor ? "PUT" : "POST"

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save vendor")
        }

        return response.json()
      })
      .then((data) => {
        if (editingVendor) {
          alert("Vendor updated successfully!")
        } else {
          alert("Vendor added successfully!")
        }

        resetForm()
        fetchVendors()
      })
      .catch((error) => {
        console.error("Error saving vendor:", error)
        alert("Failed to save vendor. Please check the details.")
      })
  }

  // Edit Vendor
  const handleEdit = (vendor) => {
    setEditingVendor(vendor)

    setFormData({
      vendor_code: vendor.vendor_code,
      full_name: vendor.full_name,
      mobile: vendor.mobile,
      email: vendor.email || "",
      address: vendor.address,
      business_type: vendor.business_type,
      status: vendor.status,
    })

    setShowForm(true)
  }

  // Delete Vendor
  const handleDelete = (vendorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?"
    )

    if (!confirmDelete) {
      return
    }

    fetch(`http://127.0.0.1:8000/api/vendors/${vendorId}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete vendor")
        }

        return response.json()
      })
      .then(() => {
        alert("Vendor deleted successfully!")
        fetchVendors()
      })
      .catch((error) => {
        console.error("Error deleting vendor:", error)
        alert("Failed to delete vendor.")
      })
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      vendor_code: "",
      full_name: "",
      mobile: "",
      email: "",
      address: "",
      business_type: "",
      status: "Pending",
    })

    setEditingVendor(null)
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
              Vendors
            </h2>

            <p className="text-gray-500 mt-1">
              Manage registered street vendors
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
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            {showForm
              ? "Close Form"
              : "+ Add Vendor"}
          </button>

        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">

            <h3 className="text-xl font-bold text-gray-800 mb-5">
              {editingVendor
                ? "Edit Vendor"
                : "Add New Vendor"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

              {/* Vendor Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Code
                </label>

                <input
                  type="text"
                  name="vendor_code"
                  value={formData.vendor_code}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile
                </label>

                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>

                <input
                  type="text"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
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
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Approved">
                    Approved
                  </option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />

              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  {editingVendor
                    ? "Update Vendor"
                    : "Save Vendor"}
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
              Loading vendors...
            </p>
          </div>
        )}

        {/* Vendor Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Vendor Code
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Name
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Mobile
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Business Type
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

                  {vendors.map((vendor) => (

                    <tr
                      key={vendor.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">
                        {vendor.vendor_code}
                      </td>

                      <td className="px-6 py-4">
                        {vendor.full_name}
                      </td>

                      <td className="px-6 py-4">
                        {vendor.mobile}
                      </td>

                      <td className="px-6 py-4">
                        {vendor.business_type}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            vendor.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {vendor.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleEdit(vendor)
                            }
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(vendor.id)
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

export default Vendors