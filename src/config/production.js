import dotenv from "dotenv"
dotenv.config()



export const production = {
  mongodb_connection_url: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
  bycrypt_salt_round: +process.env.PRODUCTION_BCRYPT_SALT_ROUND,
  jwt_secret_key: process.env.PRODUCTION_JWT_SECRET,
  jwt_expiry: process.env.PRODUCTION_JWT_EXPIRY,
  token_expiry: +process.env.PRODUCTION_TOKEN_EXPIRY,
  refresh_secret_key: process.env.REFRESH_SECRET_KEY,
  refresh_expiry: process.env.REFRESH_EXPIRY,
  port:+process.env.PORT,
  smtp_host: process.env.PRODUCTION_SMTP_HOST,
  smtp_port: process.env.PRODUCTION_SMTP_PORT,
  smtp_email: process.env.PRODUCTION_SMTP_EMAIL,
  smtp_password: process.env.PRODUCTION_SMTP_PASSWORD,
  from_email: process.env.PRODUCTION_FROM_EMAIL,
  from_name: process.env.PRODUCTION_FROM_NAME

}