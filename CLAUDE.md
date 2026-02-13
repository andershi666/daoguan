# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **WeChat Mini Program** (微信小程序) for Taoist temple (道观) service booking and management. It provides an online reservation system for spiritual services with integrated Eight Characters (八字) calculation based on birth information.

**Tech Stack:**
- Backend: Node.js + Express + MySQL
- Frontend: WeChat Mini Program (native)
- Core Library: `lunar-javascript` for Eight Characters calculation

## Project Structure

```
daoguan-miniprogram/
├── backend/                    # Node.js backend
│   ├── database/
│   │   └── schema.sql         # Complete DB schema with seed data
│   ├── src/
│   │   ├── app.js             # Express server entry
│   │   ├── config/
│   │   │   └── database.js    # MySQL connection pool
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.js        # WeChat OAuth login
│   │   │   ├── categories.js  # Service categories
│   │   │   ├── services.js    # Service listings
│   │   │   ├── orders.js      # Order management (with transactions)
│   │   │   └── payment.js     # Payment integration
│   │   └── utils/
│   │       └── bazi.js        # Eight Characters calculation engine
│   ├── package.json
│   └── .env.example           # Environment config template
│
└── miniprogram/               # WeChat Mini Program
    ├── pages/                 # 6 pages (page-based architecture)
    │   ├── index/             # Service list with category filter
    │   ├── service-detail/    # Service details
    │   ├── order-create/      # Order form with person info
    │   ├── order-confirm/     # Order confirmation
    │   ├── order-list/        # User's orders
    │   └── order-detail/      # Order details with bazi info
    ├── utils/
    │   └── mockData.js        # Mock data for development
    └── app.js                 # Entry point, mock mode toggle
```

## Common Commands

### Backend Development

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Development mode (auto-restart with nodemon)
npm run dev

# Production mode
npm start

# Initialize database
mysql -u root -p daoguan_db < database/schema.sql
```

### Database Management

```bash
# Create database
mysql -u root -p
CREATE DATABASE daoguan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
mysql -u root -p daoguan_db < backend/database/schema.sql

# Verify tables and seed data
USE daoguan_db;
SHOW TABLES;
SELECT * FROM services;
SELECT * FROM categories;
```

### Testing API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Get services
curl http://localhost:3000/api/services

# Get categories
curl http://localhost:3000/api/categories

# Get time periods (shichen)
curl http://localhost:3000/api/shichen
```

## Architecture & Key Patterns

### Backend Architecture

**Pattern:** Express.js with modular routing

- **Connection Pooling:** MySQL pool with max 10 connections ([backend/src/config/database.js](backend/src/config/database.js))
- **Transaction Support:** Order creation uses MySQL transactions to ensure data consistency when creating order + person records ([backend/src/routes/orders.js](backend/src/routes/orders.js))
- **Error Handling:** Global error handler middleware in [backend/src/app.js](backend/src/app.js:51-58)

### Frontend Architecture

**Pattern:** WeChat Mini Program page-based component model

- Each page has 4 files: `.js` (logic), `.wxml` (template), `.wxss` (styles), `.json` (config)
- **Global state:** Accessed via `getApp().globalData`
- **Mock mode toggle:** Set `useMockData: true` in [miniprogram/app.js](miniprogram/app.js:9) to use mock data without backend
- **API base URL:** Configured in [miniprogram/app.js](miniprogram/app.js:6)

### Database Schema (6 Tables)

1. **categories** - Service categories (3 seed records)
2. **services** - Available services with pricing (6 seed records)
3. **orders** - Order records with status tracking
4. **order_persons** - Person details with calculated bazi info
5. **payments** - Payment transaction records
6. **users** - WeChat user profiles (optional)

**Character Set:** utf8mb4 with utf8mb4_unicode_ci collation for full Unicode support

**Indexes:** 20+ indexes on foreign keys and frequently queried columns

**Constraints:** Foreign keys with CASCADE DELETE for referential integrity

## Core Business Logic

### Eight Characters (八字) Calculation

**Location:** [backend/src/utils/bazi.js](backend/src/utils/bazi.js)

**Process:**
1. Input: Birth date (YYYY-MM-DD), shichen value (0-11 or 99), gender
2. Convert solar to lunar calendar using `lunar-javascript`
3. Extract Four Pillars (年月日时): Heavenly Stems (天干) + Earthly Branches (地支)
4. Determine Five Elements (五行) for each pillar
5. Determine Zodiac (生肖)
6. Special case: shichen value 99 ("吉时") = unknown time, defaults to noon (午时) for calculation but displays as "时辰未知"

**12 Time Periods (Shichen):**
- 子时(23:00-01:00) = 0, 丑时(01:00-03:00) = 1, ..., 亥时(21:00-23:00) = 11
- 吉时(时辰未知) = 99 (special value for unknown birth time)

**Implementation note:** Shichen hour calculation uses middle of time period: `shichenHour = shichenValue * 2 + 1` ([backend/src/utils/bazi.js:74](backend/src/utils/bazi.js:74))

### Price Calculation

**Formula:** `Total = Base Price + (Number of Persons × Per-Person Price)`

Example: Service with base_price=200, price_per_person=50, 3 persons = 200 + (3 × 50) = 350 CNY

### Order Creation Workflow

1. User selects service from list (filtered by category)
2. Fills order form with person details: name, gender, birth date, shichen
3. Backend calculates bazi for each person using `calculateBazi()`
4. **Transaction:** Insert order + person records atomically ([backend/src/routes/orders.js](backend/src/routes/orders.js))
5. Return order with calculated bazi info
6. Frontend displays order confirmation with all bazi details

