import express from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url'; // Necessaire pour obtenir le chemin du fichier actuel


const PORT = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID || '545581657563-8eng1p6msj17a7ec2j1gqgto1ct4opdl.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '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';
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN || '1//04tll4n_jxygECgYIARAAGAQSNwF-L9IrViqjfkJFpWW9j_g5CronASyX6gOg7QR0XPlld-frL9gnftzy88wIrL6zno7gTD2pQpY';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Configuration pour obtenir __dirname dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialisation de l'application Express
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Servir les fichiers statiques
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route par défaut pour servir le fichier index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function createTransporter(){
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                type: 'OAuth2',
                // user: process.env.EMAIL_USER,
                // pass: process.env.EMAIL_PASS,
                user: 'franckmaniche6@gmail.com',
                // pass: 'uvtp yzvp nzgt ogle',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        return transporter;
    }
    catch (error) {
        console.error('Erreur lors de la création du transporteur:', error);
        throw error;
    }
}

app.post('/send-mail', async (req, res) => {
    const { name, email, subject, comment } = req.body;

    if (!name || !email || !subject || !comment) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const mailOptions = {
        from: 'FRANCK MANICHE 😅 <franckmaniche6@gmail.com>',
        to: 'skillsformodernity@gmail.com',
        subject: subject,
        text: 'Juste un message de test',
        html: `
            <h3>Bonjour Maniche Franck,</h3>
            <p>Vous avez reçu un message de ${name}.</p>
            <p>Voici les détails du message de votre expediteur:</p>
            <strong>Sujet:</strong> ${subject} <br>
            <strong>Nom:</strong> ${name} <br>
            <strong>Email:</strong> ${email} <br>
            <strong>Commentaire:</strong> ${comment} <br>
            <p>Merci !</p>
            <p>Ce message a été envoyé depuis votre site portfolio <a href="https://personal-portfolio-steel-mu-35.vercel.app/" target="_blanck">Maniche Franck</a> .</p>
        `
    };

    try{
        const transporter = await createTransporter();

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erreur lors de l\'envoi de l\'email:', error);
                return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
            }
            console.log('Email envoyé:', info.response);
            res.status(200).json({ message: 'Email envoyé avec succès !' });
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
    }
});

// Capture toutes les pages non trouvées et redirige vers index.html
app.use((req, res) => {
    res.status(404).send("Page non trouvée");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});