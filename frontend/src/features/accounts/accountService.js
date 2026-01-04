import api from "../../services/api"

export const getAccounts = async () => {
  const response = await api.get("/accounts", {
    withCredentials: true,
  });
  return response.data;
};