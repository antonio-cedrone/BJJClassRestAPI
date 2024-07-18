/**
 * @openapi
{
  "components": {
    "securitySchemes": {
      "bearerAuth": {           
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      },
      "cookieAuth": {
        "type": "apiKey",
        "in": "cookie",
        "name": "jwt"
      }
    }
  }
}
*/