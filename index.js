'use strict';

const {
    getCredentials,
    getOptions,
    downloadFeed,
    uploadFeed
} = require('./utils');

const apiUrl = 'https://api-server.newecx.com/api/feeds';

(async () => {
    const { isDiamonds, feedPath } = getOptions();
    const { id, key } = await getCredentials(apiUrl);
    const Authorization = `Bearer ${id}:${key}`;
    const target = isDiamonds ? 'diamonds' : 'gemstones';
    const url = apiUrl + `/${target}`;
    if (feedPath) {
        return uploadFeed(url, Authorization, target, feedPath);
    } else {
        return downloadFeed(url, Authorization, target);
    }
})();