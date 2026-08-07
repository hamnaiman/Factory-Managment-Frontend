import API from "./api";

// Save attendance
export const markAttendance = async (attendanceData) => {
  return await API.post("/attendance", attendanceData);
};

// Get today's attendance (optional, future use)
export const getAttendance = async () => {
  return await API.get("/attendance");
};

export const getAttendanceHistory = () =>
  API.get("/attendance/history");



export const getTodayAttendance = () => {
  return API.get("/attendance/today");
};

export const getAttendanceByDate = (date) =>
  API.get(`/attendance/${date}`);

