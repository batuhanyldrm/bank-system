import api from "../../services/api"

export const getTransactions = async (id) => {
  const response = await api.get(`/transactions/account/${id}`, {
    withCredentials: true,
  });
  return response.data;
};