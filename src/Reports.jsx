import { useEffect, useState } from "react"

function Reports() {
  const [vendors, setVendors] = useState([])
  const [permits, setPermits] = useState([])
  const [fees, setFees] = useState([])
  const [payments, setPayments] = useState([])
  const [complaints, setComplaints] = useState([])
  const [zones, setZones] = useState([])
  const [documents, setDocuments] = useState([])


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/vendors/")
      .then((response) => response.json())
      .then((data) => setVendors(data))
      .catch((error) => console.error(error))

    fetch("http://127.0.0.1:8000/api/permits/")
      .then((response) => response.json())
      .then((data) => setPermits(data))
      .catch((error) => console.error(error))

    fetch("http://127.0.0.1:8000/api/fees/")
      .then((response) => response.json())
      .then((data) => setFees(data))
      .catch((error) => console.error(error))

    fetch("http://127.0.0.1:8000/api/payments/")
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((error) => console.error(error))

    fetch("http://127.0.0.1:8000/api/complaints/")
      .then((response) => response.json())
      .then((data) => setComplaints(data))
      .catch((error) => console.error(error))

    fetch("http://127.0.0.1:8000/api/zones/")
      .then((response) => response.json())
      .then((data) => setZones(data))
      .catch((error) => console.error(error))

    fetch("http://127.0.0.1:8000/api/documents/")
      .then((response) => response.json())
      .then((data) => setDocuments(data))
      .catch((error) => console.error(error))
  }, [])


  const activePermits = permits.filter(
    (permit) => permit.status === "Active"
  ).length

  const pendingFees = fees.filter(
    (fee) => fee.status === "Pending"
  ).length

  const paidFees = fees.filter(
    (fee) => fee.status === "Paid"
  ).length

  const openComplaints = complaints.filter(
    (complaint) => complaint.status === "Open"
  ).length

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length

  const verifiedDocuments = documents.filter(
    (document) => document.verification_status === "Verified"
  ).length


  const totalFeeAmount = fees.reduce(
    (total, fee) => total + Number(fee.amount || 0),
    0
  )

  const totalPaymentAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  )


  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Reports & Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Overview of Street Vendor Permit Management System
        </p>

      </div>


      {/* Main Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Vendors */}

        <div className="bg-white p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Total Vendors
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {vendors.length}
          </h2>

        </div>


        {/* Permits */}

        <div className="bg-white p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Total Permits
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {permits.length}
          </h2>

        </div>


        {/* Active Permits */}

        <div className="bg-white p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Active Permits
          </p>

          <h2 className="text-3xl font-bold text-emerald-600 mt-2">
            {activePermits}
          </h2>

        </div>


        {/* Zones */}

        <div className="bg-white p-6 rounded-xl shadow">

          <p className="text-gray-500">
            Total Zones
          </p>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {zones.length}
          </h2>

        </div>

      </div>


      {/* Financial Reports */}

      <div className="mt-8">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Financial Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Total Fee */}

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Total Fee Amount
            </p>

            <h2 className="text-2xl font-bold text-orange-600 mt-2">
              ₹{totalFeeAmount.toFixed(2)}
            </h2>

          </div>


          {/* Pending Fees */}

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Pending Fees
            </p>

            <h2 className="text-2xl font-bold text-yellow-600 mt-2">
              {pendingFees}
            </h2>

          </div>


          {/* Paid Fees */}

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Paid Fees
            </p>

            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {paidFees}
            </h2>

          </div>

        </div>

      </div>


      {/* Payment Summary */}

      <div className="mt-8">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Payment Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Total Payments
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {payments.length}
            </h2>

          </div>


          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Total Payment Amount
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{totalPaymentAmount.toFixed(2)}
            </h2>

          </div>

        </div>

      </div>


      {/* Complaint & Document Summary */}

      <div className="mt-8">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Service Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Open Complaints */}

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Open Complaints
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {openComplaints}
            </h2>

          </div>


          {/* Resolved Complaints */}

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Resolved Complaints
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {resolvedComplaints}
            </h2>

          </div>


          {/* Verified Documents */}

          <div className="bg-white p-6 rounded-xl shadow">

            <p className="text-gray-500">
              Verified Documents
            </p>

            <h2 className="text-3xl font-bold text-indigo-600 mt-2">
              {verifiedDocuments}
            </h2>

          </div>

        </div>

      </div>


      {/* Vendor Table */}

      <div className="mt-8 bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b">

          <h2 className="text-xl font-bold text-gray-800">
            Vendor Summary
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">
                  Vendor Code
                </th>

                <th className="p-3 text-left">
                  Vendor Name
                </th>

                <th className="p-3 text-left">
                  Business Type
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {vendors.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="p-6 text-center text-gray-500"
                  >
                    No vendors found.
                  </td>

                </tr>

              ) : (

                vendors.map((vendor) => (

                  <tr
                    key={vendor.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3 font-medium">
                      {vendor.vendor_code}
                    </td>

                    <td className="p-3">
                      {vendor.full_name}
                    </td>

                    <td className="p-3">
                      {vendor.business_type}
                    </td>

                    <td className="p-3">
                      {vendor.status}
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

export default Reports