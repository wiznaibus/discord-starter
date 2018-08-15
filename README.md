Discord Starter
=======================

Based off <a href="https://github.com/sahat/hackathon-starter" target="_blank">sahat's Hackathon Starter</a>, this Discord guild portal boilerplate provides a base to build a website portal using Discord authentication with the option of requiring users to be members of one or more authorized guilds in order to access the portal.

Getting Started
---------------

Clone the repository to start:

```bash
# Get the latest snapshot
git clone https://github.com/wiznaibus/discord-starter.git myproject

# Change directory
cd myproject

# Install NPM dependencies
npm install

# Then simply start your app
node app.js
```

Obtaining a Discord API Key
------------------

You will need to register your site in Discord's Developer Portal before you can run the application.

<img src="https://discordapp.com/assets/fc0b01fe10a0b8c602fb0106d8189d9b.png" width="200">

- Visit <a href="https://discordapp.com/developers/applications/" target="_blank">Discord's Developer Portal</a>
- Click on the **Create an application** button
- Rename your new application in the *Name* field, then scroll down and click **Save Changes**
- Copy the *Client ID* and *Client Secret* keys and paste them into `.env`
- Click on **OAuth2** and then click **Add Redirect**
- Enter the following **Redirect URI**: http://localhost:8080/auth/discord/callback
- Click **Save Changes**
