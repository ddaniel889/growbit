// services/mailService.js
const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const _ = require('lodash'); // ¡No olvides importar lodash!

async function getVerificationCode() {
    const config = {
        imap: {
            user: process.env.NOWPAYMENTS_EMAIL, 
            password: process.env.EMAIL_APP_PASSWORD, // 'ajom iame...'
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            authTimeout: 5000 // Un poco más de tiempo por si Gmail está lento
        }
    };

    let connection;

    try {
        connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        // Criterio: No leídos, de NowPayments, de los últimos 5 minutos (más seguro)
        const delay = 5 * 60 * 1000;
        const sinceDate = new Date(Date.now() - delay);
        
        const searchCriteria = ['UNSEEN', ['FROM', 'noreply@nowpayments.io'], ['SINCE', sinceDate]];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("[mailService] No se encontraron correos nuevos de NowPayments.");
            connection.end();
            return null;
        }

        // Obtener el último mensaje recibido (el más reciente)
        const lastMessage = messages[messages.length - 1];
        const textPart = _.find(lastMessage.parts, { which: 'TEXT' });
        const mail = await simpleParser(textPart.body);
        
        // Regex para capturar el código de 2FA
        // Buscamos específicamente el patrón que suele enviar NowPayments
        const codeMatch = mail.text.match(/\b\d{6}\b/);
        
        connection.end();

        if (codeMatch) {
            console.log(`[mailService] Código encontrado: ${codeMatch[0]}`);
            return codeMatch[0];
        }

        return null;
        
    } catch (err) {
        if (connection) connection.end();
        console.error("Error crítico en mailService:", err.message);
        return null;
    }
}

module.exports = { getVerificationCode };
