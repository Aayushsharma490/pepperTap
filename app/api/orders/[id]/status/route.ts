import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status, note } = body;

        // Start a transaction to ensure both updates happen together
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // 1. Update order status
            const order = await tx.order.update({
                where: { id: params.id },
                data: { status },
                include: {
                    customer: true,
                    seller: true,
                    deliveryPartner: true,
                }
            });

            // 2. Create history record
            await tx.orderStatusHistory.create({
                data: {
                    orderId: params.id,
                    status,
                    note: note || `Order status changed to ${status}`,
                }
            });

            return order;
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        );
    }
}
