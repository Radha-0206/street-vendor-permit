import { useEffect, useState } from "react"

function Payments() {
  const [payments, setPayments] = useState([])
  const [vendors, setVendors] = useState([])
  const [permits, setPermits] = useState([])

  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)

  const [formData, setFormData] = useState({
    vendor: "",
    permit: "",
    payment_number: "",
    amount: "",
    payment_method: "Cash",
    status: "Paid",
    receipt_number: "",
  })

  // Fetch Payments
  const fetchPayments = () => {
    fetch("http://127.0.0.1:8000/api/payments/")
      .then((response) => response.json())
      .then((data) => {
        setPayments(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching payments:", error)
        setLoading(false)
      })
  }

  // Fetch Vendors
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

  // Fetch Permits
  const fetchPermits = () => {
    fetch("http://127.0.0.1:8000/api/permits/")
      .then((response) => response.json())
      .then((data) => {
        setPermits(data)
      })
      .catch((error) => {
        console.error("Error fetching permits:", error)
      })
  }

  useEffect(() => {
    fetchPayments()
    fetchVendors()
    fetchPermits()
  }, [])

  // Handle Input
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Add / Update Payment
  const handleSubmit = (event) => {
    event.preventDefault()

    const url = editingPayment
      ? `http://127.0.0.1:8000/api/payments/${editingPayment.id}/`
      : "http://127.0.0.1:8000/api/payments/"

    const method = editingPayment ? "PUT" : "POST"

    const dataToSend = {
      vendor: Number(formData.vendor),
      permit: Number(formData.permit),
      payment_number: formData.payment_number,
      amount: formData.amount,
      payment_method: formData.payment_method,
      status: formData.status,
      receipt_number: formData.receipt_number,
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
          throw new Error("Failed to save payment")
        }

        return response.json()
      })
      .then(() => {
        alert(
          editingPayment
            ? "Payment updated successfully!"
            : "Payment added successfully!"
        )

        resetForm()
        fetchPayments()
      })
      .catch((error) => {
        console.error("Error saving payment:", error)
        alert("Failed to save payment. Please check the details.")
      })
  }

  // Edit Payment
  const handleEdit = (payment) => {
    setEditingPayment(payment)

    setFormData({
      vendor: payment.vendor || "",
      permit: payment.permit || "",
      payment_number: payment.payment_number,
      amount: payment.amount,
      payment_method: payment.payment_method,
      status: payment.status,
      receipt_number: payment.receipt_number,
    })

    setShowForm(true)
  }

  // Delete Payment
  const handleDelete = (paymentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    )

    if (!confirmDelete) {
      return
    }

    fetch(`http://127.0.0.1:8000/api/payments/${paymentId}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete payment")
        }

        return response.json()
      })
      .then(() => {
        alert("Payment deleted successfully!")
        fetchPayments()
      })
      .catch((error) => {
        console.error("Error deleting payment:", error)
        alert("Failed to delete payment.")
      })
  }

  // Reset Form
  const resetForm = () => {
    setFormData({
      vendor: "",
      permit: "",
      payment_number: "",
      amount: "",
      payment_method: "Cash",
      status: "Paid",
      receipt_number: "",
    })

    setEditingPayment(null)
    setShowForm(false)
  }

  // Vendor Name
  const getVendorName = (vendorId) => {
    const vendor = vendors.find(
      (item) => item.id === vendorId
    )

    return vendor
      ? vendor.full_name
      : "Unknown Vendor"
  }

  // Permit Number
  const getPermitNumber = (permitId) => {
    const permit = permits.find(
      (item) => item.id === permitId
    )

    return permit
      ? permit.permit_number
      : "Unknown Permit"
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

      <main className="p-8">

        {/* Heading */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Payments
            </h2>

            <p className="text-gray-500 mt-1">
              Manage vendor permit payments and receipts
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
            className="bg-yellow-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-yellow-700"
          >
            {showForm ? "Close Form" : "+ Add Payment"}
          </button>

        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">

            <h3 className="text-xl font-bold text-gray-800 mb-5">
              {editingPayment
                ? "Edit Payment"
                : "Add New Payment"}
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

              {/* Permit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permit
                </label>

                <select
                  name="permit"
                  value={formData.permit}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="">
                    Select Permit
                  </option>

                  {permits.map((permit) => (
                    <option
                      key={permit.id}
                      value={permit.id}
                    >
                      {permit.permit_number}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Number
                </label>

                <input
                  type="text"
                  name="payment_number"
                  value={formData.payment_number}
                  onChange={handleChange}
                  placeholder="Example: PAY003"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Example: 500"
                  min="0"
                  step="0.01"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>

                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="Cash">
                    Cash
                  </option>

                  <option value="Online">
                    Online
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Card">
                    Card
                  </option>
                </select>
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
                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Failed">
                    Failed
                  </option>
                </select>
              </div>

              {/* Receipt Number */}
              <div className="md:col-span-2">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Number
                </label>

                <input
                  type="text"
                  name="receipt_number"
                  value={formData.receipt_number}
                  onChange={handleChange}
                  placeholder="Example: REC003"
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
                  {editingPayment
                    ? "Update Payment"
                    : "Save Payment"}
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
              Loading payments...
            </p>
          </div>
        )}

        {/* Payment Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Payment Number
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Vendor
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Permit
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Amount
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Method
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Receipt
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {payments.map((payment) => (

                    <tr
                      key={payment.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-medium">
                        {payment.payment_number}
                      </td>

                      <td className="px-6 py-4">
                        {getVendorName(payment.vendor)}
                      </td>

                      <td className="px-6 py-4">
                        {getPermitNumber(payment.permit)}
                      </td>

                      <td className="px-6 py-4">
                        ₹{payment.amount}
                      </td>

                      <td className="px-6 py-4">
                        {payment.payment_method}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            payment.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">
                        {payment.receipt_number}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              handleEdit(payment)
                            }
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(payment.id)
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

export default Payments