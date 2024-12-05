const GET_ACCESS_TOKEN = () => window.localStorage.getItem('token');
const SET_ACCESS_TOKEN = (token) => window.localStorage.setItem('token', token);

export { GET_ACCESS_TOKEN, SET_ACCESS_TOKEN };
