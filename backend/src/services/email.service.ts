/* eslint-disable @typescript-eslint/no-var-requires */

type EmailMessage = {
  text: string;
  from: string;
  to: string;
  subject: string;
};

const { SMTPClient } = require('emailjs');

const client = new SMTPClient({
  host: process.env.EMAILJS_HOST,
  port: process.env.EMAILJS_PORT ? Number(process.env.EMAILJS_PORT) : 465,
  user: process.env.EMAILJS_USER,
  password: process.env.EMAILJS_PASSWORD,
  ssl: process.env.EMAILJS_USE_SSL !== 'false',
});

const sendMail = (message: EmailMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    client.send(message, (err: Error | null, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const sendCoachingRequestEmail = async (payload: {
  full_name: string;
  email: string;
  phone?: string;
  coaching_type: string;
  availability?: string;
  message?: string;
}): Promise<void> => {
  if (!process.env.EMAILJS_FROM || !process.env.EMAILJS_TO) {
    console.warn('EmailJS is not fully configured: EMAILJS_FROM or EMAILJS_TO is missing');
    return;
  }

  const subject = `Nouvelle demande de coaching de ${payload.full_name}`;
  const text = `Vous avez reçu une nouvelle demande de coaching:\n\n` +
    `Nom complet: ${payload.full_name}\n` +
    `Email: ${payload.email}\n` +
    `Téléphone: ${payload.phone ?? 'Non précisé'}\n` +
    `Type de coaching: ${payload.coaching_type}\n` +
    `Disponibilité: ${payload.availability ?? 'Non précisée'}\n` +
    `Message: ${payload.message ?? 'Aucun message fourni'}\n`;

  await sendMail({
    text,
    from: process.env.EMAILJS_FROM,
    to: process.env.EMAILJS_TO,
    subject,
  });
};
