// useBookings.js
// Custom hook that fetches real bookings from the XAMPP backend.
// Returns { bookings, loading, error } to any component that needs it.

import { useState, useEffect } from "react";

export default function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/getbookings.php")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setBookings(data.bookings);
        } else {
          setError("Failed to load bookings: " + data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Connection error: " + err.message);
        setLoading(false);
      });
  }, []);

  return { bookings, loading, error };
}