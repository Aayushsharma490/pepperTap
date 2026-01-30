import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, email, phone } = body;

        const isValid = await verifyOTP(code, email, phone);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP code' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            message: 'OTP verified successfully',
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json(
            { error: 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}
