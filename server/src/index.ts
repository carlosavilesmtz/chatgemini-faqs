
import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Configuración de Gemini ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

app.post('/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    res.send({ response: text });
  } catch (error) {
    console.error('Error en el chat de Gemini:', error);
    res.status(500).send('Ocurrió un error en el chat.');
  }
});

// --- Integración con Google Calendar ---

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// En producción, usa una base de datos segura para almacenar los tokens.
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
    console.log('Tokens de Google adquiridos con éxito');
    // Redirige de vuelta al frontend. Asegúrate de que la URL es correcta.
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?google_auth=success`);
  } catch (error) {
    console.error('Error al obtener el token de acceso', error);
    res.status(500).send('Fallo en la autenticación');
  }
});

app.post('/api/calendar/free-busy', async (req, res) => {
  if (!tokens.access_token) {
    return res.status(401).send('No autenticado con Google');
  }
  oauth2Client.setCredentials(tokens);

  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).send('startTime y endTime son requeridos');
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
    console.error('Error al consultar la información de free-busy', error);
    res.status(500).send('Fallo al consultar los datos del calendario');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
