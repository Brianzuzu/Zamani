# Zamani Backend

This is the backend for the Zamani project, built with Node.js, Express, MongoDB, and Firebase Admin SDK.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Firebase Project with Service Account credentials

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create/Edit `.env` file in the `backend` root.
   - Fill in your MongoDB URI and Firebase Admin credentials.
   - Add Flutterwave keys (`FLW_PUBLIC_KEY`, `FLW_SECRET_KEY`, `FLW_WEBHOOK_SECRET`).

## Running the Server

### Development Mode (with nodemon)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Project Structure

- `src/index.js`: Entry point of the application.
- `src/app.js`: Express application configuration.
- `src/config/`: Database and Firebase configurations.
- `src/models/`: Mongoose models.
- `src/routes/`: API route definitions.
- `src/controllers/`: Route controller logic (to be implemented).
- `src/middleware/`: Custom Express middlewares.

## API Endpoints

- `GET /`: Health check.
- `GET /api/users`: Get all users.
- `POST /api/users`: Create a new user.
- `POST /api/payments/initialize`: Start a new payment session.
- `GET /api/payments/verify/:reference`: Polling status for a payment.
- `POST /api/payments/webhook`: Receiver for Flutterwave status updates.

## Webhook Testing
To test payments locally:
1. Run `npx ngrok http 5000`.
2. Set your `FLW_WEBHOOK_SECRET` in `.env`.
3. Update Flutterwave dashboard with your ngrok URL + `/api/payments/webhook`.
