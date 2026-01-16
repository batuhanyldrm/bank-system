import api from "../../services/api"

export const getAccounts = async () => {
  const response = await api.get("/accounts", {
    withCredentials: true,
  });
  return response.data;
};

export const postAccount = async (name) => {
  const response = await api.post(`/accounts`, {
    name
  });

  return response.data;
}