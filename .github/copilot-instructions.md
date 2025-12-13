# AI Copilot Instructions - GW Rental App

## Architecture Overview

**GW Rental App** is a full-stack trailer rental platform with:
- **Frontend**: Angular 20 with standalone components, routing, and RxJS reactive state using signals
- **Backend**: Node.js/Express with MongoDB Atlas, JWT authentication, and email service (Resend)
- **Data Model**: Trailers (static JSON array), Users (MongoDB), Bookings (MongoDB with availability checking)

### Key Data Flows

1. **Authentication**: User signup → Email verification → Login → JWT token stored in localStorage → Token included in all API requests
2. **Booking Flow**: Browse trailers → Check availability → Create booking → Booking stored in DB with status lifecycle (pending → confirmed → active → completed/cancelled)
3. **Cross-Origin**: Frontend (localhost:4200) communicates with backend (localhost:3000) via CORS-enabled API

## Tech Stack & Dependencies

- **Frontend**: @angular/core@20.3.0, @angular/router, @angular/forms, RxJS, Swiper (carousel)
- **Backend**: Express@5.1.0, Mongoose@9.0.1, JWT@9.0.3, bcryptjs@3.0.3, Resend (email service)
- **Build**: Angular CLI 20, ts-node for backend, TypeScript 5.9
- **MongoDB**: Uses `.env` for `MONGODB_URI`; models use Mongoose schemas with indexes

## Project Structure & File Organization

```
src/app/
  ├── *service.ts              # Singleton Angular services (auth, booking, location)
  ├── app.routes.ts            # Route definitions (lazy-loaded pages)
  └── app.config.ts            # Provider configuration

src/pages/                      # Routable components (each folder = route)
  ├── {page-folder}/
  │   ├── {page}.ts            # Component with signal() for state
  │   ├── {page}.html          # Standalone template
  │   └── {page}.css           # Component styles

backend/server/
  ├── server.ts                # Express app setup, DB connection
  ├── serverRoutes.ts          # Route definitions (auth, trailers, bookings)
  ├── controllers/             # Business logic for each route
  ├── models/                  # Mongoose schemas (User, Booking)
  ├── middleware/              # Auth guard (protect, optionalAuth)
  ├── services/                # Email sending (email.service.ts)
  ├── utils/                   # JWT token creation/verification
  └── data/                    # Static trailer data (trailers.ts)
```

## Development Workflows

### Running the App

**Backend** (from `backend/server/`):
```bash
npx ts-node server.ts          # Runs on localhost:3000
```

**Frontend** (from project root):
```bash
npm start                      # Runs `ng serve` on localhost:4200
```

Both must run simultaneously for full functionality.

### Environment Setup

Create `.env` in `backend/server/` with:
```
MONGODB_URI=mongodb+srv://...
PORT=3000
FRONTEND_URL=http://localhost:4200
JWT_SECRET=your-secret
RESEND_API_KEY=...
```

### Testing & Building

- **Frontend tests**: `npm test` (Jasmine/Karma)
- **Frontend build**: `ng build` (Angular CLI)
- **Backend**: No test script configured (to be added)

## Key Patterns & Conventions

### Frontend

1. **Standalone Components**: All components use `standalone: true` with `imports: [CommonModule, ...]`
2. **Signal-based State**: Use Angular signals (`signal()`, `computed()`) instead of traditional Subject-based RxJS
3. **Services as Singletons**: `AuthService`, `BookingService`, `LocationService` manage global state via signals
4. **Token Management**: Access token stored in `localStorage` with key `'gw_access_token'`; included in HTTP headers as `Authorization: Bearer {token}`
5. **SSR Ready**: App uses `app.config.server.ts` for server-side rendering configuration

### Backend

1. **Route Structure**: Controllers export individual handlers; routes import and register them in `serverRoutes.ts`
2. **Authentication**: `protect` middleware extracts Bearer token from `Authorization` header and attaches `req.user` (userId, email)
3. **Mongoose Indexes**: Booking schema has compound indexes for `[user, status]` and `[trailer, startDate, endDate]` for availability queries
4. **Status Enums**: Booking status is restricted enum: `'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'`
5. **Error Handling**: Controllers return `{ success: boolean, message, data? }` response format
6. **Static Trailers Data**: `trailers.ts` is static JSON; all trailer data comes from this file (no DB storage)

### HTTP Communication

- **Request Headers**: Always include `Authorization: Bearer {token}` for protected endpoints
- **CORS**: Enabled for `http://localhost:4200` with `credentials: true`
- **Content-Type**: All requests use `application/json`
- **Error Responses**: Include `success: false` and descriptive `message`

## Common Tasks

### Adding a New API Endpoint

1. Create handler in `backend/server/controllers/{feature}.controller.ts`
2. Add route in `backend/server/serverRoutes.ts` with protection level (use `protect` middleware if auth required)
3. Create matching method in `src/app/{feature}.service.ts` using `HttpClient`
4. Use in component with `this.service.method().subscribe()` or async pipe

### Adding a New Page/Route

1. Create folder in `src/pages/{page-name}/` with `.ts`, `.html`, `.css`
2. Make component standalone: `standalone: true, imports: [CommonModule, ...]`
3. Import component in `src/app/app.routes.ts`
4. Add route entry with `path`, `component`, `title`

### Email Notifications

- Uses Resend service (see `backend/server/services/email.service.ts`)
- Called from auth controllers for verification and password reset
- Requires `RESEND_API_KEY` in `.env`

## Important Security Notes

- **JWT**: Tokens signed with `JWT_SECRET` (see `backend/server/utils/token.utils.ts`)
- **Password Hashing**: Uses `bcryptjs` with salt rounds; never store plain passwords
- **Email Verification**: Users must verify email before full access; `isVerified` flag in User model
- **Protected Routes**: Backend routes require valid token; frontend components should check `AuthService.isLoggedIn` signal

## Debugging Tips

- **Backend Server Won't Start**: Check `.env` file exists with `MONGODB_URI` and MongoDB Atlas is accessible
- **CORS Errors**: Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- **Token Issues**: Check `TOKEN_KEY` constant in `AuthService` matches storage key; verify token hasn't expired
- **Booking Conflicts**: Availability check queries overlapping date ranges; inspect MongoDB booking documents
