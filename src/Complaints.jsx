import { useEffect, useState } from "react"

function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [vendors, setVendors] = useState([])

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    vendor: "",
    subject: "",
    description: "",
    status: "Open",
  })

  // Fetch complaints
  const fetchComplaints = () => {
    fetch("http://127.0.0.1:8000/api/complaints/")
      .then((response) => response.json())
      .then((data) => setComplaints(data))
      .catch((error) => console.error(error))
  }

  // Fetch vendors
  const fetchVendors = () => {
    fetch("http://127.0.0.1:8000/api/vendors/")
      .then((response) => response.json())
      .then((data) => setVendors(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    fetchComplaints()
    fetchVendors()
  }, [])

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Add / Update complaint
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.vendor || !form.subject || !form.description) {
      alert("Please fill all required fields.")
      return
    }

    const url = editingId
      ? `http://127.0.0.1:8000/api/complaints/${editingId}/`
      : "http://127.0.0.1:8000/api/complaints/"

    const method = editingId ? "PUT" : "POST"

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor: Number(form.vendor),
        subject: form.subject,
        description: form.description,
        status: form.status,
        resolved_at: form.status === "Resolved"
          ? new Date().toISOString()
          : null,
      }),
    })

    if (response.ok) {
      alert(
        editingId
          ? "Complaint updated successfully!"
          : "Complaint added successfully!"
      )

      setForm({
        vendor: "",
        subject: "",
        description: "",
        status: "Open",
      })

      setEditingId(null)
      fetchComplaints()
    } else {
      alert("Something went wrong.")
    }
  }

  // Edit complaint
  const handleEdit = (complaint) => {
    setEditingId(complaint.id)

    setForm({
      vendor: complaint.vendor,
      subject: complaint.subject,
      description: complaint.description,
      status: complaint.status,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Delete complaint
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    )

    if (!confirmDelete) return

    const response = await fetch(
      `http://127.0.0.1:8000/api/complaints/${id}/`,
      {
        method: "DELETE",
      }
    )

    if (response.ok) {
      alert("Complaint deleted successfully!")
      fetchComplaints()
    } else {
      alert("Unable to delete complaint.")
    }
  }

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null)

    setForm({
      vendor: "",
      subject: "",
      description: "",
      status: "Open",
    })
  }

  // Get vendor name
  const getVendorName = (vendorId) => {
    const vendor = vendors.find((item) => item.id === vendorId)

    return vendor
      ? `${vendor.vendor_code} - ${vendor.full_name}`
      : "Unknown Vendor"
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Complaint Management
      </h1>

      {/* Form */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-bold text-gray-700 mb-5">
          {editingId ? "Edit Complaint" : "Add New Complaint"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Vendor */}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Vendor
              </label>

              <select
                name="vendor"
                value={form.vendor}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">
                  Select Vendor
                </option>

                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendor_code} - {vendor.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Complaint Subject
              </label>

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter complaint subject"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

          </div>

          {/* Description */}

          <div className="mt-4">

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter complaint details"
              rows="4"
              className="w-full border rounded-lg px-3 py-2"
            ></textarea>

          </div>

          {/* Status */}

          <div className="mt-4">

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full md:w-1/2 border rounded-lg px-3 py-2"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

          </div>

          {/* Buttons */}

          <div className="mt-5 flex gap-3">

            <button
              type="submit"
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
            >
              {editingId ? "Update Complaint" : "Add Complaint"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Complaints Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-xl font-bold text-gray-700">
            Complaint List
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  ID
                </th>

                <th className="p-3 text-left">
                  Vendor
                </th>

                <th className="p-3 text-left">
                  Subject
                </th>

                <th className="p-3 text-left">
                  Description
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {complaints.map((complaint) => (

                <tr
                  key={complaint.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-3">
                    {complaint.id}
                  </td>

                  <td className="p-3">
                    {getVendorName(complaint.vendor)}
                  </td>

                  <td className="p-3 font-medium">
                    {complaint.subject}
                  </td>

                  <td className="p-3">
                    {complaint.description}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        complaint.status === "Open"
                          ? "bg-red-100 text-red-700"
                          : complaint.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {complaint.status}
                    </span>

                  </td>

                  <td className="p-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(complaint)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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

    </div>
  )
}

export default Complaints