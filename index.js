#!/usr/bin/env node

import { main } from './utils.js';

(async () => {
    if (await main()) {
        process.exit(0);
    } else {
        process.exit(1);
    }
})();