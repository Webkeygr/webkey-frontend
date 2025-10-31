// app/components/Maintenance.tsx
"use client";

export default function Maintenance() {
  return (
    <div className="maintenance-wrapper">
      <div className="maintenance-card">
        <h1>⚙️ Under maintenance</h1>
        <p>Δουλεύουμε πάνω στο νέο webkey.gr. Δοκίμασε ξανά σε λίγο.</p>
        <p className="maintenance-sub">
          Αν είσαι Webkey, άνοιξε το admin unlock URL.
        </p>
      </div>
    </div>
  );
}
