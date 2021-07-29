# allBOT

> The bot might not join your server/be offline since I am using heroku free tier (for now!), which limits the bots availability.

[Invite allBOT to your server](https://discord.com/oauth2/authorize?client_id=765198269068083200&permissions=8&scope=bot)

## Table of contents

* [Features](#features)
* [Requirements](#requirements)
* [Getting started](#getting-started)

<hr/>

## Features
#### Admin:
- Ban Member
- Kick Member
- Purge Messages

#### Currency:
- Shop
- Buy items
- Check your Inventory
- Leaderboard
- Check Balance
- Transfer money

#### Fun:
- Gifs (Gyfcat API)
- XKCD (XKCD API)
- Urban Dictionary
- Kanye (Kanye.rest)
- And other stuff!

#### Music:
- Play music
- Skip songs
- Stop music
- View queue

#### And other features!

<hr>

#### Requirements

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [FFMPEG](https://www.ffmpeg.org/)
- OR - [Docker](https://www.docker.com/) (optional)


#### Installation

```shell script
# Clone the repository
git clone https://github.com/Yug34/allBOT

# Enter into the directory
cd allBOT

# Install the dependencies
npm install
```

#### Configuration:

After the steps above, add your Bot's secret token to config.json.

#### Currency System:

```shell script
# Run dbInit.js once, and forget about it (unless you update it)
node dbInit.js
```

#### Starting the application:

```shell script
node index.js
```


#### Starting the application using Docker

```shell script
# Build the image
docker build --tag allBOT .

# Run the image
docker run -d allBOT
```

#### Common errors

Here is a list of common errors and how you can fix them.

#### Dependencies aren't up to date

The packages used in this repository get updated often, especially the ytdl-core package. That is why it is always worth a try updating those if you get an error like `invalid URL: undefined` or when the bot crashes when running the play command.

```shell script
npm install ytdl-core@latest
```

#### FFMPEG is not installed on the machine running the bot

The `play` command requires FFMPEG to be installed on the machine that is running the bot. You can download it on the official [FFMPEG website](https://www.ffmpeg.org/). Note: This isn't relevant if you use the Dockerfile because it will install FFMPEG inside of the container.

#### Unable to install `canvas` module

If you are unable to install the `canvas` module, then there are certain dependencies you'll need to install. Refer to the [package's link](https://www.npmjs.com/package/canvas) to install those.

##### Todos:
- Add persistent storage 
