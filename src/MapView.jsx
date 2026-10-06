import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const zones = [
  {
    id: 1,
    code: "ZONE002",
    name: "Main Market Zone",
    location: "Main Market",
    latitude: 15.8497,
    longitude: 74.4977,
    status: "Full",
  },
  {
    id: 2,
    code: "ZONE003",
    name: "Central Market Zone",
    location: "Central Market",
    latitude: 15.8505,
    longitude: 74.501,
    status: "Available",
  },
  {
    id: 3,
    code: "ZONE004",
    name: "East Market Zone",
    location: "East Market",
    latitude: 15.8485,
    longitude: 74.505,
    status: "Available",
  },
];

function MapView() {
  return (
    <div style={{ width: "100%", marginTop: "20px" }}>
      <MapContainer
        center={[15.8497, 74.501]}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          height: "500px",
          width: "100%",
          minHeight: "500px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zones.map((zone) => (
          <Marker
            key={zone.id}
            position={[zone.latitude, zone.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div>
                <h3>{zone.name}</h3>

                <p>
                  <strong>Zone Code:</strong> {zone.code}
                </p>

                <p>
                  <strong>Location:</strong> {zone.location}
                </p>

                <p>
                  <strong>Status:</strong> {zone.status}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;