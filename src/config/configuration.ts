export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret:process.env.SECRET_KEY,
  jwtRefreshSecret:process.env.JWT_REFRESH_SECRET,
  userEmail:process.env.EMAIL,
  emailPassword:process.env.EMAIL_PASSWORD,
  cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  cloundinary_api_key:process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET,
  database:{
    connectionString:process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017'
  }
});  