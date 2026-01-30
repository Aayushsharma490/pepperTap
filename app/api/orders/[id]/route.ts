import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOrderStatusUpdate } from '@/lib/email';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status, deliveryPartnerId } = body;

        const order = await prisma.order.update({
            where: { id: params.id },
            data: {
                ...(status && { status }),
                ...(deliveryPartnerId && { deliveryPartnerId }),
            },
            include: {
                customer: true,
            },
        });

        // Create status history
        if (status) {
            await prisma.orderStatusHistory.create({
                data: {
                    orderId: params.id,
                    status,
                },
            });

            // Send status update email
            await sendOrderStatusUpdate(
                order.customer.email,
                order.orderNumber,
                status
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
