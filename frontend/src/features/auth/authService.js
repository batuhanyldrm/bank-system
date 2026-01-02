import api from "../../services/api"


export const loginRequest = async ({ email, password }) => {
    const resp = await api.post(`/auth/login`, {
        email,
        password
    });

    return resp.data
}