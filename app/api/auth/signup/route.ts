import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createOTP } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role, phone } = body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(phone ? [{ phone }] : []),
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists with this email or phone' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'CUSTOMER',
                phone,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });

        // Generate and send OTP
        const otp = await createOTP(email);
        await sendOTPEmail(email, otp);

        return NextResponse.json({
            message: 'User created successfully. Please verify your email with the OTP sent.',
            user,
        }, { status: 201 });
    } catch (error) {
        console.error('Error in signup:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}
