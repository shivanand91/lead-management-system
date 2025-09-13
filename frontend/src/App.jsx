// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from "react";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Loign";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import PrivateRoute from "./utils/PrivateRoute";
// import CreateEditLead from "./pages/CreateEditLead";

// import api from "./api/axios";

// export default function App() {
//   const [isAuthenticated, setAuth] = useState(false);

//   const handleLogout = async () => {
//     await api.post("/auth/logout");
//     setAuth(false);
//   };

//   return (
//     <Router>
//       <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login setAuth={setAuth} />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute isAuthenticated={isAuthenticated}>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route path="/leads/create" element={<CreateEditLead />} />
//         <Route path="/leads/edit/:id" element={<CreateEditLead />} />
//       </Routes>
//     </Router>
//   );
// }


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Loign";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEditLead from "./pages/CreateEditLead";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/create"
            element={
              <ProtectedRoute>
                <CreateEditLead />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/edit/:id"
            element={
              <ProtectedRoute>
                <CreateEditLead />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}



