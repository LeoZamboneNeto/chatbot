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
    client.sendMessage(chatId, 'Digite o número do serviço desejado:');
}

function cancelAppointment(chatId) {
    client.sendMessage(chatId, `Digite o nome completo para buscar o agendamento: `);
}

// Variável para rastrear se a mensagem de boas-vindas já foi enviada
let welcomeMessageSent = false;

let choosingService = false;

client.on('message', async (message) => {
    const chatId = message.from;

    if (!welcomeMessageSent) {
        client.sendMessage(chatId, 'Olá, tudo bem? Bem-vindo ao atendimento "Lyu\'s Barbearia"\n\n[1] - Agendamento\n[2] - Cancelamento.');
        welcomeMessageSent = true;
        return;
    }

    // Se o usuário está escolhendo um serviço
    if (choosingService) {
        // Verifica se a mensagem é um número válido correspondente a um serviço
        const serviceChoice = parseInt(message.body);
        if (!isNaN(serviceChoice) && serviceChoice > 0 && serviceChoice <= services.length) {
            const selectedService = services[serviceChoice - 1];
            client.sendMessage(chatId, `Você selecionou: ${selectedService.name} - ${selectedService.price.toFixed(2)} R$`);
            // Aqui você pode prosseguir com as instruções adicionais conforme necessário
        } else {
            client.sendMessage(chatId, 'Opção de serviço inválida. Por favor, escolha um número de serviço válido.');
        }
        // Reinicia o estado do chat para não estar mais escolhendo um serviço
        choosingService = false;
        return;
    }

    // Verifica se a mensagem é um número
    if (isNaN(message.body)) {
        client.sendMessage(chatId, 'Por favor, insira um número válido.');
        return;
    }

    const option = parseInt(message.body);

    // Executa a lógica de acordo com a opção escolhida
    if (option === 1) {
        displayServices(chatId);
        client.sendMessage(chatId, 'Digite o número do serviço desejado:');
        // Define o estado do chat para estar escolhendo um serviço
        choosingService = true;
    } else if (option === 2) {
        cancelAppointment(chatId);
    } else {
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
