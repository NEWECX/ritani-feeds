'use strict';

const fs = require('fs');
const path = require('path');

const dotenvFile = '.env';

require('dotenv').config(path.join(__dirname, dotenvFile));

module.exports = {
    getCredentials,
    getOptions,
    downloadFeed,
    uploadFeed
};

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

async function getAnswer(question) {
    for (let i = 0; i < 3; i++) {
        let answer = await askQuestion(question);
        if (!answer || !answer.trim()) {
            console.error('Invalid answer');
        } else {
            return answer.trim();
        }
    }
}

async function getCredentials(apiUrl) {
    let id = process.env.ID;
    let key = process.env.API_KEY
    if (!id || !key) {
        let response
        for (let i = 0; i < 3; i++) {
            id = await getAnswer('Enter your ritani vendor id: ');
            if (!id) break;
            key = await getAnswer('Enter your api key: ');
            if (!key) break;
            //console.log({ id, key })
            const Authorization = `Bearer ${id}:${key}`;
            response = await fetch(apiUrl + '/verify', { headers: { Authorization } });
            if (response.ok) {
                let answer = await askQuestion(`Do you want to save id and key in ${dotenvFile}? (n/y): `);
                answer = answer.trim().toLowerCase();
                if (answer && answer[0] === 'y') {
                    fs.writeFileSync(path.join(__dirname, dotenvFile), `ID=${id}\nAPI_KEY=${key}\n`);
                }
                break;
            } else {
                if (i < 3) console.error('Invalid id or key, please try again.');
            }
        }
        if (!response || !response.ok) {
            console.error('Failed to authenticate');
            process.exit(1);
        }
    }
    rl.close();
    return { id, key };
}

function printUsageAndExit(message) {
    if (message) console.error(message);
    console.error(`Usage:

# download diamonds feed
ritani-feeds -d

# upload diamonds feed
ritani-feeds -d /path/to/feed-file.csv

# download gemstones feed
ritani-feeds -g

# upload gemstones feed
ritani-feeds -g [/path/to/feed-file.csv]

Note:
if .env file is present in the current directory, it will be used to get the credentials.
otherwise, the script will prompt for ritani vendor id and api key.
`);
    process.exit(1);
}

function getOptions() {
    if (process.argv.length < 3) {
        printUsageAndExit();    
    }
    if (process.argv.includes('-d') && process.argv.includes('-g')) {
        printUsageAndExit('Only one of -d or -g is allowed'); 
    }
    const isDiamonds = process.argv.includes('-d');
    const isGemstones = process.argv.includes('-g');
    if (!isDiamonds && !isGemstones) {
        printUsageAndExit('One of -d or -g is required');
    }
    let feedPath = process.argv[process.argv.length - 1];
    if (feedPath === '-d' || feedPath === '-g') {
        feedPath = null;
    } else {
        if (!fs.existsSync(feedPath)) {
            printUsageAndExit('feed filepath does not exist');
        }
    }
    return { isDiamonds, isGemstones, feedPath };
}

async function downloadFeed(url, Authorization, target) {

    try {

        const response = await fetch(url, { headers: { Authorization, redirect: 'follow' } });
        
        if (!response.ok) {
            console.error(`Failed to download ${target} feed`);
            return 1;
        }

        const filename = `downloaded-${target}.csv`;
        if (fs.existsSync(filename)) {
            fs.renameSync(filename, `downloaded-${target}-${Date.now()}.csv`);
        }
        
        const fileStream = fs.createWriteStream(filename);
        const reader = response.body.getReader();

        const read = async () => {
 
            const { done, value } = await reader.read();
            if (done) {
                fileStream.end();
                console.log(`Downloaded ${target} feed as ${filename} successfully`);
                return;
            }
 
            fileStream.write(value);
            await read();
        };

        await read();

        return 0;

    } catch (err) {
        console.error(`Fetch failed: ${err.message}`);
        return 1;
    }
}

async function uploadFeed(url, Authorization, target, feedPath) {

    try {
        let response = await fetch(url + '?url=true',  {
            method: 'PUT',
            headers: { Authorization }
        });

        if (!response.ok) {
            console.error(`Failed to upload ${target} feed. Status: ${response.status}`);
            return 1
        }

        const json = await response.json();
        if (!json || !json.url) {
            console.error(`Failed to get redirect url for ${target} feed`);
            return 1;
        }

        const fileStream = fs.createReadStream(feedPath);
        const size = fs.statSync(feedPath).size;

        response = await fetch(json.url, {
            method: 'PUT',
            body: fileStream,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Length': size
            },
            duplex: 'half'
        });

        if (response.ok) {
            console.log(`Uploaded ${target} feed ${feedPath} successfully`);
            return 0;
        } else {
            console.error(`Failed to upload ${target} feed.`);
            return 1;
        }

    } catch (err) {
        console.error(`Fetch failed: ${err.message}`);
        return 1;
    }
}

