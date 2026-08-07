import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// Pages & Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Labour from "./pages/Labour";
import LabourProfile from "./pages/LabourProfile";
import AttendanceHistory from "./pages/AttendanceHistory";
import Products from "./pages/Products";
import StockPage from "./pages/Stock";
import Payments from "./pages/Payments";
import Client from "./pages/Client";
import ClientProfile from "./pages/ClientProfile";
import Sales from "./pages/Sales";
import ProtectedRoute from "./components/ProtectedRoute";
import Production from "./pages/Production";
import Report from "./pages/Reports";

// Services & Redux Actions
import { getCurrentUser } from "./services/authService";
import { setUser, finishLoading } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        dispatch(setUser(response.data.data));
      } catch (error) {
        console.error(error);
        console.log("No Active Session");
        dispatch(finishLoading());
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/labour"
          element={
            <ProtectedRoute>
              <Labour />
            </ProtectedRoute>
          }
        />

        <Route
          path="/labour-profile/:id"
          element={
            <ProtectedRoute>
              <LabourProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-history"
          element={
            <ProtectedRoute>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stock"
          element={
            <ProtectedRoute>
              <StockPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Client />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client-profile/:id"
          element={
            <ProtectedRoute>
              <ClientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales />
            </ProtectedRoute>
          }
        />

        <Route
          path="/production"
          element={
            <ProtectedRoute>
              <Production />
            </ProtectedRoute>
          }
        />

        <Route
        path="/reports"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;