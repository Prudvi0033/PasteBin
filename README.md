# Pastebin-Lite

A simple pastebin application where users can create text pastes and share them via unique URLs. Pastes can have optional time-to-live (TTL) and view count limits.

## How to Run Locally

### Prerequisites
- Node.js 18+
- MongoDB connection string

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Prudvi0033/PasteBin
cd PasteBin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
BASE_URL=http://localhost:3000
TEST_MODE=0
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Persistence Layer

**MongoDB** (via Mongoose) is used for data persistence. MongoDB Atlas was chosen because it provides a serverless database that works seamlessly with Vercel's serverless architecture and survives across function invocations.

## Important Design Decisions

1. **Atomic View Counting**: Uses MongoDB's `findOneAndUpdate` with conditional queries to atomically check constraints and increment the view count in a single operation, preventing race conditions under concurrent load.

2. **Server-Side Rendering for `/p/:id`**: The paste view page is implemented as a Next.js Server Component to properly return HTTP 404 status codes when pastes are unavailable (expired or view limit exceeded).

3. **Deterministic Time Testing**: Supports the `TEST_MODE` environment variable and `x-test-now-ms` request header for deterministic expiry testing as required by the automated test suite.