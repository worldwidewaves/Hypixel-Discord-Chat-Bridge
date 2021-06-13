const fs = require('fs')
const { Collection } = require('discord.js-light')

class CommandHandler {
  constructor(discord) {
    this.discord = discord

    this.prefix = discord.app.config.discord.prefix

    this.commands = new Collection()
    let commandFiles = fs.readdirSync('./src/discord/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(discord)
      this.commands.set(command.name, command);
    }
  }

  handle(message) {
    if (!message.content.startsWith(this.prefix)) { return false }
    let args = message.content.slice(this.prefix.length).trim().split(/ +/);
    let commandName = args.shift().toLowerCase();

    let command = this.commands.get(commandName)
      || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return false;

    this.discord.app.log.discord(`[${command.name}] ${message.content}`)

    command.onCommand(message)

    return true
  }
}

module.exports = CommandHandler
