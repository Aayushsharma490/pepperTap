"use client";

// Real-time Logistics System Simulation
// This utility handles the events described in the requirements:
// Order placed → Seller notified
// Seller accepts → Delivery notified
// Delivery picks → User notified
// Delivered → All notified

type Role = 'CUSTOMER' | 'SELLER' | 'DELIVERY' | 'ADMIN';

interface LogisticsEvent {
    type: 'ORDER_PLACED' | 'SELLER_ACCEPTED' | 'DELIVERY_PICKED' | 'DELIVERED';
    orderId: string;
    payload?: any;
}

export const logisticsEmitter = {
    emit: async (event: LogisticsEvent) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`🚀 [REAL-TIME] ${timestamp} - EVENT: ${event.type} for Order ${event.orderId}`);

        // 1. Sync with Backend if it's a status change
        const statusMap: Record<string, string> = {
            'ORDER_PLACED': 'PENDING',
            'SELLER_ACCEPTED': 'ACCEPTED',
            'DELIVERY_PICKED': 'PICKED_UP',
            'DELIVERED': 'DELIVERED'
        };

        if (statusMap[event.type]) {
            try {
                await fetch(`/api/orders/${event.orderId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: statusMap[event.type] })
                });
            } catch (err) {
                console.error('Failed to sync logistics event to backend:', err);
            }
        }

        // 2. Dispatch notifications based on role
        switch (event.type) {
            case 'ORDER_PLACED':
                notifyRole('SELLER', `🔔 New Order Received: ${event.orderId}. Accept now to start preparing.`);
                break;
            case 'SELLER_ACCEPTED':
                notifyRole('DELIVERY', `🚚 Order Ready for Pickup: ${event.orderId}. Navigate to store.`);
                notifyRole('CUSTOMER', `✅ Seller has accepted your order ${event.orderId}. It's being prepared!`);
                break;
            case 'DELIVERY_PICKED':
                notifyRole('CUSTOMER', `🛵 Your order ${event.orderId} is out for delivery!`);
                break;
            case 'DELIVERED':
                notifyRole('CUSTOMER', `🏁 Order ${event.orderId} delivered. Enjoy!`);
                notifyRole('SELLER', `💰 Payout for ${event.orderId} has been credited.`);
                notifyRole('DELIVERY', `✨ Trip completed. Check your earnings!`);
                break;
        }
    }
};

const notifyRole = (role: Role, message: string) => {
    // In a real app, this would push to a WebSocket/Pusher channel for that role
    // For now, we simulate with a window event or browser notification if allowed

    if (typeof window !== 'undefined') {
        const event = new CustomEvent('logistics-notification', {
            detail: { role, message, time: new Date().toISOString() }
        });
        window.dispatchEvent(event);

        // Browsre Push Simulation (Toast)
        // We'll use this in the dashboards to show real-time alerts
    }
};

// Hook for components to listen to these real-time notifications
export const useRealTimeNotifications = (userRole: Role, callback: (msg: string) => void) => {
    if (typeof window === 'undefined') return;

    const handler = (event: any) => {
        if (event.detail.role === userRole) {
            callback(event.detail.message);
        }
    };

    window.addEventListener('logistics-notification', handler);
    return () => window.removeEventListener('logistics-notification', handler);
};
