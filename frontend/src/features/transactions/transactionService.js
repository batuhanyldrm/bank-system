import api from "../../services/api"

export const getTransactions = async (id, params) => {
  const response = await api.get(`/transactions/account/${id}`, {
    params,
    withCredentials: true,
  });
  return response.data;
};

export const postTransaction = async (fromAccountNumber, toAccountNumber, amount, description) => {
  const response = await api.post(`/transactions/transfer`, {
    fromAccountNumber,
    toAccountNumber,
    amount,
    description
  });

  return response.data
}