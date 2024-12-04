const admin = require('../firebaseAdmin.js');
const { user } = require('../models/index.js'); // Import the Sequelize user model

const signup = async (req, res) => {
    const { token, publicKey } = req.body;
    if (!publicKey) {
        return res.status(400).json({ success: false, message: 'Public key is required for signup.' });
    }
    const encodedKey = Buffer.from(publicKey).toString('base64');

    try {
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // Get additional user details from Firebase
        const userRecord = await admin.auth().getUser(uid);
        const displayName = userRecord.displayName;
        const creationTime = userRecord.metadata.creationTime;



        const newUser = await user.create({
            uid,
            email,
            displayName,
            createdAt: new Date(creationTime),
            updatedAt: new Date(),

        }, { publicKey: encodedKey });

        res.status(200).json({ success: true, message: 'User verified and created/exists.', user: newUser });
    } catch (error) {
        console.error('Error during signup process', error);
        res.status(500).json({ success: false, message: 'Internal server error during signup.' });
    }
};
const login = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Find user in the database using Sequelize
        const existingUser = await user.findOne({ where: { uid } });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist. Please sign up first.' });
        }

        res.status(200).json({ success: true, message: 'User login verified.', user: existingUser });
    } catch (error) {
        console.error('Error during login process', error);
        res.status(500).json({ success: false, message: 'Internal server error during login.' });
    }
};

const me = async (req, res) => {
    try {
      const { token } = req.headers; // Get Firebase token from request headers
  
      if (!token) {
        return res.status(400).json({ error: 'Authorization token is required.' });
      }
  
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const uid = decodedToken.uid;
  
      // Fetch the user from the database using the UID from Firebase
      const existingUser = await user.findOne({ where: { uid } });
  
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      return res.status(200).json({
        id: existingUser.uid,
        email: existingUser.email,
        displayName: existingUser.displayName,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

module.exports = { login, signup, me }