import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'peppertap_jwt_secret_key_change_in_production_2024'
);

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    name?: string;
}

export async function signJWT(payload: JWTPayload): Promise<string> {
    const token = await new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN || '7d')
        .sign(JWT_SECRET);

    return token;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            role: payload.role as string,
            name: payload.name as string | undefined,
        };
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}
