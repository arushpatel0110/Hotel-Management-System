import React from 'react';
import { Navigate } from 'react-router-dom';
import { GET_ACCESS_TOKEN } from '../constants';

const ProtectedRoute = ({ isLogin, children }) => {
    console.log(GET_ACCESS_TOKEN == null && !isLogin);

    if (GET_ACCESS_TOKEN() == null && !isLogin) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default ProtectedRoute;
