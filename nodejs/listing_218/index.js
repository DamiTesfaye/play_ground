const fs = require('fs');
const tasks = [];
let completedTask = 0;
const wordCounts = {};

const fileDir = './files';

const checkIfComplete = () => {
    completedTask++;

    if(completedTask === tasks.length) {
        for(let word in wordCounts) {
            // console.log(`${word}: ${wordCounts[word]}`);
        }
    }
}

const addWordCount = (word) => {
    wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
}

const countWordsInText = (text) => {
    const words = text.toString().toLowerCase().split(/\W+/).sort();

    words.forEach(words => addWordCount(words));
}

fs.readdir(fileDir, (err, files) => {
    if(err) throw err;

    files.forEach(file => {
        const task = (file => {
            return () => {
                fs.readFile(file, (err, text) => {
                    if (err) throw err;
                    console.log('word; ', text.toString())
                    countWordsInText(text);
                    checkIfComplete();
                });
            }
        })(`${fileDir}/${file}`)
        tasks.push(task);
    })
    tasks.forEach(task => task())
})
