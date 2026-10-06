import { useEffect, useState } from "react";
import MapView from "./MapView";

const API = "http://127.0.0.1:8000/api";
const BACKEND = "http://127.0.0.1:8000";

export default function App() {
  // =========================
  // LOGIN
  // =========================

  const [token, setToken] = useState(
    localStorage.getItem("streetVendorToken") || ""
  );

  const [username, setUsername] = useState(
    localStorage.getItem("streetVendorUsername") || ""
  );

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // =========================
  // PAGE
  // =========================

  const [page, setPage] = useState("Dashboard");

  // =========================
  // DATA
  // =========================

  const [vendors, setVendors] = useState([]);
  const [zones, setZones] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [permits, setPermits] = useState([]);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(false);

  // =========================
  // VENDOR CRUD
  // =========================

  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const emptyVendor = {
    vendor_code: "",
    full_name: "",
    mobile: "",
    email: "",
    address: "",
    business_type: "",
    status: "Pending",
  };

  const [vendorForm, setVendorForm] = useState(emptyVendor);

  // =========================
  // PERMIT CRUD
  // =========================

  const [showPermitForm, setShowPermitForm] = useState(false);
  const [editingPermit, setEditingPermit] = useState(null);

  const emptyPermit = {
    permit_number: "",
    vendor: "",
    zone: "",
    issue_date: "",
    expiry_date: "",
    status: "Active",
  };

  const [permitForm, setPermitForm] = useState(emptyPermit);

  // =========================
  // DOCUMENT CRUD
  // =========================

  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  const emptyDocument = {
    vendor: "",
    document_type: "",
    document_file: null,
    verification_status: "Pending",
  };

  const [documentForm, setDocumentForm] = useState(emptyDocument);

  // =========================
  // SEARCH
  // =========================

  const [vendorSearch, setVendorSearch] = useState("");
  const [documentSearch, setDocumentSearch] = useState("");
  const [permitSearch, setPermitSearch] = useState("");

  // =========================
  // STYLES
  // =========================

  const buttonStyle = {
    padding: "12px 20px",
    background: "#174b85",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  };

  const addButtonStyle = {
    ...buttonStyle,
    background: "#174b85",
  };

  const editButtonStyle = {
    padding: "10px 16px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "8px",
  };

  const deleteButtonStyle = {
    padding: "10px 16px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    background: "#6b7280",
    marginLeft: "10px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#334155",
  };

  // =========================
  // AUTH HEADERS
  // =========================

  const authHeaders = () => ({
    Authorization: `Token ${token}`,
  });

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch(`${API}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Invalid username or password");
        setLoginLoading(false);
        return;
      }

      localStorage.setItem("streetVendorToken", data.token);
      localStorage.setItem("streetVendorUsername", data.username);

      setToken(data.token);
      setUsername(data.username);

      setLoginUsername("");
      setLoginPassword("");
    } catch (error) {
      setLoginError("Unable to connect to backend.");
    }

    setLoginLoading(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("streetVendorToken");
    localStorage.removeItem("streetVendorUsername");

    setToken("");
    setUsername("");

    setVendors([]);
    setZones([]);
    setDocuments([]);
    setPermits([]);
    setFees([]);
    setPayments([]);
    setComplaints([]);

    setPage("Dashboard");
  };

  // =========================
  // FETCH DATA
  // =========================

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(`${API}/${endpoint}/`, {
        headers: authHeaders(),
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setter(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(`Error loading ${endpoint}:`, error);
    }
  };

  const loadAllData = async () => {
    if (!token) return;

    setLoading(true);

    await Promise.all([
      fetchData("vendors", setVendors),
      fetchData("zones", setZones),
      fetchData("documents", setDocuments),
      fetchData("permits", setPermits),
      fetchData("fees", setFees),
      fetchData("payments", setPayments),
      fetchData("complaints", setComplaints),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  // =========================
  // HELPER FUNCTIONS
  // =========================

  const getVendorName = (vendorId) => {
    const vendor = vendors.find((v) => v.id === Number(vendorId));
    return vendor ? vendor.full_name : "-";
  };

  const getZoneName = (zoneId) => {
    const zone = zones.find((z) => z.id === Number(zoneId));
    return zone ? zone.zone_name : "-";
  };

  const getPermitNumber = (permitId) => {
    const permit = permits.find((p) => p.id === Number(permitId));
    return permit ? permit.permit_number : "-";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  };

  const getDocumentUrl = (file) => {
    if (!file) return "";

    if (file.startsWith("http://") || file.startsWith("https://")) {
      return file;
    }

    if (file.startsWith("/media/")) {
      return `${BACKEND}${file}`;
    }

    if (file.startsWith("/documents/")) {
      return `${BACKEND}/media${file}`;
    }

    if (file.startsWith("documents/")) {
      return `${BACKEND}/media/${file}`;
    }

    return `${BACKEND}${file.startsWith("/") ? "" : "/"}${file}`;
  };

  // ============================================================
  // VENDOR CRUD
  // ============================================================

  const openAddVendorForm = () => {
    setEditingVendor(null);
    setVendorForm(emptyVendor);
    setShowVendorForm(true);
  };

  const openEditVendorForm = (vendor) => {
    setEditingVendor(vendor);

    setVendorForm({
      vendor_code: vendor.vendor_code || "",
      full_name: vendor.full_name || "",
      mobile: vendor.mobile || "",
      email: vendor.email || "",
      address: vendor.address || "",
      business_type: vendor.business_type || "",
      status: vendor.status || "Pending",
    });

    setShowVendorForm(true);
  };

  const handleVendorFormChange = (e) => {
    setVendorForm({
      ...vendorForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingVendor
        ? `${API}/vendors/${editingVendor.id}/`
        : `${API}/vendors/`;

      const method = editingVendor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorForm),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(JSON.stringify(data));
        return;
      }

      alert(
        editingVendor
          ? "Vendor updated successfully!"
          : "Vendor added successfully!"
      );

      setShowVendorForm(false);
      setEditingVendor(null);
      setVendorForm(emptyVendor);

      await fetchData("vendors", setVendors);
    } catch (error) {
      alert("Error saving vendor.");
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/vendors/${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        alert("Unable to delete vendor.");
        return;
      }

      alert("Vendor deleted successfully!");

      await fetchData("vendors", setVendors);
      await fetchData("permits", setPermits);
    } catch (error) {
      alert("Error deleting vendor.");
    }
  };

  // ============================================================
  // PERMIT CRUD
  // ============================================================

  const openAddPermitForm = () => {
    setEditingPermit(null);
    setPermitForm(emptyPermit);
    setShowPermitForm(true);
  };

  const openEditPermitForm = (permit) => {
    setEditingPermit(permit);

    setPermitForm({
      permit_number: permit.permit_number || "",
      vendor: permit.vendor || "",
      zone: permit.zone || "",
      issue_date: permit.issue_date || "",
      expiry_date: permit.expiry_date || "",
      status: permit.status || "Active",
    });

    setShowPermitForm(true);
  };

  const handlePermitFormChange = (e) => {
    setPermitForm({
      ...permitForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePermitSubmit = async (e) => {
    e.preventDefault();

    const body = {
      permit_number: permitForm.permit_number,
      vendor: Number(permitForm.vendor),
      zone: permitForm.zone ? Number(permitForm.zone) : null,
      issue_date: permitForm.issue_date,
      expiry_date: permitForm.expiry_date,
      status: permitForm.status,
    };

    try {
      const url = editingPermit
        ? `${API}/permits/${editingPermit.id}/`
        : `${API}/permits/`;

      const method = editingPermit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(JSON.stringify(data));
        return;
      }

      alert(
        editingPermit
          ? "Permit updated successfully!"
          : "Permit added successfully!"
      );

      setShowPermitForm(false);
      setEditingPermit(null);
      setPermitForm(emptyPermit);

      await fetchData("permits", setPermits);
    } catch (error) {
      alert("Error saving permit.");
    }
  };

  const handleDeletePermit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this permit?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/permits/${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        alert("Unable to delete permit.");
        return;
      }

      alert("Permit deleted successfully!");

      await fetchData("permits", setPermits);
    } catch (error) {
      alert("Error deleting permit.");
    }
  };

  // ============================================================
  // DOCUMENT CRUD
  // ============================================================

  const openAddDocumentForm = () => {
    setEditingDocument(null);

    setDocumentForm({
      vendor: "",
      document_type: "",
      document_file: null,
      verification_status: "Pending",
    });

    setShowDocumentForm(true);
  };

  const openEditDocumentForm = (document) => {
    setEditingDocument(document);

    setDocumentForm({
      vendor: document.vendor || "",
      document_type: document.document_type || "",
      document_file: null,
      verification_status:
        document.verification_status || "Pending",
    });

    setShowDocumentForm(true);
  };

  const handleDocumentFormChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "document_file") {
      setDocumentForm({
        ...documentForm,
        document_file: files && files.length > 0 ? files[0] : null,
      });
    } else {
      setDocumentForm({
        ...documentForm,
        [name]: value,
      });
    }
  };

  const handleDocumentSubmit = async (e) => {
    e.preventDefault();

    if (!documentForm.vendor) {
      alert("Please select a vendor.");
      return;
    }

    if (!documentForm.document_type) {
      alert("Please select a document type.");
      return;
    }

    if (!editingDocument && !documentForm.document_file) {
      alert("Please select a document file.");
      return;
    }

    const formData = new FormData();

    formData.append("vendor", documentForm.vendor);
    formData.append("document_type", documentForm.document_type);
    formData.append(
      "verification_status",
      documentForm.verification_status
    );

    if (documentForm.document_file) {
      formData.append(
        "document_file",
        documentForm.document_file
      );
    }

    try {
      const url = editingDocument
        ? `${API}/documents/${editingDocument.id}/`
        : `${API}/documents/`;

      const method = editingDocument ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        alert(
          typeof data === "object"
            ? JSON.stringify(data)
            : "Unable to save document."
        );
        return;
      }

      alert(
        editingDocument
          ? "Document updated successfully!"
          : "Document uploaded successfully!"
      );

      setShowDocumentForm(false);
      setEditingDocument(null);

      setDocumentForm({
        vendor: "",
        document_type: "",
        document_file: null,
        verification_status: "Pending",
      });

      await fetchData("documents", setDocuments);
    } catch (error) {
      console.error(error);
      alert("Error saving document.");
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/documents/${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) {
        alert("Unable to delete document.");
        return;
      }

      alert("Document deleted successfully!");

      await fetchData("documents", setDocuments);
    } catch (error) {
      alert("Error deleting document.");
    }
  };

  // ============================================================
  // LOGIN PAGE
  // ============================================================

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#eef4fb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: "380px",
            background: "white",
            padding: "35px",
            borderRadius: "12px",
            boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
          }}
        >
          <h1
            style={{
              color: "#174b85",
              marginBottom: "5px",
            }}
          >
            Street Vendor
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: "30px",
            }}
          >
            Permit Management
          </p>

          <label style={labelStyle}>Username</label>

          <input
            type="text"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            style={{
              ...inputStyle,
              marginBottom: "18px",
            }}
            required
          />

          <label style={labelStyle}>Password</label>

          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            style={{
              ...inputStyle,
              marginBottom: "20px",
            }}
            required
          />

          {loginError && (
            <div
              style={{
                color: "#dc2626",
                background: "#fee2e2",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "15px",
              }}
            >
              {loginError}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...buttonStyle,
              width: "100%",
            }}
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  // ============================================================
  // SIDEBAR
  // ============================================================

  const menuItems = [
    ["Dashboard", "📊"],
    ["Vendors", "👤"],
    ["Permits", "📄"],
    ["Documents", "📁"],
    ["Zones", "📍"],
    ["Fees", "💰"],
    ["Payments", "💳"],
    ["Complaints", "⚠️"],
    ["Reports", "📈"],
    ["GIS Map", "🗺️"],
  ];

  // ============================================================
  // DASHBOARD
  // ============================================================

  const DashboardPage = () => {
    const activePermits = permits.filter(
      (p) => p.status === "Active"
    ).length;

    const pendingFees = fees.filter(
      (f) => f.status === "Pending"
    ).length;

    const openComplaints = complaints.filter(
      (c) => c.status === "Open"
    ).length;

    const verifiedDocuments = documents.filter(
      (d) => d.verification_status === "Verified"
    ).length;

    const cards = [
      ["Total Vendors", vendors.length, "👤"],
      ["Total Permits", permits.length, "📄"],
      ["Active Permits", activePermits, "✅"],
      ["Total Zones", zones.length, "📍"],
      ["Documents", documents.length, "📁"],
      ["Verified Documents", verifiedDocuments, "✔️"],
      ["Pending Fees", pendingFees, "💰"],
      ["Open Complaints", openComplaints, "⚠️"],
    ];

    return (
      <>
        <PageHeader title="Dashboard" />

        <div
          style={{
            padding: "30px",
          }}
        >
          <h1
            style={{
              color: "#174b85",
            }}
          >
            Street Vendor Permit Dashboard
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginTop: "25px",
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
                  borderLeft: "5px solid #174b85",
                }}
              >
                <div style={{ fontSize: "30px" }}>
                  {card[2]}
                </div>

                <h3
                  style={{
                    color: "#64748b",
                  }}
                >
                  {card[0]}
                </h3>

                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#174b85",
                  }}
                >
                  {card[1]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // PAGE HEADER
  // ============================================================

  const PageHeader = ({ title }) => (
    <div
      style={{
        height: "72px",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h1
        style={{
          color: "#174b85",
          margin: 0,
        }}
      >
        {title}
      </h1>

      <strong
        style={{
          color: "#475569",
        }}
      >
        Welcome, {username}
      </strong>
    </div>
  );

  // ============================================================
  // VENDORS PAGE
  // ============================================================

  const VendorsPage = () => {
    const filteredVendors = vendors.filter((vendor) => {
      const search = vendorSearch.toLowerCase();

      return (
        vendor.vendor_code?.toLowerCase().includes(search) ||
        vendor.full_name?.toLowerCase().includes(search) ||
        vendor.mobile?.toLowerCase().includes(search) ||
        vendor.business_type?.toLowerCase().includes(search)
      );
    });

    return (
      <>
        <PageHeader title="Vendors" />

        <div style={{ padding: "30px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h1 style={{ color: "#174b85" }}>
              Vendor Management
            </h1>

            <button
              style={addButtonStyle}
              onClick={openAddVendorForm}
            >
              + Add Vendor
            </button>
          </div>

          <input
            type="text"
            placeholder="Search vendors..."
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            style={{
              ...inputStyle,
              width: "420px",
              marginBottom: "25px",
            }}
          />

          {showVendorForm && (
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "25px",
                boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#174b85" }}>
                {editingVendor
                  ? "Edit Vendor"
                  : "Add New Vendor"}
              </h2>

              <form onSubmit={handleVendorSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "18px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      Vendor Code *
                    </label>

                    <input
                      name="vendor_code"
                      value={vendorForm.vendor_code}
                      onChange={handleVendorFormChange}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Full Name *
                    </label>

                    <input
                      name="full_name"
                      value={vendorForm.full_name}
                      onChange={handleVendorFormChange}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Mobile *
                    </label>

                    <input
                      name="mobile"
                      value={vendorForm.mobile}
                      onChange={handleVendorFormChange}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={vendorForm.email}
                      onChange={handleVendorFormChange}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Business Type *
                    </label>

                    <input
                      name="business_type"
                      value={vendorForm.business_type}
                      onChange={handleVendorFormChange}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Status
                    </label>

                    <select
                      name="status"
                      value={vendorForm.status}
                      onChange={handleVendorFormChange}
                      style={inputStyle}
                    >
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>
                      Address *
                    </label>

                    <textarea
                      name="address"
                      value={vendorForm.address}
                      onChange={handleVendorFormChange}
                      style={{
                        ...inputStyle,
                        minHeight: "90px",
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <button type="submit" style={buttonStyle}>
                    {editingVendor
                      ? "Update Vendor"
                      : "Save Vendor"}
                  </button>

                  <button
                    type="button"
                    style={cancelButtonStyle}
                    onClick={() => {
                      setShowVendorForm(false);
                      setEditingVendor(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              overflowX: "auto",
              boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#174b85",
                    color: "white",
                  }}
                >
                  {[
                    "ID",
                    "Vendor Code",
                    "Full Name",
                    "Mobile",
                    "Email",
                    "Business Type",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "15px",
                        textAlign: "left",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td style={tdStyle}>{vendor.id}</td>
                    <td style={tdStyle}>
                      {vendor.vendor_code}
                    </td>
                    <td style={tdStyle}>
                      {vendor.full_name}
                    </td>
                    <td style={tdStyle}>
                      {vendor.mobile}
                    </td>
                    <td style={tdStyle}>
                      {vendor.email || "-"}
                    </td>
                    <td style={tdStyle}>
                      {vendor.business_type}
                    </td>

                    <td style={tdStyle}>
                      <StatusBadge
                        status={vendor.status}
                      />
                    </td>

                    <td style={tdStyle}>
                      <button
                        style={editButtonStyle}
                        onClick={() =>
                          openEditVendorForm(vendor)
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={deleteButtonStyle}
                        onClick={() =>
                          handleDeleteVendor(vendor.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // PERMITS PAGE
  // ============================================================

  const PermitsPage = () => {
    const filteredPermits = permits.filter((permit) => {
      const search = permitSearch.toLowerCase();

      return (
        permit.permit_number
          ?.toLowerCase()
          .includes(search) ||
        getVendorName(permit.vendor)
          .toLowerCase()
          .includes(search) ||
        permit.status?.toLowerCase().includes(search)
      );
    });

    return (
      <>
        <PageHeader title="Permits" />

        <div style={{ padding: "30px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "#174b85" }}>
              Permit Management
            </h1>

            <button
              style={addButtonStyle}
              onClick={openAddPermitForm}
            >
              + Add Permit
            </button>
          </div>

          <input
            type="text"
            placeholder="Search permits..."
            value={permitSearch}
            onChange={(e) =>
              setPermitSearch(e.target.value)
            }
            style={{
              ...inputStyle,
              width: "420px",
              margin: "20px 0",
            }}
          />

          {showPermitForm && (
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                marginBottom: "25px",
              }}
            >
              <h2 style={{ color: "#174b85" }}>
                {editingPermit
                  ? "Edit Permit"
                  : "Add New Permit"}
              </h2>

              <form onSubmit={handlePermitSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "18px",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      Permit Number *
                    </label>

                    <input
                      name="permit_number"
                      value={permitForm.permit_number}
                      onChange={handlePermitFormChange}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Vendor *
                    </label>

                    <select
                      name="vendor"
                      value={permitForm.vendor}
                      onChange={handlePermitFormChange}
                      style={inputStyle}
                      required
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

                  <div>
                    <label style={labelStyle}>
                      Zone
                    </label>

                    <select
                      name="zone"
                      value={permitForm.zone}
                      onChange={handlePermitFormChange}
                      style={inputStyle}
                    >
                      <option value="">
                        Select Zone
                      </option>

                      {zones.map((zone) => (
                        <option
                          key={zone.id}
                          value={zone.id}
                        >
                          {zone.zone_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Status
                    </label>

                    <select
                      name="status"
                      value={permitForm.status}
                      onChange={handlePermitFormChange}
                      style={inputStyle}
                    >
                      <option>Active</option>
                      <option>Expired</option>
                      <option>Renewed</option>
                      <option>Pending</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Issue Date *
                    </label>

                    <input
                      type="date"
                      name="issue_date"
                      value={permitForm.issue_date}
                      onChange={handlePermitFormChange}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Expiry Date *
                    </label>

                    <input
                      type="date"
                      name="expiry_date"
                      value={permitForm.expiry_date}
                      onChange={handlePermitFormChange}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <button
                    type="submit"
                    style={buttonStyle}
                  >
                    {editingPermit
                      ? "Update Permit"
                      : "Save Permit"}
                  </button>

                  <button
                    type="button"
                    style={cancelButtonStyle}
                    onClick={() => {
                      setShowPermitForm(false);
                      setEditingPermit(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#174b85",
                    color: "white",
                  }}
                >
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Permit Number</th>
                  <th style={thStyle}>Vendor</th>
                  <th style={thStyle}>Zone</th>
                  <th style={thStyle}>Issue Date</th>
                  <th style={thStyle}>Expiry Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPermits.map((permit) => (
                  <tr key={permit.id}>
                    <td style={tdStyle}>{permit.id}</td>

                    <td style={tdStyle}>
                      {permit.permit_number}
                    </td>

                    <td style={tdStyle}>
                      {getVendorName(permit.vendor)}
                    </td>

                    <td style={tdStyle}>
                      {getZoneName(permit.zone)}
                    </td>

                    <td style={tdStyle}>
                      {permit.issue_date}
                    </td>

                    <td style={tdStyle}>
                      {permit.expiry_date}
                    </td>

                    <td style={tdStyle}>
                      <StatusBadge
                        status={permit.status}
                      />
                    </td>

                    <td style={tdStyle}>
                      <button
                        style={editButtonStyle}
                        onClick={() =>
                          openEditPermitForm(permit)
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={deleteButtonStyle}
                        onClick={() =>
                          handleDeletePermit(permit.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // DOCUMENTS PAGE
  // ============================================================

  const DocumentsPage = () => {
    const filteredDocuments = documents.filter(
      (document) => {
        const search = documentSearch.toLowerCase();

        return (
          getVendorName(document.vendor)
            .toLowerCase()
            .includes(search) ||
          document.document_type
            ?.toLowerCase()
            .includes(search) ||
          document.verification_status
            ?.toLowerCase()
            .includes(search)
        );
      }
    );

    return (
      <>
        <PageHeader title="Documents" />

        <div style={{ padding: "30px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div>
              <h1
                style={{
                  color: "#174b85",
                  marginBottom: "5px",
                }}
              >
                Document Management
              </h1>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Upload and manage vendor documents.
              </p>
            </div>

            <button
              style={addButtonStyle}
              onClick={openAddDocumentForm}
            >
              + Add Document
            </button>
          </div>

          <input
            type="text"
            placeholder="Search documents..."
            value={documentSearch}
            onChange={(e) =>
              setDocumentSearch(e.target.value)
            }
            style={{
              ...inputStyle,
              width: "420px",
              margin: "20px 0",
            }}
          />

          {/* DOCUMENT FORM */}

          {showDocumentForm && (
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                boxShadow:
                  "0 3px 15px rgba(0,0,0,0.1)",
                marginBottom: "25px",
              }}
            >
              <h2
                style={{
                  color: "#174b85",
                  marginTop: 0,
                }}
              >
                {editingDocument
                  ? "Edit Document"
                  : "Upload New Document"}
              </h2>

              <form onSubmit={handleDocumentSubmit}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, 1fr)",
                    gap: "22px",
                  }}
                >
                  {/* Vendor */}

                  <div>
                    <label style={labelStyle}>
                      Vendor *
                    </label>

                    <select
                      name="vendor"
                      value={documentForm.vendor}
                      onChange={handleDocumentFormChange}
                      style={inputStyle}
                      required
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

                  {/* Document Type */}

                  <div>
                    <label style={labelStyle}>
                      Document Type *
                    </label>

                    <select
                      name="document_type"
                      value={
                        documentForm.document_type
                      }
                      onChange={handleDocumentFormChange}
                      style={inputStyle}
                      required
                    >
                      <option value="">
                        Select Document Type
                      </option>

                      <option value="Aadhaar Card">
                        Aadhaar Card
                      </option>

                      <option value="PAN Card">
                        PAN Card
                      </option>

                      <option value="Address Proof">
                        Address Proof
                      </option>

                      <option value="Business License">
                        Business License
                      </option>

                      <option value="Shop Certificate">
                        Shop Certificate
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* File */}

                  <div>
                    <label style={labelStyle}>
                      Document File{" "}
                      {!editingDocument && "*"}
                    </label>

                    <input
                      type="file"
                      name="document_file"
                      onChange={handleDocumentFormChange}
                      style={{
                        ...inputStyle,
                        padding: "9px",
                      }}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />

                    {editingDocument && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "6px",
                          color: "#64748b",
                        }}
                      >
                        Leave empty if you do not want
                        to replace the existing file.
                      </small>
                    )}
                  </div>

                  {/* Verification */}

                  <div>
                    <label style={labelStyle}>
                      Verification Status
                    </label>

                    <select
                      name="verification_status"
                      value={
                        documentForm.verification_status
                      }
                      onChange={handleDocumentFormChange}
                      style={inputStyle}
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

                <div
                  style={{
                    marginTop: "25px",
                  }}
                >
                  <button
                    type="submit"
                    style={buttonStyle}
                  >
                    {editingDocument
                      ? "Update Document"
                      : "Upload Document"}
                  </button>

                  <button
                    type="button"
                    style={cancelButtonStyle}
                    onClick={() => {
                      setShowDocumentForm(false);
                      setEditingDocument(null);

                      setDocumentForm({
                        vendor: "",
                        document_type: "",
                        document_file: null,
                        verification_status:
                          "Pending",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DOCUMENT TABLE */}

          <div
            style={{
              background: "white",
              borderRadius: "12px",
              overflowX: "auto",
              boxShadow:
                "0 3px 15px rgba(0,0,0,0.08)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#174b85",
                    color: "white",
                  }}
                >
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Vendor</th>
                  <th style={thStyle}>
                    Document Type
                  </th>
                  <th style={thStyle}>
                    Verification
                  </th>
                  <th style={thStyle}>
                    Uploaded At
                  </th>
                  <th style={thStyle}>
                    Document
                  </th>
                  <th style={thStyle}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "30px",
                        textAlign: "center",
                        color: "#64748b",
                      }}
                    >
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((document) => (
                    <tr key={document.id}>
                      <td style={tdStyle}>
                        {document.id}
                      </td>

                      <td style={tdStyle}>
                        {getVendorName(
                          document.vendor
                        )}
                      </td>

                      <td style={tdStyle}>
                        {document.document_type}
                      </td>

                      <td style={tdStyle}>
                        <StatusBadge
                          status={
                            document.verification_status
                          }
                        />
                      </td>

                      <td style={tdStyle}>
                        {formatDate(
                          document.uploaded_at
                        )}
                      </td>

                      <td style={tdStyle}>
                        {document.document_file ? (
                          <a
                            href={getDocumentUrl(
                              document.document_file
                            )}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#174b85",
                              fontWeight: "bold",
                              textDecoration:
                                "none",
                            }}
                          >
                            View
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td style={tdStyle}>
                        <button
                          style={editButtonStyle}
                          onClick={() =>
                            openEditDocumentForm(
                              document
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          style={deleteButtonStyle}
                          onClick={() =>
                            handleDeleteDocument(
                              document.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // ZONES PAGE
  // ============================================================

  const ZonesPage = () => (
    <>
      <PageHeader title="Zones" />

      <div style={{ padding: "30px" }}>
        <h1 style={{ color: "#174b85" }}>
          Zone Management
        </h1>

        <Table
          headers={[
            "ID",
            "Zone Code",
            "Zone Name",
            "Location",
            "Capacity",
            "Status",
          ]}
          rows={zones.map((zone) => [
            zone.id,
            zone.zone_code,
            zone.zone_name,
            zone.location,
            zone.capacity,
            zone.status,
          ])}
        />
      </div>
    </>
  );

  // ============================================================
  // FEES PAGE
  // ============================================================

  const FeesPage = () => (
    <>
      <PageHeader title="Fees" />

      <div style={{ padding: "30px" }}>
        <h1 style={{ color: "#174b85" }}>
          Fee Management
        </h1>

        <Table
          headers={[
            "ID",
            "Permit",
            "Amount",
            "Fee Type",
            "Due Date",
            "Status",
          ]}
          rows={fees.map((fee) => [
            fee.id,
            getPermitNumber(fee.permit),
            `₹${fee.amount}`,
            fee.fee_type,
            fee.due_date,
            fee.status,
          ])}
        />
      </div>
    </>
  );

  // ============================================================
  // PAYMENTS PAGE
  // ============================================================

  const PaymentsPage = () => (
    <>
      <PageHeader title="Payments" />

      <div style={{ padding: "30px" }}>
        <h1 style={{ color: "#174b85" }}>
          Payment & Receipt Management
        </h1>

        <Table
          headers={[
            "ID",
            "Payment Number",
            "Vendor",
            "Permit",
            "Amount",
            "Method",
            "Status",
            "Receipt",
          ]}
          rows={payments.map((payment) => [
            payment.id,
            payment.payment_number,
            getVendorName(payment.vendor),
            getPermitNumber(payment.permit),
            `₹${payment.amount}`,
            payment.payment_method,
            payment.status,
            payment.receipt_number,
          ])}
        />
      </div>
    </>
  );

  // ============================================================
  // COMPLAINTS PAGE
  // ============================================================

  const ComplaintsPage = () => (
    <>
      <PageHeader title="Complaints" />

      <div style={{ padding: "30px" }}>
        <h1 style={{ color: "#174b85" }}>
          Complaint Management
        </h1>

        <Table
          headers={[
            "ID",
            "Vendor",
            "Subject",
            "Description",
            "Status",
            "Created",
          ]}
          rows={complaints.map((complaint) => [
            complaint.id,
            getVendorName(complaint.vendor),
            complaint.subject,
            complaint.description,
            complaint.status,
            formatDate(complaint.created_at),
          ])}
        />
      </div>
    </>
  );

  // ============================================================
  // REPORTS PAGE
  // ============================================================

  const ReportsPage = () => {
    const totalFeeAmount = fees.reduce(
      (sum, fee) =>
        sum + Number(fee.amount || 0),
      0
    );

    const totalPaymentAmount = payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

    const activePermits = permits.filter(
      (p) => p.status === "Active"
    ).length;

    const pendingFees = fees.filter(
      (f) => f.status === "Pending"
    ).length;

    const paidFees = fees.filter(
      (f) => f.status === "Paid"
    ).length;

    const openComplaints = complaints.filter(
      (c) => c.status === "Open"
    ).length;

    const resolvedComplaints = complaints.filter(
      (c) => c.status === "Resolved"
    ).length;

    const verifiedDocuments = documents.filter(
      (d) => d.verification_status === "Verified"
    ).length;

    return (
      <>
        <PageHeader title="Reports" />

        <div style={{ padding: "30px" }}>
          <h1 style={{ color: "#174b85" }}>
            Reports & Dashboard
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
              marginTop: "25px",
            }}
          >
            <ReportCard
              title="Total Vendors"
              value={vendors.length}
            />

            <ReportCard
              title="Total Permits"
              value={permits.length}
            />

            <ReportCard
              title="Active Permits"
              value={activePermits}
            />

            <ReportCard
              title="Total Zones"
              value={zones.length}
            />

            <ReportCard
              title="Total Fee Amount"
              value={`₹${totalFeeAmount}`}
            />

            <ReportCard
              title="Pending Fees"
              value={pendingFees}
            />

            <ReportCard
              title="Paid Fees"
              value={paidFees}
            />

            <ReportCard
              title="Total Payments"
              value={payments.length}
            />

            <ReportCard
              title="Payment Amount"
              value={`₹${totalPaymentAmount}`}
            />

            <ReportCard
              title="Open Complaints"
              value={openComplaints}
            />

            <ReportCard
              title="Resolved Complaints"
              value={resolvedComplaints}
            />

            <ReportCard
              title="Verified Documents"
              value={verifiedDocuments}
            />
          </div>
        </div>
      </>
    );
  };

  // ============================================================
  // GIS MAP
  // ============================================================

  const GISPage = () => (
    <>
      <PageHeader title="GIS Map" />

      <div style={{ padding: "30px" }}>
        <h1 style={{ color: "#174b85" }}>
          Vendor Zone Map
        </h1>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            marginTop: "20px",
          }}
        >
          <MapView />
        </div>
      </div>
    </>
  );

  // ============================================================
  // SIMPLE TABLE
  // ============================================================

  const Table = ({ headers, rows }) => (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        overflowX: "auto",
        marginTop: "25px",
        boxShadow:
          "0 3px 15px rgba(0,0,0,0.08)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#174b85",
              color: "white",
            }}
          >
            {headers.map((header) => (
              <th key={header} style={thStyle}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                No data found.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={tdStyle}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // ============================================================
  // REPORT CARD
  // ============================================================

  const ReportCard = ({ title, value }) => (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow:
          "0 3px 12px rgba(0,0,0,0.08)",
        borderLeft: "5px solid #174b85",
      }}
    >
      <div
        style={{
          color: "#64748b",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color: "#174b85",
        }}
      >
        {value}
      </div>
    </div>
  );

  // ============================================================
  // STATUS BADGE
  // ============================================================

  const StatusBadge = ({ status }) => {
    let background = "#fef3c7";
    let color = "#92400e";

    if (
      status === "Approved" ||
      status === "Active" ||
      status === "Verified" ||
      status === "Paid" ||
      status === "Resolved"
    ) {
      background = "#dcfce7";
      color = "#166534";
    }

    if (
      status === "Rejected" ||
      status === "Expired"
    ) {
      background = "#fee2e2";
      color = "#991b1b";
    }

    return (
      <span
        style={{
          display: "inline-block",
          padding: "6px 12px",
          borderRadius: "20px",
          background,
          color,
          fontWeight: "bold",
          fontSize: "13px",
        }}
      >
        {status}
      </span>
    );
  };

  // ============================================================
  // MAIN PAGE
  // ============================================================

  let content;

  switch (page) {
    case "Dashboard":
      content = <DashboardPage />;
      break;

    case "Vendors":
      content = <VendorsPage />;
      break;

    case "Permits":
      content = <PermitsPage />;
      break;

    case "Documents":
      content = <DocumentsPage />;
      break;

    case "Zones":
      content = <ZonesPage />;
      break;

    case "Fees":
      content = <FeesPage />;
      break;

    case "Payments":
      content = <PaymentsPage />;
      break;

    case "Complaints":
      content = <ComplaintsPage />;
      break;

    case "Reports":
      content = <ReportsPage />;
      break;

    case "GIS Map":
      content = <GISPage />;
      break;

    default:
      content = <DashboardPage />;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#eef4fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
          width: "290px",
          background: "#123f70",
          color: "white",
          minHeight: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            padding: "30px 22px",
            borderBottom:
              "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "25px",
            }}
          >
            Street Vendor
          </h2>

          <div
            style={{
              marginTop: "5px",
              opacity: 0.8,
            }}
          >
            Permit Management
          </div>
        </div>

        <div style={{ padding: "18px 12px" }}>
          {menuItems.map(([name, icon]) => (
            <button
              key={name}
              onClick={() => {
                setPage(name);

                setShowVendorForm(false);
                setShowPermitForm(false);
                setShowDocumentForm(false);
              }}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                color: "white",
                background:
                  page === name
                    ? "#2563eb"
                    : "transparent",
                padding: "13px 18px",
                marginBottom: "7px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight:
                  page === name
                    ? "bold"
                    : "normal",
              }}
            >
              <span
                style={{
                  marginRight: "10px",
                }}
              >
                {icon}
              </span>

              {name}
            </button>
          ))}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "13px",
              background: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "25px",
            left: "22px",
            right: "22px",
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          Logged in as:
          <strong
            style={{
              display: "block",
              marginTop: "5px",
              opacity: 1,
            }}
          >
            {username}
          </strong>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main
        style={{
          marginLeft: "290px",
          width: "calc(100% - 290px)",
          minHeight: "100vh",
        }}
      >
        {loading && (
          <div
            style={{
              background: "#dbeafe",
              padding: "8px 20px",
              color: "#1e40af",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Loading data...
          </div>
        )}

        {content}
      </main>
    </div>
  );
}

// ============================================================
// GLOBAL TABLE STYLES
// ============================================================

const thStyle = {
  padding: "15px",
  textAlign: "left",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 15px",
  borderBottom: "1px solid #e2e8f0",
  color: "#1e3a5f",
  whiteSpace: "nowrap",
};