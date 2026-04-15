
import jwt from 'jsonwebtoken';

export const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        const err = new Error("Authentication error: Token missing");
        err.data = { content: "Please login to perform this action" };
        return next(err);
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        socket.user = decoded;
        next();
    } catch (err) {
        console.error("Socket Auth Middleware Error:", err.message);
        const authError = new Error("Authentication error: Invalid token");
        authError.data = { content: "Session expired or invalid token" };
        next(authError);
    }
};