// services/mailService.js
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

// El código que tienes en tu imagen
async function getVerificationCode() {
    const config = {
        imap: {
            user: process.env.EMAIL_USER, 
            password: process.env.EMAIL_APP_PASSWORD,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 3000
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // ... resto de la lógica de búsqueda y regex
        // Buscamos correos no leídos de NOWPayments de los últimos 2 minutos
        const delay = 2 * 60 * 1000;
        const yesterday = new Date();
        yesterday.setTime(Date.now() - delay);
        
        const searchCriteria = ['UNSEEN', ['FROM', 'noreply@nowpayments.io'], ['SINCE', yesterday]];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            connection.end();
            return null;
        }

        // Parseamos el cuerpo del mensaje
        const all = _.find(messages[0].parts, { which: 'TEXT' });
        const mail = await simpleParser(all.body);
        
        // Extraemos el código de 6 dígitos usando Regex
        const codeMatch = mail.text.match(/\b\d{6}\b/);
        connection.end();

        return codeMatch ? codeMatch[0] : null;
        
        //connection.end();
        return code; // Retorna los 6 dígitos
    } catch (err) {
        console.error("Error en mailService:", err);
        return null;
    }
}

module.exports = { getVerificationCode };
