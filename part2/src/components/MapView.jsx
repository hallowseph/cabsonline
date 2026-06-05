import { useState } from "react";
import useBookings from "../hooks/useBookings";

export default function MapView() {
  const { bookings, loading, error } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState(null);

  function buildMapUrl(suburb) {
    return "https://www.google.com/maps/search/" +
      encodeURIComponent(suburb + " Auckland New Zealand");
  }

  if (loading) return <p className="msg-muted">Loading bookings...</p>;
  if (error)   return <p className="msg-error">{error}</p>;

  return (
    <div className="card">
      <h2 className="section-title">Map View</h2>
      <p className="section-desc">Select a booking to view the pickup location on Google Maps.</p>

      <div style={{ marginBottom: "20px" }}>
        {bookings.map(b => (
          <div
            key={b.reference}
            className={`booking-selector-item ${selectedBooking?.reference === b.reference ? "selected" : ""}`}
            onClick={() => setSelectedBooking(b)}
          >
            <strong style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>
              {b.reference}
            </strong>
            {" — "}
            {b.name}
            {" — Pickup: "}
            <em>{b.suburb}</em>
            <span
              className={`badge badge-${b.status}`}
              style={{ float: "right" }}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>

      {selectedBooking ? (
        <div className="detail-card">
          <h3>Pickup: {selectedBooking.suburb}</h3>
          <div className="detail-row">
            <span className="detail-label">Customer</span>
            <span>{selectedBooking.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span>{selectedBooking.snumber} {selectedBooking.stname}, {selectedBooking.suburb}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Destination</span>
            <span>{selectedBooking.dest_suburb}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`badge badge-${selectedBooking.status}`}>{selectedBooking.status}</span>
          </div>
          <div style={{ marginTop: "16px" }}>
            <a
              href={buildMapUrl(selectedBooking.suburb)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
              style={{ padding: "10px 20px", borderRadius: "8px" }}
            >
              View on Google Maps →
            </a>
          </div>
        </div>
      ) : (
        <p className="msg-muted">Click a booking above to view its location.</p>
      )}
    </div>
  );
}
