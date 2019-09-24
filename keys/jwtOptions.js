//make sure to include expiresIn the other options are optional
const jwtOptions = {
    issuer: 'MyExampleCorp',  // Issuer 
    subject: 'someuser@example.com', // Subject 
    audience: 'http://example.com', // Audience
    expiresIn: "12h", // Time the JWT will be valid
    algorithm: "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
}
module.exports = jwtOptions;