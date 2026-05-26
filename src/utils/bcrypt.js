const bcrypt = require("bcrypt");
const hash_password = async (password) =>{
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
};

module.exports = {
    hash_password
};