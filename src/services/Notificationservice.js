import API from "./api";

export const getNotifications = async () => {
  const { data } = await API.get("/notifications");
  return data?.data || data;
};