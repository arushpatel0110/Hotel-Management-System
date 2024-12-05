import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

function TokenLogin({ setLogin }) {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const isValidToken = async () => {
            try {
                const resp = await axios.post(`${import.meta.env.VITE_API_URL}auth/token-login/`, {
                    body: { token },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (resp.status === 200) {
                    window.localStorage.setItem('token', resp.data.token);
                    alert('Login Successful'); // Consider using a notification library here
                    setLogin(true);
                    navigate('/');
                } else {
                    alert('Invalid Token');
                }
            } catch (error) {
                console.log(error);
                alert(error.response?.data?.message || 'An error occurred');
            }
        };

        if (token) {
            isValidToken();
        }

        navigate('/login');
    }, [token, navigate, setLogin]);
}

export default TokenLogin;
