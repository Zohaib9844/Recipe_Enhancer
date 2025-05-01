require('dotenv')

console.log({
    envLoaded: process.env, // Check ALL loaded variables
    specificVar: process.env.MONGODB_URI // Check your target variable
  });