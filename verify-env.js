// verify-env.js
console.log('PORT:', process.env.PORT ? 'Set' : 'Not Set');
console.log('MONGODB_CONNECTION_STRING:', process.env.MONGODB_CONNECTION_STRING ? 'Set' : 'Not Set');
console.log('SECRET_KEY:', process.env.SECRET_KEY ? 'Set' : 'Not Set');
console.log('EMAIL:', process.env.EMAIL ? 'Set' : 'Not Set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set');
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not Set');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');
console.log('AWS_REGION:', process.env.AWS_REGION ? 'Set' : 'Not Set');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not Set');
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not Set');
console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME ? 'Set' : 'Not Set');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not Set');
console.log('CURRENCY:', process.env.CURRENCY ? 'Set' : 'Not Set');
console.log('SUCCESS_URL:', process.env.SUCCESS_URL ? 'Set' : 'Not Set');
console.log('CANCEL_URL:', process.env.CANCEL_URL ? 'Set' : 'Not Set');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN ? 'Set' : 'Not Set');

