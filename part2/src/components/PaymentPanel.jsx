import { useState } from "react";
import useBookings from "../hooks/useBookings";

export default function PaymentPanel() {
  const { bookings, loading, error } = useBookings();
  const [reference, setReference] = useState("");
  const [foundBooking, setFoundBooking] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paid, setPaid] = useState(false);
  const [payError, setPayError] = useState("");

  function handleSearch() {
    const trimmed = reference.trim().toUpperCase();
    if (trimmed === "") {
      setSearchError("Please enter a booking reference number.");
      setFoundBooking(null);
      return;
    }
    const found = bookings.find(b => b.reference === trimmed);
    if (!found) {
      setSearchError("No booking found for: " + trimmed);
      setFoundBooking(null);
      return;
    }
    if (found.status === "paid") {
      setSearchError("This booking has already been paid.");
      setFoundBooking(null);
      return;
    }
    setFoundBooking(found);
    setSearchError("");
    setPaid(false);
    setPayError("");
  }

  function handlePayment() {
    if (cardName.trim() === "") { alert("Please enter the name on card."); return; }
    if (cardNumber.trim().length < 16) { alert("Please enter a valid 16-digit card number."); return; }
    if (expiry.trim() === "") { alert("Please enter the expiry date."); return; }
    if (cvv.trim().length < 3) { alert("Please enter a valid CVV."); return; }

    fetch("/payment.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: foundBooking.reference })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        setPaid(true);
      } else {
        setPayError("Payment failed: " + data.message);
      }
    })
    .catch(err => {
      setPayError("Connection error: " + err.message);
    });
  }

  if (loading) return <p className="msg-muted">Loading...</p>;
  if (error)   return <p className="msg-error">{error}</p>;

  return (
    <div className="card">
      <h2 className="section-title">Pay for Your Ride</h2>
      <p className="section-desc">Enter your booking reference to complete payment.</p>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="e.g. BRN00001"
          value={reference}
          onChange={e => setReference(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Find Booking</button>
      </div>

      {searchError && <p className="msg-error">{searchError}</p>}

      {foundBooking && !paid && (
        <div className="detail-card">
          <h3>{foundBooking.reference}</h3>

          <div className="detail-row">
            <span className="detail-label">Customer</span>
            <span>{foundBooking.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">From</span>
            <span>{foundBooking.suburb} → {foundBooking.dest_suburb}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date & Time</span>
            <span>{foundBooking.date} at {foundBooking.time}</span>
          </div>

          <hr className="divider" />
          <p style={{ fontWeight: 600, marginBottom: "14px", fontSize: "13px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Card Details
          </p>

          <div className="form-group">
            <label className="form-label">Name on Card</label>
            <input type="text" className="form-input" placeholder="e.g. Alice Johnson"
              value={cardName} onChange={e => setCardName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input type="text" className="form-input" placeholder="16-digit number"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expiry</label>
              <input type="text" className="form-input" placeholder="MM/YY"
                value={expiry}
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                  setExpiry(val);
                }} />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input type="text" className="form-input" placeholder="3 digits"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} />
            </div>
          </div>

          {payError && <p className="msg-error">{payError}</p>}

          <button className="btn-pay" onClick={handlePayment}>Pay Now</button>
        </div>
      )}

      {paid && (
        <div className="msg-success">
          <h3>🎉 Payment Successful!</h3>
          <p>Booking <strong>{foundBooking.reference}</strong> has been marked as paid.</p>
          <p style={{ marginTop: "4px" }}>Thank you, {foundBooking.name}. Have a great ride!</p>
        </div>
      )}
    </div>
  );
}
