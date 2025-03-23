import jwt from "jsonwebtoken";

export const generateToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h'
    });
};

export const generateRefreshToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d'
    });
};

export const verifyToken = (token: string, secret?: string) => {
    return jwt.verify(token, secret || process.env.JWT_SECRET || 'secret');
};