# 🛒 GroCart - Full Stack E-Commerce Platform

A modern, feature-rich e-commerce grocery delivery platform built with the MERN stack (MongoDB, Express.js, React, Node.js). GroCart provides a seamless shopping experience with real-time cart management, multiple payment options, and an intuitive admin dashboard.

![GroCart Demo](./Demo%201.gif)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Payment Integration](#-payment-integration)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Customer Features

- 🔐 **User Authentication** - Secure JWT-based authentication with email verification
- 🛍️ **Product Browsing** - Browse products by categories and subcategories
- 🔍 **Advanced Search** - Search products with real-time results
- 🛒 **Shopping Cart** - Add, update, and remove items with real-time price calculations
- 💳 **Multiple Payment Options**:
  - Cash on Delivery
  - Stripe Online Payment (Credit/Debit Cards)
- 📦 **Order Management** - Track order history with detailed receipts
- 📍 **Address Management** - Save and manage multiple delivery addresses
- 💰 **Smart Pricing** - Automatic discount calculations
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🎨 **Modern UI/UX** - Clean interface with smooth animations

### Admin Features

- 📊 **Admin Dashboard** - Comprehensive control panel
- 📦 **Product Management** - Add, edit, and delete products
- 🏷️ **Category Management** - Organize products with categories and subcategories
- 🖼️ **Image Upload** - Cloudinary integration for product images
- 👥 **User Management** - View and manage customer accounts
- 📈 **Order Overview** - Monitor all orders and their statuses

### Additional Features

- ⚡ **Real-time Updates** - Cart and order updates without page refresh
- 🔒 **Secure Payments** - PCI-compliant Stripe integration
- 📧 **Email Notifications** - Order confirmations and password reset emails
- 🎯 **State Management** - Redux Toolkit for efficient state handling
- 🚀 **Optimized Performance** - Fast loading and smooth transitions
- 🌐 **SEO Friendly** - Optimized for search engines

## 🛠 Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Hot Toast** - Notification system
- **Vite** - Build tool and dev server

### Backend

- **Node.js** - Runtime environment
- **Express.js v5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **Resend** - Email service
- **Helmet** - Security headers
- **Morgan** - HTTP logging

## 📁 Project Structure

```
grocart/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images and media files
│   │   ├── common/        # API configurations
│   │   ├── components/    # Reusable React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Page layouts
│   │   ├── pages/         # Page components
│   │   ├── provider/      # Context providers
│   │   ├── route/         # Route definitions
│   │   ├── store/         # Redux store and slices
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   │   ├── connectDB.js  # Database connection
│   │   ├── sendEmail.js  # Email configuration
│   │   └── stripe.js     # Stripe setup
│   ├── controllers/      # Route controllers
│   │   ├── address.controller.js
│   │   ├── cart.controller.js
│   │   ├── category.controller.js
│   │   ├── order.controller.js
│   │   ├── product.controller.js
│   │   ├── subCategory.controller.js
│   │   ├── uploadImage.controller.js
│   │   └── user.controller.js
│   ├── middleware/       # Custom middleware
│   │   ├── Admin.js      # Admin authorization
│   │   ├── auth.js       # JWT authentication
│   │   └── multer.js     # File upload
│   ├── models/           # Mongoose schemas
│   │   ├── address.model.js
│   │   ├── cartproduct.model.js
│   │   ├── category.model.js
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   ├── subCategory.model.js
│   │   └── user.model.js
│   ├── route/            # API routes
│   │   ├── address.route.js
│   │   ├── cart.route.js
│   │   ├── category.route.js
│   │   ├── order.route.js
│   │   ├── product.route.js
│   │   ├── subCategory.route.js
│   │   ├── upload.router.js
│   │   └── user.route.js
│   ├── utils/            # Utility functions
│   ├── index.js          # Server entry point
│   └── package.json
│
├── configuration_assets/ # Documentation images
├── STRIPE_DEBUG_GUIDE.md
├── STRIPE_FIX_SUMMARY.md
├── STRIPE_WEBHOOK_SETUP.md
└── readme.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Stripe Account** - [Sign up](https://stripe.com/) for payment processing
- **Cloudinary Account** - [Sign up](https://cloudinary.com/) for image storage
- **Resend Account** - [Sign up](https://resend.com/) for email service

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd grocart
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

## 🔐 Environment Variables

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8080
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/grocart

# JWT Secrets
SECRET_KEY_ACCESS_TOKEN=your_access_token_secret_key_here
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_ENPOINT_WEBHOOK_SECRET_KEY=whsec_your_webhook_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Resend)
RESEND_API=your_resend_api_key_here
```

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8080

# Stripe Public Key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
```

### Getting API Keys

#### MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Get your connection string
5. Replace `<username>` and `<password>` with your credentials

#### Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers → API Keys
3. Copy your test keys (starts with `sk_test_` and `pk_test_`)
4. For webhook secret, see [STRIPE_WEBHOOK_SETUP.md](./STRIPE_WEBHOOK_SETUP.md)

#### Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret

#### Resend

1. Sign up at [Resend](https://resend.com/)
2. Create an API key
3. Verify your domain (for production)

## 🏃 Running the Application

### Development Mode

#### Terminal 1 - Start Backend Server

```bash
cd server
npm start
# or for auto-reload on changes
npm run dev
```

The server will run on `http://localhost:8080`

#### Terminal 2 - Start Frontend Development Server

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
cd client
npm run build
```

#### Serve Production Build

```bash
npm run preview
```

## 💳 Payment Integration

GroCart supports two payment methods:

### 1. Cash on Delivery (COD)

- ✅ Ready to use out of the box
- No additional setup required
- Orders are marked as "CASH ON DELIVERY"

### 2. Stripe Online Payment

- ✅ Fully integrated with client-side verification
- Supports all major credit/debit cards
- PCI-compliant and secure

#### Testing Stripe Payments

Use these test card numbers:

| Card Number         | Description        |
| ------------------- | ------------------ |
| 4242 4242 4242 4242 | Success            |
| 4000 0000 0000 9995 | Declined           |
| 4000 0025 0000 3155 | Requires 3D Secure |

**Expiry:** Any future date  
**CVC:** Any 3 digits  
**ZIP:** Any 5 digits

For detailed Stripe setup and troubleshooting, see:

- [STRIPE_FIX_SUMMARY.md](./STRIPE_FIX_SUMMARY.md)
- [STRIPE_DEBUG_GUIDE.md](./STRIPE_DEBUG_GUIDE.md)
- [STRIPE_WEBHOOK_SETUP.md](./STRIPE_WEBHOOK_SETUP.md)

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Logout

```http
GET /api/user/logout
Authorization: Bearer {accessToken}
```

### Product Endpoints

#### Get All Products

```http
POST /api/product/get
Content-Type: application/json

{
  "page": 1,
  "limit": 10
}
```

#### Get Product Details

```http
POST /api/product/get-product-details
Content-Type: application/json

{
  "productId": "product_id_here"
}
```

#### Search Products

```http
POST /api/product/search-product
Content-Type: application/json

{
  "q": "search query"
}
```

### Cart Endpoints

#### Add to Cart

```http
POST /api/cart/create
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "productId": "product_id_here"
}
```

#### Get Cart Items

```http
GET /api/cart/get
Authorization: Bearer {accessToken}
```

#### Update Cart Quantity

```http
PUT /api/cart/update-qty
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "_id": "cart_item_id",
  "qty": 2
}
```

#### Delete Cart Item

```http
DELETE /api/cart/delete-cart-item
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "_id": "cart_item_id"
}
```

### Order Endpoints

#### Create Cash on Delivery Order

```http
POST /api/order/cash-on-delivery
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "list_items": [...],
  "addressId": "address_id",
  "totalAmt": 99.99,
  "subTotalAmt": 95.00
}
```

#### Create Stripe Checkout Session

```http
POST /api/order/checkout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "list_items": [...],
  "addressId": "address_id",
  "totalAmt": 99.99,
  "subTotalAmt": 95.00
}
```

#### Verify Stripe Payment

```http
POST /api/order/verify-payment
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "sessionId": "stripe_session_id"
}
```

#### Get Order List

```http
GET /api/order/order-list
Authorization: Bearer {accessToken}
```

### Address Endpoints

#### Create Address

```http
POST /api/address/create
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "address_line": "123 Main St",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA",
  "mobile": "1234567890"
}
```

#### Get All Addresses

```http
GET /api/address/get
Authorization: Bearer {accessToken}
```

### Category Endpoints

#### Get Categories

```http
GET /api/category/get
```

#### Get Subcategories

```http
POST /api/subcategory/get
Content-Type: application/json

