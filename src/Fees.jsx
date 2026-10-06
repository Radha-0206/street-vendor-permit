import { useEffect, useState } from "react"

function Fees() {
  const [fees, setFees] = useState([])
  const [permits, setPermits] = useState([])

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    permit: "",
    amount: "",
    fee_type: "",
    due_date: "",
    status: "Pending",
  })

  // Fetch Fees
  const fetchFees = () => {
    fetch("http://127.0.0.1:8000/api/fees/")
      .then((response) => response.json())
      .then((data) => setFees(data))
      .catch((error) =>
        console.error("Error fetching fees:", error)
      )
  }

  // Fetch Permits
  const fetchPermits = () => {
    fetch("http://127.0.0.1:8000/api/permits/")
      .then((response) => response.json())
      .then((data) => setPermits(data))
      .catch((error) =>
        console.error("Error fetching permits:", error)
      )
  }

  useEffect(() => {
    fetchFees()
    fetchPermits()
  }, [])

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Add / Update Fee
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.permit ||
      !form.amount ||
      !form.fee_type ||
      !form.due_date
    ) {
      alert("Please fill all required fields.")
      return
    }

    const url = editingId
      ? `http://127.0.0.1:8000/api/fees/${editingId}/`
      : "http://127.0.0.1:8000/api/fees/"

    const method = editingId ? "PUT" : "POST"

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        permit: Number(form.permit),
        amount: form.amount,
        fee_type: form.fee_type,
        due_date: form.due_date,
        status: form.status,
      }),
    })

    if (response.ok) {
      alert(
        editingId
          ? "Fee updated successfully!"
          : "Fee added successfully!"
      )

      setForm({
        permit: "",
        amount: "",
        fee_type: "",
        due_date: "",
        status: "Pending",
      })

      setEditingId(null)

      fetchFees()
    } else {
      const errorData = await response.json()

      console.log(errorData)

      alert("Unable to save fee.")
    }
  }

  // Edit
  const handleEdit = (fee) => {
    setEditingId(fee.id)

    setForm({
      permit: fee.permit,
      amount: fee.amount,
      fee_type: fee.fee_type,
      due_date: fee.due_date,
      status: fee.status,
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee?"
    )

    if (!confirmDelete) return

    const response = await fetch(
      `http://127.0.0.1:8000/api/fees/${id}/`,
      {
        method: "DELETE",
      }
    )

    if (response.ok) {
      alert("Fee deleted successfully!")
      fetchFees()
    } else {
      alert("Unable to delete fee.")
    }
  }

  // Cancel
  const handleCancel = () => {
    setEditingId(null)

    setForm({
      permit: "",
      amount: "",
      fee_type: "",
      due_date: "",
      status: "Pending",
    })
  }

  // Get Permit Number
  const getPermitNumber = (permitId) => {
    const permit = permits.find(
      (item) => item.id === permitId
    )

    return permit
      ? permit.permit_number
      : "Unknown Permit"
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Fee Management
      </h1>

      {/* Form */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-bold text-gray-700 mb-5">
          {editingId ? "Edit Fee" : "Add New Fee"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Permit */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Permit
              </label>

              <select
                name="permit"
                value={form.permit}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
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


            {/* Amount */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter fee amount"
                min="0"
                step="0.01"
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>


            {/* Fee Type */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Fee Type
              </label>

              <select
                name="fee_type"
                value={form.fee_type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >

                <option value="">
                  Select Fee Type
                </option>

                <option value="Permit Fee">
                  Permit Fee
                </option>

                <option value="Renewal Fee">
                  Renewal Fee
                </option>

                <option value="Late Fee">
                  Late Fee
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* Due Date */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Due Date
              </label>

              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />

            </div>


            {/* Status */}

            <div>

              <label className="block text-sm font-medium text-gray-600 mb-1">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Overdue">
                  Overdue
                </option>

              </select>

            </div>

          </div>


          {/* Buttons */}

          <div className="mt-5 flex gap-3">

            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
              {editingId ? "Update Fee" : "Add Fee"}
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


      {/* Fee Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="text-xl font-bold text-gray-700">
            Fee List
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
                  Permit
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Fee Type
                </th>

                <th className="p-3 text-left">
                  Due Date
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

              {fees.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="p-6 text-center text-gray-500"
                  >
                    No fees found.
                  </td>

                </tr>

              ) : (

                fees.map((fee) => (

                  <tr
                    key={fee.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3">
                      {fee.id}
                    </td>

                    <td className="p-3 font-medium">
                      {getPermitNumber(fee.permit)}
                    </td>

                    <td className="p-3">
                      ₹{fee.amount}
                    </td>

                    <td className="p-3">
                      {fee.fee_type}
                    </td>

                    <td className="p-3">
                      {fee.due_date}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          fee.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : fee.status === "Overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {fee.status}
                      </span>

                    </td>

                    <td className="p-3">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleEdit(fee)
                          }
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(fee.id)
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

export default Fees