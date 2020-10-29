require('dotenv').config();
const Discord = require('discord.js');
const _ = require('lodash');
const client = new Discord.Client();
const token = process.env.TOKEN_DISCORD;
const config = require(`./config.json`);
const LANG = require(`./assets/${config.LANG}.json`);

const API = require('call-of-duty-api')({
  ratelimit: { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 },
});

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  const prefix = '!';
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  await commandGetRange(command, args, message);
});
client.login(token);

async function commandGetRange(command, args, message) {
  if (!command === 'rank') return message.channel.send(LANG.ERRORS.NOT_COMMAND);
  if (!args.length) return message.channel.send(`${LANG.ERRORS.NOT_ARGUMENTS}, ${message.author}!`);

  const plataformArg = args[0];
  const gamertagArg = args[1];

  try {
    await API.login(process.env.COD_ACCOUNT, process.env.COD_PASSWORD).catch(console.log);
    const warzoneStats = await API.MWBattleData(gamertagArg, getPlataform(plataformArg)).catch(console.log);
    const brAll = warzoneStats.br_all;
    if (brAll.gamesPlayed >= config.WARZONE_MIN_MATCHES) {
      const range = setRole(brAll.kdRatio, message);
      return message.channel.send(generateEmmbed(brAll, range));
    } else {
      return message.channel.send(`${LANG.ERRORS.MIN_WINS} ${config.WARZONE_MIN_MATCHES} ${LANG.WARZONE.MATCHES}`);
    }
  } catch (error) {
    console.log(error);
  }
}

function getPlataform(plataform) {
  const plataformList = {
    activision: API.platforms.acti,
    psn: API.platforms.psn,
    steam: API.platforms.steam,
    xbl: API.platforms.xbl,
    battle: API.platforms.battle,
  };

  return plataformList[plataform];
}

function setRole(kdRatio, message) {
  let range;
  let role;
  const roles = JSON.parse(process.env.ROLES);

  range = roles.find((role) => {
    return _.inRange(kdRatio, role.min, role.max);
  }).name;

  role = message.guild.roles.cache.find((role) => role.name === range);
  message.member.roles.add(role).then(console.log).catch(console.error);

  return range;
}

function generateEmmbed(data, range) {
  return new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(LANG.EMMBED.TITLE)
    .setAuthor(LANG.EMMBED.AUTHOR, 'https://www.socialclubgamer.com/wp-content/uploads/2020/06/logo-cod-150x150.jpg')
    .setDescription(range)
    .addFields(
      {
        name: LANG.WARZONE.KDR,
        value: data.kdRatio.toLocaleString('en'),
        inline: true,
      },
      {
        name: LANG.WARZONE.KILLS,
        value: data.kills.toLocaleString('en'),
        inline: true,
      },
      {
        name: LANG.WARZONE.DEATHS,
        value: data.deaths.toLocaleString('en'),
        inline: true,
      }
    )
    .addFields(
      {
        name: LANG.WARZONE.WINS,
        value: data.wins.toLocaleString('en'),
        inline: true,
      },
      {
        name: LANG.WARZONE.MATCHES,
        value: data.gamesPlayed.toLocaleString('en'),
        inline: true,
      }
    )
    .setTimestamp()
    .setFooter('Ramirez#4313');
}
