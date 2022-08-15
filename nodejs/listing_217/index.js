const fs = require('fs');
const htmlparser = require('htmlparser');
const request = require('request');
const http = require('http')

const configFilename = './rss_feeds.txt';

const checkForRSSFile = () => {
    // fs.access(configFilename, fs.constants.R_OK, (err) => {
    //     console.log('\n> Checking Permission for reading the file');
    //     if(err) return next(new Error(`Missing RSS file: ${configFilename}`));
    //
    //     next(null, configFilename);
    // })

    fs.exists(configFilename, (exists) => {
        if(!exists) return next(new Error(`Missing RSS file: ${configFilename}`))

        next(null, configFilename);
    })
}

const readRSSFile = (configFilename) => {
    fs.readFile(configFilename, (err, feedList) => {
        if(err) return next(err);

        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split('\n');

        const randomFeed = Math.floor(Math.random() * feedList.length);

        next(null, feedList[randomFeed]);
    })
}

const downloadRSSFile = (feedUrl) => {
    request({uri: feedUrl}, (err, res, body) => {
        if(err) next(err);

        if(res.statusCode !== 200) return next(new Error('Abnormal response status code'));

        next(null, body);
    })
}

const parseRSSFile = (rss) => {
    const handler = new htmlparser.RssHandler();
    const parser = new htmlparser.Parser(handler);

    parser.parseComplete(rss);

    // if(!handler.dom.items.length) return next(new Error('no RSS item found'));
    //
    // const item = handler.dom.items.shift();
    //
    // console.log('title: ', item.title, '\n', 'link: ', item.link, '\n');

    http.createServer((req, res) => {
        if(req.url === '/') {
            res.writeHead(200, {'content-Type': 'text/html'});

            rss = rss.toString()
            res.end(rss)
        }
    }).listen(8080, () => {
        console.log('listening on port 8080')
    })

}

const tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFile,
    parseRSSFile
];

const next = (err, result) => {
    if (err) throw err;

    const currentTask = tasks.shift();

    if(currentTask) {
        currentTask(result);
    }
}

next();
