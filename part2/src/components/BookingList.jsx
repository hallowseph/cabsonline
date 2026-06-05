import { useState } from "react";
import useBookings from "../hooks/useBookings";

export default function BookingList() {
  const { bookings, loading, error } = useBookings();
  const [filter, setFilter] = useState("all");

  const filters = ["all", "unassigned", "assigned", "paid"];

  const filtered = filter === "all"
    ? bookings
    : bookings.filter(b => b.status === filter);

  if (loading) return <p className="msg-muted">Loading bookings...</p>;
  if (error)   return <p className="msg-error">{error}</p>;

  return (
    <div className="card">
      <h2 className="section-title">Driver Query</h2>
      <p className="section-desc">View and filter all current bookings.</p>

      <div className="filter-bar">
        {filters.map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <p className="count-label">Showing {filtered.length} booking(s)</p>

      {filtered.length === 0 ? (
        <p className="msg-muted">No bookings found for this filter.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Pickup Suburb</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.reference}>
                <td className="mono">{b.reference}</td>
                <td>{b.name}</td>
                <td>{b.phone}</td>
                <td>{b.suburb}</td>
                <td>{b.dest_suburb}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
