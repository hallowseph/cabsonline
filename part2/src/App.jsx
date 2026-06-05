import { useState } from "react";
import BookingList from "./components/BookingList";
import CustomerLookup from "./components/CustomerLookup";
import MapView from "./components/MapView";
import PaymentPanel from "./components/PaymentPanel";
import "./dashboard.css";

export default function App() {
  const [view, setView] = useState("customer");
  const [activeTab, setActiveTab] = useState("booking");
  const [adminTab, setAdminTab] = useState("bookings");

  return (
    <div className={view === "admin" ? "app-dark" : "app-light"}>

      {/* ── CUSTOMER VIEW ── */}
      {view === "customer" && (
        <div className="customer-wrap">

          <header className="customer-header">
            <div className="customer-header-inner">
              <div className="logo">
                <span className="logo-cab">Cabs</span>
                <span className="logo-online">Online</span>
              </div>
              <p className="tagline">Your ride, on demand.</p>
              <button
                className="admin-link-btn"
                onClick={() => { setView("admin"); setAdminTab("bookings"); }}
              >
                Admin →
              </button>
            </div>
          </header>

          <nav className="customer-nav">
            <button
              className={`customer-tab ${activeTab === "booking" ? "customer-tab-active" : ""}`}
              onClick={() => setActiveTab("booking")}
            >
              🚕 Book a Taxi
            </button>
            <button
              className={`customer-tab ${activeTab === "payment" ? "customer-tab-active" : ""}`}
              onClick={() => setActiveTab("payment")}
            >
              💳 Payment
            </button>
          </nav>

          <main className="customer-main">
            {activeTab === "booking" && (
              <iframe
                src="/booking-embed.html"
                title="Book a Taxi"
                style={{
                  width: "100%",
                  height: "620px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#ffffff",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                }}
              />
            )}
            {activeTab === "payment" && <PaymentPanel />}
          </main>
        </div>
      )}

      {/* ── ADMIN VIEW ── */}
      {view === "admin" && (
        <div className="admin-wrap">

          <header className="admin-header">
            <div className="admin-header-inner">
              <div className="admin-logo">
                <span className="logo-cab">Cabs</span>
                <span className="logo-online">Online</span>
                <span className="admin-badge">Admin</span>
              </div>
              <button
                className="customer-link-btn"
                onClick={() => { setView("customer"); setActiveTab("booking"); }}
              >
                ← Customer View
              </button>
            </div>

            <nav className="admin-nav">
              {[
                { id: "bookings",   label: "Driver Query"    },
                { id: "lookup",     label: "Customer Lookup" },
                { id: "map",        label: "Map View"        },
                { id: "adminpanel", label: "Admin Panel"     },
              ].map(t => (
                <button
                  key={t.id}
                  className={`admin-tab ${adminTab === t.id ? "admin-tab-active" : ""}`}
                  onClick={() => setAdminTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </header>

          <main className="admin-main">
            {adminTab === "bookings"   && <BookingList />}
            {adminTab === "lookup"     && <CustomerLookup />}
            {adminTab === "map"        && <MapView />}
            {adminTab === "adminpanel" && (
              <iframe
                src="/admin-embed.html"
                title="Admin Panel"
                style={{
                  width: "100%",
                  height: "700px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#0d0d1a"
                }}
              />
            )}
          </main>
        </div>
      )}

    </div>
  );
}
