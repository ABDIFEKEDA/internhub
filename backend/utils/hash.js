const bcrypt = require("bcrypt");

// Hash a password
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare password
exports.comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
