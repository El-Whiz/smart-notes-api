const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack || "");
  console.error(err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: "Invalid file type or too large file" });
  }

  const status = err.status || 500;
  return res.status(status).json({ error: err.message });
};

module.exports = errorHandler;