const bcrypt = require('bcryptjs');
const SALT_VALUE = 8; // Salt value to encrypt
module.exports = async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(SALT_VALUE);
    const encryptedpassword = await bcrypt.hash(password, salt);
    return encryptedpassword;
}

