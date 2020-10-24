### Price Feed Script for BitShares SmartAssets & Witness monitor

(+) Publish Price feeds BitShares SmartAssets

(~) Personal Telegram notifications about witness work & stats


### Prices

EUR, RUBLE, USD, CNY, JPY, GBP, AUD, SEK, KRW

## NodeJS Setup (if necessary)

```
sudo apt-get install build-essential g++ python git curl ntp htop nmon iftop nano -y
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh 2>/dev/null | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 10.21.0 >>install.log
nvm use 10.21.0 >>install.log
nvm alias default 10.21.0
npm install -g npm forever grunt-cli
```

## Install App
```
git clone https://github.com/technologiespro/witness-monitor.git
cd witness-monitor
npm install
```

## Settings
```
mv sample.config.json config.json
nano config.json
```

set

- `producer.name` - witness name
- `producer.key` - witness active key
- `priceFeeds.cron.minute` - (0 - 59) schedule, default run on every 51 minute

save and exit from nano editor: CTRL+O, CTRL+X

## Start/Stop

`npm start` for testing

`forever start bin/www` for background running

`forever stop bin/www` for stopping

or `sh restart.sh` shell script restart


## GOLD, SILVER metal provider

- register on metals-api.com
- get API KEY
- SET API KEY in config.json > API.METALS = "YOUR_METAL_API_KEY"

default run every 24 hours
