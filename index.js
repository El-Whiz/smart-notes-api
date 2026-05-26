require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/connectDB');

const PORT = process.env.PORT || 4040;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`SmartNotes server listening on port ${PORT}`);
});
