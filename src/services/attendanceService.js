import API from "./api";

// =====================================================
// SAVE ATTENDANCE
// =====================================================

export const markAttendance = async (attendanceData) => {
  return await API.post("/attendance", attendanceData);
};

// =====================================================
// GET TODAY'S ATTENDANCE
// =====================================================

export const getTodayAttendance = async () => {
  return await API.get("/attendance/today");
};

// =====================================================
// GET ATTENDANCE HISTORY
// =====================================================

export const getAttendanceHistory = async () => {
  return await API.get("/attendance/history");
};

// =====================================================
// GET ATTENDANCE BY SELECTED DATE
// date format: YYYY-MM-DD
// =====================================================

export const getAttendanceByDate = async (date) => {
  return await API.get(`/attendance/${date}`);
};