{
  "categoryId": "category_id_here"
}
```

## 🗄 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  mobile: String,
  verify_email: Boolean,
  last_login_date: Date,
  status: String (Active/Inactive/Suspended),
  address_details: [ObjectId],
  shopping_cart: [ObjectId],
  orderHistory: [ObjectId],
  forgot_password_otp: String,
  forgot_password_expiry: Date,
  role: String (ADMIN/USER)
}
```

### Product Model

```javascript
{
  name: String,
  image: [String],
  category: [ObjectId],
  subCategory: [ObjectId],
  unit: String,
  stock: Number,
  price: Number,
  discount: Number,
  description: String,
  more_details: Object
}
```

### Order Model

```javascript
{
  userId: ObjectId,
  orderId: String (unique),
  productId: ObjectId,
  product_details: {
    name: String,
    image: [String]
  },
  paymentId: String,
  payment_status: String,
  delivery_address: ObjectId,
  subTotalAmt: Number,
  totalAmt: Number
}
```

### Cart Model

```javascript
{
  productId: ObjectId,
  quantity: Number,
  userId: ObjectId
}
```

### Address Model

```javascript
{
  address_line: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  mobile: String,
  status: Boolean
}
```

## 👥 User Roles

### Regular User

- Browse and search products
- Manage shopping cart
- Place orders
- Track order history
- Manage delivery addresses
- Update profile

