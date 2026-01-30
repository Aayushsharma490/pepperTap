/**
 * Pappertech Anti-Fraud & Security Engine
 * This module handles real-time risk assessment and protection.
 */

import { prisma } from './db';

export interface FraudScore {
    score: number; // 0-100 (100 is high risk)
    flags: string[];
    action: 'ALLOW' | 'FLAG' | 'BLOCK';
}

interface SecurityContext {
    ip: string;
    userId?: string;
    userAgent?: string;
    fingerprint?: string;
}

// Simulated in-memory cache for IP rate limiting
const ipCache = new Map<string, { count: number; lastRequest: number }>();

/**
 * Basic IP Rate Limiting
 */
export function checkRateLimit(ip: string, limit: number = 60, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = ipCache.get(ip) || { count: 0, lastRequest: now };

    if (now - record.lastRequest > windowMs) {
        record.count = 1;
        record.lastRequest = now;
    } else {
        record.count++;
    }

    ipCache.set(ip, record);
    return record.count <= limit;
}

/**
 * Analyze risk for a specific order or action
 */
export async function assessRisk(context: SecurityContext, payload: any): Promise<FraudScore> {
    const flags: string[] = [];
    let score = 0;

    // 1. IP Rate Limit Check
    if (!checkRateLimit(context.ip, 10, 60000)) {
        flags.push('HIGH_FREQUENCY_REQUESTS');
        score += 40;
    }

    // 2. Multiple Account Detection (Simulated)
    if (context.userId) {
        const linkedAccounts = await prisma.device.count({
            where: { ipAddress: context.ip }
        });
        if (linkedAccounts > 3) {
            flags.push('MULTIPLE_ACCOUNTS_DETECTION');
            score += 30;
        }
    }

    // 3. Bot Protection Simulation
    if (context.userAgent && (context.userAgent.includes('bot') || context.userAgent.includes('headless'))) {
        flags.push('BOT_SUSPICION');
        score += 60;
    }

    // 4. Fake Order Pattern Detection (Simulated)
    // Rule: More than 2 orders in 5 minutes with low value
    if (payload.type === 'ORDER' && payload.amount < 100) {
        // Mocking check of recent orders
        score += 10;
    }

    // Determine Action
    let action: 'ALLOW' | 'FLAG' | 'BLOCK' = 'ALLOW';
    if (score >= 80) action = 'BLOCK';
    else if (score >= 40) action = 'FLAG';

    return { score, flags, action };
}

/**
 * Logs a security event to the AuditLog table
 */
export async function logSecurityEvent(userId: string | undefined, action: string, metadata: any, context: SecurityContext) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity: 'SECURITY',
                metadata: JSON.stringify(metadata),
                ipAddress: context.ip,
                userAgent: context.userAgent,
            }
        });

        // If it's a critical flag, also notify Admins (simulated via global emitter)
        if (metadata.severity === 'HIGH') {
            console.log(`[ADMIN-ALERT] Critical Security Event: ${action} for User ${userId}`);
        }
    } catch (err) {
        console.error('Failed to log security event:', err);
    }
}
