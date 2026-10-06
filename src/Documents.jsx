import { useEffect, useState } from "react"

function Documents() {
  const [documents, setDocuments] = useState([])
  const [vendors, setVendors] = useState([])

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    vendor: "",
    document_type: "",
    verification_status: "Pending",
  })

  // Fetch Documents
  const fetchDocuments = () => {
    fetch("http://127.0.0.1:8000/api/documents/")
      .then((response) => response.json())
      .then((data) => setDocuments(data))
      .catch((error) => console.error(error))
  }

  // Fetch Vendors
  const fetchVendors = () => {
    fetch("http://127.0.0.1:8000/api/vendors/")
      .then((response) => response.json())
      .then((data) => setVendors(data))
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    fetchDocuments()
    fetchVendors()
  }, [])

  // Input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.vendor || !form.document_type) {
      alert("Please fill all required fields.")
      return
    }

    // File is required only when adding
    if (!editingId) {
      alert("Document record requires a file. Please use Django Admin to upload the actual document file.")
      return
    }

    const url =
      `http://127.0.0.1:8000/api/documents/${editingId}/`

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendor: Number(form.vendor),
        document_type: form.document_type,
        verification_status: form.verification_status,
      }),
    })

    if (response.ok) {
      alert("Document updated successfully!")

      setEditingId(null)

      setForm({
        vendor: "",
        document_type: "",
        verification_status: "Pending",
      })

      fetchDocuments()
    } else {
      alert("Unable to update document.")
    }
  }

  // Edit
  const handleEdit = (document) => {
    setEditingId(document.id)

    setForm({
      vendor: document.vendor,
      document_type: document.document_type,
      verification_status: document.verification_status,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    )

    if (!confirmDelete) return

    const response = await fetch(
      `http://127.0.0.1:8000/api/documents/${id}/`,
      {
        method: "DELETE",
      }
    )

    if (response.ok) {
      alert("Document deleted successfully!")
      fetchDocuments()
    } else {
      alert("Unable to delete document.")
    }
  }

  // Cancel
  const handleCancel = () => {
    setEditingId(null)

    setForm({
      vendor: "",
      document_type: "",
      verification_status: "Pending",
    })
  }

  // Vendor name
  const getVendorName = (vendorId) => {
    const vendor = vendors.find(
      (item) => item.id === vendorId
    )

    return vendor
      ? `${vendor.vendor_code} - ${vendor.full_name}`
      : "Unknown Vendor"
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Document Management
      </h1>

      {/* Edit Form */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-bold text-gray-700 mb-5">
          {editingId
            ? "Edit Document"
            : "Document Records"}
        </h2>

        {!editingId && (
          <p className="text-gray-500 mb-4">
            New document files can be uploaded through Django Admin.
            This page is used to manage document records and verification status.
          </p>
        )}

        {editingId && (
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

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
                    <option
                      key={vendor.id}
                      value={vendor.id}
                    >
                      {vendor.vendor_code} - {vendor.full_name}
                    </option>
                  ))}

                </select>
              </div>

              {/* Document Type */}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Document Type
                </label>

                <input
                  type="text"
                  name="document_type"
                  value={form.document_type}
                  onChange={handleChange}
                  placeholder="Aadhaar Card"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Verification Status */}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Verification Status
                </label>

                <select
                  name="verification_status"
                  value={form.verification_status}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Verified">
                    Verified
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>
              </div>

            </div>

            <div className="mt-5 flex gap-3">

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Update Document
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>

            </div>

          </form>
        )}

      </div>

      {/* Documents Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="text-xl font-bold text-gray-700">
            Document List
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
                  Document Type
                </th>

                <th className="p-3 text-left">
                  Verification
                </th>

                <th className="p-3 text-left">
                  Uploaded
                </th>

                <th className="p-3 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {documents.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="p-6 text-center text-gray-500"
                  >
                    No documents found.
                  </td>

                </tr>

              ) : (

                documents.map((document) => (

                  <tr
                    key={document.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {document.id}
                    </td>

                    <td className="p-3">
                      {getVendorName(document.vendor)}
                    </td>

                    <td className="p-3 font-medium">
                      {document.document_type}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          document.verification_status === "Verified"
                            ? "bg-green-100 text-green-700"
                            : document.verification_status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {document.verification_status}
                      </span>

                    </td>

                    <td className="p-3">
                      {document.uploaded_at
                        ? new Date(
                            document.uploaded_at
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleEdit(document)
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(document.id)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Documents