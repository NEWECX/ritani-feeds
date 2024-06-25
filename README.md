# Ritani Feeds Cli

Once you have a vendor id and api key, you can use this program to upload your feed to ritani. Also, you can use it download your latest feed from ritani.

## How to install

```
git clone https://github.com/NEWECX/ritani-feeds.git
cd ritani-feeds
npm install
```

## Usage
```
node index.js 
Usage:

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
```

### First time download diamonds feeds
``` 
node index.js -d
Enter your ritani vendor id: ***
Enter your api key: ***
Do you want to save id and key in .env? (n/y): y
Downloaded diamonds feed as downloaded-diamonds.csv successfully
```

### Download gemstones feeds
```
node index.js -g 
Downloaded gemstones feed as downloaded-gemstones.csv successfully
```

### Upload gemstones feeds 
```
node index.js -g ./gemstones-feeds.csv 
Uploaded gemstones feed ./gemstones-feeds successfully
```