export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret:process.env.SECRET_KEY,
  userEmail:process.env.EMAIL,
  emailPassword:process.env.EMAIL_PASSWORD,
  database:{
    connectionString:process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017'
  }
});