export default function CorsMiddleware(request, response, next) {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174"
  ];

  const origin = request.headers.origin;

  if (allowedOrigins.includes(origin)) {
    response.header("Access-Control-Allow-Origin", origin);
  }

  response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.header("Access-Control-Allow-Credentials", "true");

  if (request.method === "OPTIONS") {
    return response.sendStatus(200);
  }

  next();
}
