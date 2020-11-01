# What does this bot?

The bot can assign roles on your server on base Warzone KDR.

# Prerequisites

- Heroku account, to host the Discord bot.
- Discord bot
- Account in [http://my.callofduty.com](http://my.callofduty.com), with the purpose of getting the information of Warzone KDR of the users who want to assign a role.
- Basic knowledge of how a Discord bot works, basic Javascript.

# How to install ?

To install the bot you have to do several steps before and be able to configure it:

## Create Discord bot

1. To create a Discord bot you must have an account or be logged in if you already have one.
2. The first step is to create a discord application so after that you can create a bot within this application, to create an application go to [https://discord.com/developers/applications](https://discord.com/developers/applications).
3. Once you have the application created you can create a bot, in the page of the application created previously there is a menu that says bot, here you can create your bot.
4. When you have created the bot, we need the `Token` to be able to use it in the Heroku instance, so keep it in a safe place.
5. When you create the bot we have to invite it to your server, for this we have to go to the menu of `OAuth2` where you can generate a link and invite the bot to your server.
6. Permissions have to be:
   - **Scop**: bot
   - **Permissions**:
     - Send Messages
     - Manage Roles
7. Once the url is generated you can use it in your web browser where it tells you if you want to add the bot to your server.

> There are many tutorials of "how to create a Discord bot". I used this [https://discordpy.readthedocs.io/en/latest/discord.html](https://discordpy.readthedocs.io/en/latest/discord.html)

## Heroku

1. You need to have a Heroku account, you can create one here [https://signup.heroku.com/](https://signup.heroku.com/)
2. If you are connected to Heroku, you can create an instance for this project in Heroku by clicking on the following
   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/luisramirez-m/warzone-discord-bot/tree/master)
3. Once you have created the instance in Heroku, you can add the `ENV` variables that we will use from configurations for the Discord bot, which you can add in the configuration tab in the Heroku instance page.
4. You have to add the `ENV` variables in Heroku:
   - **COD_ACCOUNT**, is the email from the account you created on [my.callofduty.com](my.callofduty.com)
   - **COD_PASSWORD**, is the password from the account you created on [my.callofduty.com](my.callofduty.com)
   - **TOKEN_DISCORD**, is the `Token` Discord bot
   - **LANG**, is the language configuration for the Discord bot there are only English (en), Spanish (es) and French (fr).
   - **WARZONE_MIN_MATCHES**, min matches to assign a role
   - **ROLES**, this is a complicated part, I will explain [here](#roles)
5. Once you set all the variables you will have to restart the instance of Heroku

### Roles

It is something complex for those who do not know basic programming, my idea is that you can modify the bot settings, remove or modify parameters of roles.

> Before the explain the roles, this roles must already be configured in your discord server.

> These roles in Discord have to be below the permissions of the Discord bot that we just created 

However, at the moment I find this solution, which is an `Array of objects` which contains the name of the role, min of KDR and max of KDR, example:

```json
[
  {
    "name": "Pro Player",
    "min": 2,
    "max": 3
  },
  {
    "name": "Insane Player",
    "min": 3,
    "max": 5
  }
]
```

> For those who do not know programming, if you want to add another role you would have to add below the object of "Insane Player", objects have to be separated by a " , "

So it should be displayed when adding a new role

```json
[
  {
    "name": "Pro Player",
    "min": 2,
    "max": 3
  },
  {
    "name": "Insane Player",
    "min": 3,
    "max": 5
  },
  {
    "name": "The best player of world",
    "min": 10,
    "max": 20
  }
]
```

You can test the roles you want to have for your bot, to know if they have the correct format and above all minify it to be able to add it in the `ENV` variables of Heroku as it has to be minified.

The tool you can use is [https://codebeautify.org/jsonminifier](https://codebeautify.org/jsonminifier), copying your roles and this tool will validate if there is an error, if there is no error you can click on "Minify/Compress", and the result will appear on the right:

```bash
[{"name":"Pro Player","min":2,"max":3},{"name":"Insane Player","min":3,"max":5},{"name":"The best player of world","min":10,"max":20}]
```

This is what you are going to set in the `ENV` named [ROLES](#heroku)
