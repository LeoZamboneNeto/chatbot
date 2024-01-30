const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()    
});


const services = [
    { name: 'Tintura', price: 25 },
    { name: 'Contorno', price: 15 },
    { name: 'Barboterapia', price: 35 },
    { name: 'Protese Capilar', price: 100 },
    { name: 'Penteado (a partir)', price: 40 },
    { name: 'Relaxamento', price: 30 },
    { name: 'Luzes', price: 75 },
    { name: 'Platinado', price: 180 },
    { name: 'Tintura', price: 25 },
    { name: 'Pézinho', price: 10 },
    { name: 'Corte (maquina)', price: 20 },
    { name: 'Corte', price: 35 },
    { name: 'Limpeza de pele', price: 40.00 },
    { name: 'Limpeza de pele (Profunda)', price: 80.00 },
    { name: 'Sobrancelha', price: 10.00 },
    { name: 'Combo 1 (Corte + barboterapia)', price: 60.00 },
    { name: 'Combo 2 (pai e filho)', price: 60.00 },
  ];

const barbers = ['Lyu', 'Paulo', 'Julio'];

function displayServices(chatId) {
    const message = ['Serviços disponíveis:'];
    
    services.forEach((service, index) => {
      message.push(`[${index + 1}] ${service.name} --- ${service.price.toFixed(2)} R$`);
    });
  
    client.sendMessage(chatId, message.join('\n'));
}
  

function displayBarbers(chatId) {
  client.sendMessage(chatId, `Escolha um barbeiro:`);
  barbers.forEach((barber, index) => {
    client.sendMessage(chatId, `[${index + 1}] ${barber}`);
  });
}

function scheduleAppointment(chatId) {
  displayServices(chatId);
  client.sendMessage(chatId, `Escolha o serviço desejado (Digite o número): `);
}

function cancelAppointment(chatId) {
  client.sendMessage(chatId, `Digite o nome completo para buscar o agendamento: `);
}

client.on('message', async (message) => {
  if (message.fromMe) return; // Ignora mensagens enviadas pelo próprio bot

  // Enviar a mensagem de boas-vindas
  await message.reply(`Olá, tudo bem? Bem-vindo ao atendimento "Lyu\'s Barbearia"\n
                       [1] - Agendamento\n
                       [2] - Cancelamento.`);

  // Ao receber a resposta do usuário
  const userResponse = message.body.toLowerCase();
  const chatId = message.from;

  if (userResponse === '1') {
    // Se a resposta do usuário for "1", chamar a função scheduleAppointment()
    scheduleAppointment(chatId);
  } else if (userResponse === '2') {
    // Se a resposta do usuário for "2", chamar a função cancelAppointment()
    cancelAppointment(chatId);
  } else {
    // Se a resposta não for "1" nem "2", responder com mensagem indicando opção inválida
    client.sendMessage(chatId, 'Opção inválida. Programa encerrado.');
  }
});

client.on('qr', (qr) => {
  console.log('QR Code gerado!');
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  console.log('Autenticado com sucesso!');
  console.log('Salvando a sessão...');
  // Implemente a lógica de persistência de sessão aqui.
});


client.initialize();
