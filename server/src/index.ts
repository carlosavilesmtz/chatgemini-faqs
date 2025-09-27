
import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// In-memory token store (for demonstration purposes)
// In a production application, you should use a secure database to store tokens.
let tokens: any = {};

app.get('/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar.readonly'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens: newTokens } = await oauth2Client.getToken(code as string);
    tokens = newTokens;
    // In a real app, you would associate these tokens with a user
    console.log('Tokens acquired successfully');
    res.send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error retrieving access token', error);
    res.status(500).send('Authentication failed');
  }
});

app.post('/api/calendar/free-busy', async (req, res) => {
  if (!tokens.access_token) {
    return res.status(401).send('Not authenticated');
  }
  oauth2Client.setCredentials(tokens);

  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).send('startTime and endTime are required');
  }

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: startTime,
        timeMax: endTime,
        items: [{ id: 'primary' }],
      },
    });

    const busyIntervals = response.data.calendars?.primary.busy;
    res.json(busyIntervals);
  } catch (error) {
    console.error('Error fetching free-busy information', error);
    res.status(500).send('Failed to fetch calendar data');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
