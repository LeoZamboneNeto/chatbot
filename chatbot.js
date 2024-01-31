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

const barbers = [
    {name: 'Lyu'}, 
    {name: 'Paulo'}, 
    {name: 'Julio'}
];

function displayServices(chatId) {
    const message = ['Serviços disponíveis:'];
    
    services.forEach((service, index) => {
        message.push(`[${index + 1}] ${service.name} --- ${service.price.toFixed(2)} R$`);
    });
  
    client.sendMessage(chatId, message.join('\n'));
}

function displayBarbers(chatId) {
    const message = ['Escolha um barbeiro:'];
    
    barbers.forEach((barber, index) => {
        message.push(`[${index + 1}] ${barber.name}`);
    });
    client.sendMessage(chatId, message.join('\n'));
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
let choosingBarber = false;

// ...

function sendWelcomeMessage(chatId) {
    client.sendMessage(chatId, 'Olá, tudo bem? Bem-vindo ao atendimento "Lyu\'s Barbearia"\n\n[1] - Agendamento\n[2] - Cancelamento.');
}

function handleServiceChoice(chatId, choice) {
    if (!isNaN(choice) && choice > 0 && choice <= services.length) {
        const selectedService = services[choice - 1];
        client.sendMessage(chatId, `Você selecionou: ${selectedService.name} - ${selectedService.price.toFixed(2)} R$`);
        // Aqui você pode prosseguir com as instruções adicionais conforme necessário
        // client.sendMessage(chatId, 'Escolha um barbeiro:');
        // displayBarbers(chatId);
        choosingBarber = true;
    } else {
        client.sendMessage(chatId, 'Opção de serviço inválida. Por favor, escolha um número válido.');
        resetChatState();
    }
    // Reinicia o estado do chat
   // resetChatState();
}

function handleBarberChoice(chatId, choice) {
    if (!isNaN(choice) && choice > 0 && choice <= barbers.length) {
        const selectedBarber = barbers[choice - 1];
        client.sendMessage(chatId, `Você escolheu o barbeiro: ${selectedBarber.name}`);
        // Aqui você pode prosseguir com as instruções adicionais conforme necessário
    } else {
        client.sendMessage(chatId, 'Opção de barbeiro inválida. Por favor, escolha um número válido.');
    }
    // Reinicia o estado do chat
    resetChatState();
}

function handleGeneralOption(chatId, option) {
    if (option === 1) {
        // O usuário escolheu agendamento, então exiba os serviços disponíveis
        displayServices(chatId);
        client.sendMessage(chatId, 'Digite o número do serviço desejado:');
        //displayBarbers(chatId);
        // Define o estado do chat para estar escolhendo um serviço
        choosingService = true;
    } else if (option === 2) {
        // O usuário escolheu cancelamento, então inicie o processo de cancelamento
        cancelAppointment(chatId);
        // Reinicia o estado do chat
        resetChatState();
    } else {
        client.sendMessage(chatId, 'Opção inválida. Programa encerrado.');
        // Reinicia o estado do chat
        resetChatState();
    }
}

function resetChatState() {
    choosingService = false;
    choosingBarber = false;
}

client.on('message', async (message) => {
    const chatId = message.from;

    if (!welcomeMessageSent) {
        sendWelcomeMessage(chatId);
        welcomeMessageSent = true;
        return;
    }

    const userInput = parseInt(message.body);

    if (choosingService && !choosingBarber) {
        handleServiceChoice(chatId, userInput);
    } else if (choosingBarber) {
        handleBarberChoice(chatId, userInput);
    } else {
        handleGeneralOption(chatId, userInput);
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
