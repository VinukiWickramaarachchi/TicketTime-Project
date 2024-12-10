import React, { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VendorPanel from "./pages/VendorPanel";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <div>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : user.role === "vendor" ? (
        <VendorPanel user={user} />
      ) : (
        <>
          <Navbar />
          <Home user={user} />
        </>
      )}
    </div>
  );
}

export default App;