**Important:** Order creation in [backend/src/routes/orders.js](backend/src/routes/orders.js) uses MySQL transactions (`connection.beginTransaction()`, `connection.commit()`, `connection.rollback()`) to ensure data consistency.

## API Endpoints

All endpoints use `/api` prefix. Backend runs on port 3000 by default.

**Services:**
- `GET /api/services` - List all active services (optional `?category_id=X` filter)
- `GET /api/services/:id` - Get service details

**Categories:**
- `GET /api/categories` - List all active categories

**Orders:**
- `POST /api/orders` - Create order with persons array (calculates bazi automatically)
- `GET /api/orders?user_id=xxx` - Get user's orders
- `GET /api/orders/:id` - Get order details with person info

**Payment:**
- `POST /api/payment/create` - Create payment (TODO: WeChat Pay V3 integration)
- `POST /api/payment/notify` - Payment callback (TODO: signature verification)
- `GET /api/payment/status/:order_id` - Check payment status

**Auth:**
- `POST /api/auth/login` - WeChat OAuth login (requires WECHAT_APPID and WECHAT_SECRET)

**Utilities:**
- `GET /api/shichen` - Get list of 12+1 time periods
- `GET /health` - Health check

## Environment Configuration

### Backend (.env file)

Required variables:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=daoguan_db

# WeChat Mini Program
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret

# WeChat Pay (for payment features)
WECHAT_MCH_ID=your_merchant_id
WECHAT_PAY_KEY=your_api_key
WECHAT_PAY_NOTIFY_URL=https://your-domain.com/api/payment/notify

# Server
PORT=3000
NODE_ENV=development
```

Copy from template: `cp .env.example .env`

### Mini Program

1. **AppID:** Configure in [project.config.json](project.config.json:19)
2. **Backend URL:** Configure `baseUrl` in [miniprogram/app.js](miniprogram/app.js:6)
3. **Mock Mode:** Toggle `useMockData` in [miniprogram/app.js](miniprogram/app.js:9)
4. **Domain Whitelist:** For production, configure request domains in WeChat MP platform

## Development Modes

### Using Mock Data (No Backend Required)

Set in [miniprogram/app.js](miniprogram/app.js:9):
```javascript
useMockData: true
```

Mock data provided in [miniprogram/utils/mockData.js](miniprogram/utils/mockData.js) includes:
- 3 categories
- 6 services
- Sample orders with calculated bazi

### Using Real Backend

Set in [miniprogram/app.js](miniprogram/app.js:9):
```javascript
useMockData: false
```

Requirements:
- Backend server running on configured `baseUrl`
- Database initialized with schema
- For production: HTTPS domain configured in WeChat MP platform

## Important Implementation Details

### Time Period (Shichen) Handling

**Special case for 子时 (Zi Shi):** Crosses midnight (23:00-01:00). The library handles this automatically by using the hour value (1:00 AM for calculations).

**Unknown time (吉时):** When shichen_value = 99, the system:
1. Uses noon (12:00) for calculation to get year/month/day pillars
2. Sets hour pillar as "时辰未知" in display
3. Stores both in database for transparency

See implementation: [backend/src/utils/bazi.js:34-71](backend/src/utils/bazi.js:34-71)

### MySQL Transaction Pattern

When creating orders, the code uses transactions to ensure atomicity:

```javascript
await connection.beginTransaction();
try {
  // Insert order
  // Insert persons
  // Calculate bazi for each person
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
}
```

This prevents partial order creation if bazi calculation fails.

### Character Encoding

All tables use `utf8mb4` character set to support:
- Chinese characters (姓名、地址)
- Emoji icons for categories
- Special characters in remarks

Always use utf8mb4_unicode_ci collation for proper sorting.

## Known Limitations & TODOs

1. **Payment Integration Incomplete:**
   - WeChat Pay V3 API not fully implemented
   - Payment callback verification missing
   - Need to add certificate handling

2. **No Authentication Middleware:**
   - API endpoints lack auth checks
   - Order access not restricted to owner
   - Consider adding JWT middleware

3. **No Input Validation:**
   - Missing request parameter validation
   - No sanitization for SQL injection prevention
   - Consider adding express-validator

4. **No Test Suite:**
   - `npm test` not configured
   - Missing unit tests for bazi calculation
   - Missing integration tests for API endpoints

5. **No Rate Limiting:**
   - API vulnerable to abuse
   - Consider adding express-rate-limit

## Deployment Considerations

### Production Requirements

1. **Server:** HTTPS domain with valid SSL certificate (required by WeChat)
2. **Database:** MySQL 5.7+ with regular backups
3. **WeChat Configuration:**
   - Mini Program reviewed and approved
   - Server domain whitelisted in MP platform
   - Payment merchant account configured (if using payment)
4. **Environment:** Set `NODE_ENV=production` to hide error details

### Domain Configuration

WeChat Mini Programs require HTTPS domains to be whitelisted:
- Request domain: Your API domain
- Upload domain: If using file uploads
- Download domain: If serving downloadable files

Configure in WeChat MP Platform → Development → Development Settings → Server Domain

## Color Scheme & UI

**Main Color:** `#8B4513` (brown, representing temple aesthetics)
**Accent:** `#A0522D` (darker brown)
**Background:** `#f5f5f5` (light gray)
**Text:** `#333` (primary), `#666` / `#999` (secondary)

Design philosophy: Clean, modern interface with traditional religious solemnity.
