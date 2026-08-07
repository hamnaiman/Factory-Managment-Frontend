import API from "./api";

export const getLabourProfile = (id) =>
  API.get(`/labour-profile/${id}`);