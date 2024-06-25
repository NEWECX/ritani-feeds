# Ritani Feeds Cli

Once you have a vendor id and api key, you can use this program to upload your feed to ritani. Also, you can use it download your latest feed and report from ritani.

## How to install

```
npm install @ritani/feeds -g

```
For installing nodejs and npm, please refer to [NodeJs Site](https://nodejs.org/en/download/package-manager)

## Usage
```
ritani-feeds

Usage:

# download diamonds feed
ritani-feeds -d

# download diamonds batching report
ritani-feeds -dr

# upload diamonds feed
ritani-feeds -d /path/to/feed-file.csv

# download gemstones feed
ritani-feeds -g

# download gemstones batching report
ritani-feeds -gr

# upload gemstones feed
ritani-feeds -g /path/to/feed-file.csv

Note:
if .env file is present in the current directory, it will be used to get the credentials.
otherwise, the script will prompt for ritani vendor id and api key.
```

### First time download diamonds feeds
``` 
ritani-feeds -d
Enter your ritani vendor id: ***
Enter your api key: ***
Do you want to save id and key in .env? (n/y): y
Downloaded diamonds feed as downloaded-diamonds.csv successfully
```

### Download diamonds batching process report
``` 
ritani-feeds -dr
Downloaded diamonds report as diamonds-report.csv successfully
```

### Download gemstones feeds
```
ritani-feeds -g 
Downloaded gemstones feed as downloaded-gemstones.csv successfully
```

### Upload gemstones feeds 
```
ritani-feeds -g ./gemstones-feeds.csv 
Uploaded gemstones feed ./gemstones-feeds successfully
```