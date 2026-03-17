const app = require('./app');
const connectDB = require('./config/db');
const { initFirebase } = require('./config/firebase');

// Connect to Database
connectDB();

// Initialize Firebase
initFirebase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
