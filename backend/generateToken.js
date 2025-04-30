// generateToken.js
const jwt = require('jsonwebtoken');

// Replace this with a real user ID from your database
const userId = "680732ff9d984af7af1ae69d";
const role = "client";

// Secret key used to sign the token (make sure to keep it secure)
const secretKey = 'supersecretkeythatnobodyknows';

// Payload (data) you want to include in the token
const payload = {
  id: userId, role: role 
};

// Create the token
const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token will expire in 1 hour

console.log("Generated Token:", token);
