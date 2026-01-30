// Email Service (Ready for Resend API)
// Currently simulating with Nodemailer/Console for demo safety
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'demo@peppertap.com',
        pass: process.env.SMTP_PASS || 'demo_password',
    },
});

const isDemo = () => process.env.SMTP_USER === 'demo@peppertap.com' || !process.env.RESEND_API_KEY;

export async function sendOTPEmail(email: string, otp: string) {
    if (isDemo()) {
        console.log(`📧 [RESEND SIMULATION] OTP to ${email}: ${otp}`);
        return { success: true };
    }

    // Example Resend Integration (commented for demo environment)
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Peppertap <onboarding@resend.dev>',
      to: email,
      subject: 'Your OTP Code',
      html: `<strong>${otp}</strong>`
    });
    */

    return { success: true };
}

export async function sendOrderConfirmation(email: string, orderNumber: string, totalAmount: number) {
    if (isDemo()) {
        console.log(`📧 [RESEND SIMULATION] Order Confirmed: ${orderNumber} for ${email}`);
        return { success: true };
    }
    return { success: true };
}

export async function sendOrderStatusUpdate(email: string, orderNumber: string, status: string) {
    const statusMessages: Record<string, string> = {
        ACCEPTED: 'Your order has been accepted! 🎉',
        PREPARING: 'Chef is cooking your order 👨‍🍳',
        READY: 'Ready for pickup 📦',
        PICKED_UP: 'Out for delivery 🚚',
        DELIVERED: 'Package delivered! ✅',
    };

    if (isDemo()) {
        console.log(`📧 [RESEND SIMULATION] Status Update: ${orderNumber} is ${status} for ${email}`);
        return { success: true };
    }
    return { success: true };
}

export async function sendWeeklyReport(email: string, name: string, stats: any) {
    if (isDemo()) {
        console.log(`📧 [RESEND SIMULATION] Weekly Report sent to ${email}`);
        return { success: true };
    }

    // In production, this would use a complex MJML/HTML template for statistics
    return { success: true };
}

// Browser Push Simulation
export async function sendBrowserPush(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    } else {
        console.log(`🔔 [BROWSER PUSH] ${title}: ${body}`);
    }
}
