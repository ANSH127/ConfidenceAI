import React from "react";
import PersistentDrawerLeft from "../components/PersistentDrawerLeft";

export default function DashboardPage() {
  return (
    <div>
      <PersistentDrawerLeft>
        <div style={{ padding: 20 }}>
          <h1>Dashboard</h1>
          <p>Welcome to the dashboard!</p>
          <p>This is where you can view your data and analytics.</p>
        </div>
      </PersistentDrawerLeft>
    </div>
  );
}
