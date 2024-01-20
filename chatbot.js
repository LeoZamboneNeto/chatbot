          /* CRIADOR DE QRCODE */

const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

const cliente = new Client({
  puppeteer: {
    args: ['--no-sandbox']
  }
});

let primeiraMensagem = true;
let ultimaResposta = null;

cliente.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

cliente.on('ready', () => {
  console.log('Funcionando');
});

cliente.on('message', message => {
  const agora = new Date();

  if (primeiraMensagem || (!ultimaResposta || (agora - ultimaResposta > 6 ))) {
    message.reply('Seja Bem-Vindo,\n Por favor, você gostaria de um Agendamento ou Cancelamento de horário');
    ultimaResposta = agora;
    primeiraMensagem = false;
  }
});


cliente.initialize();
