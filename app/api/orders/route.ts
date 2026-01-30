import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmation } from '@/lib/email';
import { assessRisk, logSecurityEvent } from '@/lib/security';
import { headers } from 'next/headers';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');
        const sellerId = searchParams.get('sellerId');
        const deliveryPartnerId = searchParams.get('deliveryPartnerId');

        const orders = await prisma.order.findMany({
            where: {
                ...(customerId && { customerId }),
                ...(sellerId && { sellerId }),
                ...(deliveryPartnerId && { deliveryPartnerId }),
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                deliveryPartner: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        avatar: true,
                    },
                },
                statusHistory: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
                address: true,
                payment: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId, items, addressId, paymentMethod } = body;

        const headersList = headers();
        const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // 1. Order Risk Assessment
        const risk = await assessRisk({ ip, userAgent, userId: customerId }, { type: 'ORDER', amount: 0 }); // We'll update amount later if needed

        if (risk.action === 'BLOCK') {
            await logSecurityEvent(customerId, 'ORDER_BLOCKED', { risk, items }, { ip, userAgent });
            return NextResponse.json(
                { error: 'Order creation blocked due to security concerns.' },
                { status: 403 }
            );
        }

        // Calculate total amount
        const productIds = items.map((item: any) => item.productId);
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });

        let totalAmount = 0;
        const orderItems = items.map((item: any) => {
            const product = products.find((p: any) => p.id === item.productId);
            if (!product) throw new Error('Product not found');

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });

        // Get seller ID from first product
        const firstProduct = products[0];
        const sellerId = firstProduct.sellerId;

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                customerId,
                sellerId,
                addressId,
                totalAmount,
                items: {
                    create: orderItems,
                },
                statusHistory: {
                    create: {
                        status: 'PENDING',
                    },
                },
                payment: {
                    create: {
                        amount: totalAmount,
                        method: paymentMethod,
                        status: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
                    },
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                address: true,
            },
        });

        // Send confirmation email
        await sendOrderConfirmation(order.customer.email, order.orderNumber, totalAmount);

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
