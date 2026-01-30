import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';
import { signJWT } from '@/lib/jwt';
import { assessRisk, logSecurityEvent } from '@/lib/security';
import { headers } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const headersList = headers();
        const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // 1. Pre-login Risk Assessment
        const risk = await assessRisk({ ip, userAgent }, { type: 'LOGIN', email });

        if (risk.action === 'BLOCK') {
            await logSecurityEvent(undefined, 'LOGIN_BLOCKED', { risk, email }, { ip, userAgent });
            return NextResponse.json(
                { error: 'Access denied due to security policy.' },
                { status: 403 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check if user is blocked
        if (user.blocked) {
            return NextResponse.json(
                { error: 'Your account has been blocked. Please contact support.' },
                { status: 403 }
            );
        }

        // Generate JWT token
        const token = await signJWT({
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name || undefined,
        });

        // Return user data (in production, you'd create a session/JWT here)
        const { password: _, ...userWithoutPassword } = user;

        const response = NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword,
        });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error in login:', error);
        return NextResponse.json(
            { error: 'Failed to login' },
            { status: 500 }
        );
    }
}