### Admin User

- All user permissions
- Access admin dashboard
- Manage products (CRUD operations)
- Manage categories and subcategories
- View all orders
- Manage users

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ HTTP-only cookies for refresh tokens
- ✅ CORS configuration
- ✅ Helmet for security headers
- ✅ Input validation and sanitization
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Secure payment processing with Stripe

## 🎨 UI/UX Features

- 📱 Fully responsive design
- 🎭 Smooth animations and transitions
- 🎨 Modern color scheme
- 🖼️ Image optimization
- ⚡ Fast page loads
- 🔔 Toast notifications
- 📊 Loading states
- ❌ Error handling with user-friendly messages
- ♿ Accessibility considerations

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error

```
Error: MongoServerError: Authentication failed
```

**Solution:** Check your MongoDB URI credentials in `.env`

#### Stripe Payment Not Working

**Solution:** See [STRIPE_DEBUG_GUIDE.md](./STRIPE_DEBUG_GUIDE.md) for detailed debugging steps

#### CORS Errors

**Solution:** Ensure `FRONTEND_URL` in server `.env` matches your client URL

#### Images Not Uploading

**Solution:** Verify Cloudinary credentials in server `.env`

#### Cart Not Updating

**Solution:** Check that authentication tokens are stored in localStorage

## 📝 Development Best Practices

- 🔄 Use feature branches for development
- ✅ Write meaningful commit messages
- 🧪 Test payment flows with Stripe test cards
- 📚 Document new features
- 🔍 Use console logs for debugging (remove in production)
- 🛡️ Never commit `.env` files
- 📦 Keep dependencies updated
- 🚀 Optimize images before uploading

## 🚀 Deployment

### Backend Deployment (Vercel/Railway/Heroku)

1. Push code to GitHub
2. Connect repository to deployment service
3. Set environment variables
4. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables
4. Configure redirects for SPA routing

### Environment-Specific Configuration

**Production checklist:**

- ✅ Use production MongoDB database
- ✅ Use live Stripe keys (not test keys)
- ✅ Update `FRONTEND_URL` and `VITE_API_URL`
- ✅ Enable HTTPS
- ✅ Set up proper CORS origins
- ✅ Configure Stripe webhooks with production URL
- ✅ Verify email domain with Resend

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React Team for the amazing library
- Stripe for secure payment processing
- MongoDB for the flexible database
- Cloudinary for image storage
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters

## 📧 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

## 🔮 Future Enhancements

- [ ] Google Places API for address autocomplete
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking with status updates
- [ ] Push notifications
- [ ] Social media login
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Promotional codes and coupons
- [ ] Subscription-based orders

---

**Made with ❤️ using MERN Stack**

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
