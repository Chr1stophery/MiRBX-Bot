import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { REST } from '@discordjs/rest';

config();

const TOKEN = process.env.MIRBX_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

const rest =  new REST({ version: '10' }).setToken(TOKEN);

client.login(TOKEN);
client.on('ready', () => {
  console.log(client.user.tag + ' has logged in!');
  client.user.setPresence({
  status: 'idle'
  });
});

async function main() {
  const commands = [
    {
     name: 'slaycommand',
     type: 1,
     description: 'The most zesty, slaying command to ever exist!',
    },
   ];
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.log(err);
  }
}

main();

const prefix = '!'; // You can change this to your preferred command prefix
let count = 0;
const countingChannelId = process.env.COUNTING_CHANNEL_ID; // Replace with your counting channel ID

client.on('messageCreate', (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if the message is in the counting channel
  if (message.channel.id === countingChannelId) {
    // Check if the message is the next number in the sequence
    if (parseInt(message.content) === count + 1) {
      count++;
    } else {
      // If the message is not the next number, delete it and reset the count
      message.delete();
    }
  }

  // Check if the message is a command
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'count') {
      // Display the current count
      message.channel.send(`The current count is: ${count}`);
    }
  }
});
