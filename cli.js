#!/usr/bin/env node

const commander = require('commander'),
    { prompt } = require('inquirer'),
    chalk = require('chalk'),
    jsonFile = require('jsonfile')

commander.version('1.0.0').description('BitShares Witness Monitor')

commander
    .command('create <name>')
    //.option('--extension <value>', 'File extension')
    .alias('c')
    .description('Create new configuration file.')
    .action((name, cmd) => {
        const data = {
            "port": 3090,
            "node": "ws://localhost:8090",
            "coreAsset": "BTS",
            "producer": {
                "name": "your_witness_name",
                "key": "your_active_key"
            },
            "producerBackup": {
                "isOn": true,
                "name": "witness_name",
                "key": "backup_signing_key",
                "url": "witness_url"
            },
            "priceFeeds": {
                "isOn": true,
                "cron": "5 */58 * * * *",
                "assets": {
                    "EUR": {
                        "SYMBOL": "EUR",
                        "MCR": 1.6,
                        "MSSR": 1.02
                    },
                    "RUBLE": {
                        "SYMBOL": "RUBLE",
                        "MCR": 1.75,
                        "MSSR": 1.1
                    }
                },
                "priceProviders": {
                    "coinpaprika": true
                }
            },
            "monitor": {
                "isOn": false,
                "telegram": {}
            }
        }

        jsonFile.writeFileSync(name, data)
        console.log(chalk.green(`\nFile "${name}" created.`))


    })


commander.parse(process.argv)
