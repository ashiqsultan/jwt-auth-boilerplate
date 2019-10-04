const bcrypt = require('bcryptjs');
const SALT_VALUE = 10; // Salt value to encrypt
module.exports = async function encryptPassword(password) {
    console.log("encrypting Pwd")
    const salt = await bcrypt.genSalt(SALT_VALUE);
    const encryptedpassword = await bcrypt.hash(password, salt);
    return encryptedpassword;
}

