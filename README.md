# allBOT


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

#### Or:
- [Docker](https://www.docker.com/)


#### Installation

```bash
# Clone the repository
git clone https://github.com/Yug34/allBOT

# Enter into the directory
cd allBOT

# Install the dependencies
npm install
```

#### Configuration:

After the steps above, add your Bot's secret token to config.json.

#### Starting the application:

```bash
node index.js
```


## Starting the application using Docker

```bash
# Build the image
docker build --tag allBOT .

# Run the image
docker run -d allBOT
```

#### Common errors

Here is a list of common errors and how you can fix them.

#### Dependencies aren't up to date

The packages used in this repository get updated often, especially the ytdl-core package. That is why it is always worth a try updating those if you get an error like `invalid URL: undefined` or when the bot crashes when running the play command.

```bash
npm install ytdl-core@latest
```

#### FFMPEG is not installed on the machine running the bot

The `play` command requires FFMPEG to be installed on the machine that is running the bot. You can download it on the official [FFMPEG website](https://www.ffmpeg.org/). Note: This isn't relevant if you use the Dockerfile because it will install FFMPEG inside of the container.
