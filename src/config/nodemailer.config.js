import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

const transporter = nodemailer.createTransport({ service: 'gmail', port: 587, auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS,}
})

transporter.verify((error, success) => {
    if (error) {
        console.error('Error al conectar con el correo', error);
    } else {
        console.log('Conectado al servidor de correo', success );
    }
});

export default transporter;
