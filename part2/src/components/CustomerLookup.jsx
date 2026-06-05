import { useState } from "react";
import useBookings from "../hooks/useBookings";

export default function CustomerLookup() {
  const { bookings, loading, error } = useBookings();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  function handleSearch() {
    const trimmed = query.trim().toUpperCase();
    if (trimmed === "") {
      setSearchError("Please enter a booking reference number.");
      setResult(null);
      return;
    }
    const found = bookings.find(b => b.reference === trimmed);
    if (found) {
      setResult(found);
      setSearchError("");
    } else {
      setResult(null);
      setSearchError("No booking found for reference: " + trimmed);
    }
  }

  if (loading) return <p className="msg-muted">Loading bookings...</p>;
  if (error)   return <p className="msg-error">{error}</p>;

  return (
    <div className="card">
      <h2 className="section-title">Customer Lookup</h2>
      <p className="section-desc">Search for a booking by reference number to view full details.</p>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="e.g. BRN00001"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {searchError && <p className="msg-error">{searchError}</p>}

      {result && (
        <div className="detail-card">
          <h3>{result.reference}</h3>

          <div className="detail-row">
            <span className="detail-label">Customer</span>
            <span>{result.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span>{result.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Pickup Address</span>
            <span>
              {result.unumber ? result.unumber + "/" : ""}
              {result.snumber} {result.stname}, {result.suburb}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Destination</span>
            <span>{result.dest_suburb}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <span>{result.date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time</span>
            <span>{result.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status</span>
            <span className={`badge badge-${result.status}`}>{result.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
