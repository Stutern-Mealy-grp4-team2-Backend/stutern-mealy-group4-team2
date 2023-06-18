import dotenv from "dotenv"
dotenv.config()


export const development = {
  mongodb_connection_url: process.env.DEV_MONGODB_CONNECTION_URL,
  bycrypt_salt_round: +process.env.DEV_BCRYPT_SALT_ROUND,
  jwt_secret_key: process.env.DEV_JWT_SECRET,
  refresh_secret_key: process.env.DEV_REFRESH_SECRET_KEY,
  port: +process.env.PORT,
  jwt_expiry: process.env.DEV_JWT_EXPIRY,
  refresh_expiry: process.env.DEV_REFRESH_EXPIRY,
  token_expiry: +process.env.DEV_TOKEN_EXPIRY,
  cookie_max_age: process.env.DEV_COOKIE_MAX_AGE,
  smtp_host: process.env.DEV_SMTP_HOST,
  smtp_port: process.env.DEV_SMTP_PORT,
  smtp_email: process.env.DEV_SMTP_EMAIL,
  smtp_password: process.env.DEV_SMTP_PASSWORD,
  from_email: process.env.DEV_FROM_EMAIL,
  from_name: process.env.DEV_FROM_NAME,
  google_client_ID: process.env.DEV_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.DEV_GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.DEV_GOOGLE_CALLBACK_URL,
  facebook_app_id: process.env.DEV_FACEBOOK_APP_ID,
  facebook_app_secret: process.env.DEV_FACEBOOK_APP_SECRET,
  facebook_callback_url: process.env.DEV_FACEBOOK_CALLBACK_URL,
  max_file_upload: process.env.MAX_FILE_UPLOAD,
  file_upload_path: process.env.FILE_UPLOAD_PATH
}