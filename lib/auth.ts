import bcrypt from 'bcryptjs';
import { prisma } from './db';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOTP(email?: string, phone?: string): Promise<string> {
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.oTPCode.create({
        data: {
            email,
            phone,
            code,
            expiresAt,
        },
    });

    return code;
}

export async function verifyOTP(code: string, email?: string, phone?: string): Promise<boolean> {
    const otpRecord = await prisma.oTPCode.findFirst({
        where: {
            code,
            ...(email && { email }),
            ...(phone && { phone }),
            verified: false,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!otpRecord) {
        return false;
    }

    await prisma.oTPCode.update({
        where: { id: otpRecord.id },
        data: { verified: true },
    });

    return true;
}

export async function createAuditLog(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}) {
    await prisma.auditLog.create({
        data: {
            ...data,
            metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        },
    });
}
