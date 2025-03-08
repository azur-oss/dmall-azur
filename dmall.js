const { Client, GatewayIntentBits, PermissionsBitField, ActivityType } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);

  
    client.user.setPresence({
        activities: [{
            name: 'bot de azur', // change pas fdp
            type: ActivityType.Streaming, 
            url: 'https://www.twitch.tv/discord', 
        }],
        status: 'online', 
    });
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith(config.prefix + 'annonce') && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const messageToSend = message.content.slice((config.prefix + 'annonce').length).trim(); // Récupérer le message après la commande

        if (!messageToSend) {
            return message.reply('Veuillez spécifier un message à envoyer.');
        }


        client.guilds.cache.forEach(async (guild) => {
            try {
                const members = await guild.members.fetch();
                members.forEach(async (member) => {
                    try {
                        if (!member.user.bot) { 
                            const personalizedMessage = messageToSend.replace(/{user}/g, `<@${member.user.id}>`);
                            await member.send(personalizedMessage);
                            console.log(`Message envoyé à ${member.user.tag} (${member.user.id}) dans le serveur ${guild.name}`);
                        }
                    } catch (error) {
                        console.error(`Impossible d'envoyer un message à ${member.user.tag} (${member.user.id}) dans le serveur ${guild.name}: ${error.message}`);
                    }
                });
            } catch (error) {
                console.error(`Erreur lors de la récupération des membres du serveur ${guild.name}: ${error.message}`);
            }
        });

        await message.reply('✅ L\'annonce a été envoyée à tous les membres de tous les serveurs !');
    }
});

client.login(config.token); 