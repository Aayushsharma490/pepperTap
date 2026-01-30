# 🌶️ Peppertap - Hyperlocal Delivery Platform

> Empowering local kirana shops to compete with Blinkit, Zepto, and Swiggy

A production-ready multi-vendor hyperlocal delivery platform combining groceries, vegetables, and fast food into one unified marketplace.

![Next.js](https://img.shields.io/badge/Next.js-14.2.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.20.0-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC)

---

## ✨ Features

### 🛒 Multi-Vendor Marketplace
- **3 Categories**: Grocery, Vegetables, Restaurant/Fast Food
- **26+ Products**: Pre-seeded with real product data
- **Multi-Role System**: Customer, Seller, Delivery Partner, Admin

### 🎨 Premium UI/UX
- **Glass UI Design**: Modern frosted glass aesthetic
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive**: Mobile-first design
- **Dark Mode Ready**: Theme system in place

### 🔐 Authentication & Security
- **Email + OTP**: Secure authentication flow
- **Role-Based Access**: 4 user roles with different permissions
- **Password Hashing**: bcryptjs encryption
- **Audit Logging**: Complete activity tracking

### 🛍️ Shopping Experience
- **Real-time Search**: Instant product filtering
- **Shopping Cart**: Persistent cart with Zustand
- **Wishlist**: Save favorite products
- **Animated Interactions**: Delightful micro-animations

### 📧 Notifications
- **Email Notifications**: OTP, order confirmations, status updates
- **Toast Messages**: In-app feedback
- **Demo Mode**: Console logging for development

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pappertech

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
npm run db:push

# Seed database with demo data
npm run db:seed

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📝 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | admin123 |
| **Seller** | seller@example.com | seller123 |
| **Delivery** | delivery@new.com | delivery123 |
| **Customer** | customer@example.com | demo123 |

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Authentication**: Custom (bcryptjs + OTP)
- **Email**: Nodemailer

### State Management
- **Global State**: Zustand
- **Cart**: Zustand with persistence

---

## 📁 Project Structure

```
c:/pappertech/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── products/     # Product CRUD
│   │   └── orders/       # Order management
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui components
│   └── ProductCard.tsx   # Custom components
├── lib/
│   ├── auth.ts           # Auth utilities
│   ├── db.ts             # Prisma client
│   ├── email.ts          # Email service
│   └── utils.ts          # Helpers
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed script
│   └── dev.db            # SQLite database
├── store/
│   ├── authStore.ts      # Auth state
│   └── cartStore.ts      # Cart state
└── package.json
```

---

## 🎯 Key Features Implemented

✅ Multi-vendor marketplace structure  
✅ Role-based access control (4 roles)  
✅ Product catalog with 3 categories  
✅ Shopping cart with persistence  
✅ Email OTP authentication  
✅ Order management system  
✅ Email notifications  
✅ Responsive glass UI design  
✅ Animated components  
✅ Search functionality  
✅ Wishlist feature  
✅ Demo accounts and seed data  

---

## 🔜 Roadmap

### Phase 1 (Current)
- [x] Core infrastructure
- [x] Database schema
- [x] Authentication system
- [x] Customer landing page
- [x] Product catalog
- [x] Shopping cart

### Phase 2 (Next)
- [ ] Checkout flow
- [ ] Seller dashboard
- [ ] Delivery partner dashboard
- [ ] Admin panel
- [ ] Real-time order tracking

### Phase 3 (Future)
- [ ] Supabase Realtime integration
- [ ] Payment gateway (Stripe)
- [ ] PWA support
- [ ] Push notifications
- [ ] Advanced analytics

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:seed      # Seed database
```

---

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Email (Demo Mode)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=demo@peppertap.com
SMTP_PASS=demo_password

# App
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Database Models

- **User**: Multi-role user accounts
- **Product**: Product catalog
- **Order**: Order management
- **OrderItem**: Order line items
- **Payment**: Payment tracking
- **Review**: Product reviews
- **Address**: Delivery addresses
- **Notification**: User notifications
- **AuditLog**: Security logs
- **Wishlist**: User wishlists
- **Coupon**: Promotional codes
- **OTPCode**: OTP verification

---

## 🎨 Design System

### Colors
- **Primary**: Green (#10b981) - Trust, freshness
- **Secondary**: Blue (#3b82f6) - Reliability
- **Accent**: Amber (#f59e0b) - Energy

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large
- **Body**: Regular, readable

### Components
- **Glass UI**: Frosted glass effect
- **Rounded Corners**: 0.75rem default
- **Shadows**: Soft, layered
- **Animations**: Smooth, 300ms default

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **Prisma** - Database ORM
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

---

## 📞 Support

For support, email support@peppertap.com or open an issue on GitHub.

---

**Built with ❤️ to empower local businesses**

---

## 🎯 Mission

Peppertap's mission is to level the playing field for local kirana and grocery shops, enabling them to compete with large e-commerce players through technology, while maintaining the personal touch and community connection that makes local businesses special.
