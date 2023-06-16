import dotenv from "dotenv"
dotenv.config()


export const development = {
  mongodb_connection_url: process.env.DEV_MONGODB_CONNECTION_URL,
  bycrypt_salt_round: +process.env.DEV_BCRYPT_SALT_ROUND,
  jwt_secret_key: process.env.DEV_JWT_SECRET,
  refresh_secret_key: process.env.REFRESH_SECRET_KEY,
  stripe_secret_keys:process.env.STRIPE_SECRET_KEYS,
  port: +process.env.PORT,
  jwt_expiry: process.env.DEV_JWT_EXPIRY,
  refresh_expiry: process.env.REFRESH_EXPIRY,
  token_expiry: +process.env.DEV_TOKEN_EXPIRY,
  smtp_host: process.env.DEV_SMTP_HOST,
  smtp_port: process.env.DEV_SMTP_PORT,
  smtp_email: process.env.DEV_SMTP_EMAIL,
  smtp_password: process.env.DEV_SMTP_PASSWORD,
  from_email: process.env.DEV_FROM_EMAIL,
  from_name: process.env.DEV_FROM_NAME

}