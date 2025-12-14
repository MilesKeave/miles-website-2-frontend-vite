# Frontend Deployment Notes

## Environment Variables

Create a `.env.production` file in the root of `miles-website-2-frontend-vite/` before building:

```bash
VITE_API_BASE_URL=https://YOUR-BACKEND-URL/api
```

Replace `YOUR-BACKEND-URL` with your actual backend URL (e.g., Elastic Beanstalk URL).

## Build Command

```bash
npm install
npm run build
```

The `dist/` folder contains the production build.

## Local Development

For local development, the app will automatically use `http://localhost:8080/api` if no environment variable is set.

