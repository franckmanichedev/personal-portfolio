import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url'; // Necessaire pour obtenir le chemin du fichier actuel

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

// Capture toutes les pages non trouvées et redirige vers index.html
app.use((req, res) => {
    res.status(404).send("Page non trouvée");
});

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

app.post('/send-mail', (req, res) => {
    const { name, email, subject, comment } = req.body;

    if (!name || !email || !subject || !comment) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const mailOptions = {
        from: 'franckmaniche6@gmail.com',
        to: 'franckmaniche6@gmail.com',
        subject: subject,
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
        }
        console.log('Email envoyé:', info.response);
        res.status(200).json({ message: 'Email envoyé avec succès !' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});