import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bharatxcelerate_super_secret_jwt_key_2026';

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request) {
    // Check Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }

    // Check cookies
    const cookie = request.headers.get('cookie');
    if (cookie) {
        const match = cookie.match(/token=([^;]+)/);
        if (match) return match[1];
    }

    return null;
}

export async function getUserFromRequest(request) {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}
