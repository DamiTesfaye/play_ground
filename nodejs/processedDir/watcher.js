const FileWatcher = require('./filewatcher')
const fs = require('fs')

const watchDir = '.'
const processedDir = './processedDir'

const Watcher = new FileWatcher(watchDir, processedDir)

Watcher.on('process', (file) => {
    console.log('one')
    if(file !== 'processedDir') {
        console.log('two')
        const watchFile = `${watchDir}/${file}`

        const processedFile = `${processedDir}/${file.toLowerCase()}`

        fs.rename(watchFile, processedFile, err => {
            if(err) console.log('error : ', err)

            console.log('done!')
        })
    }
})

Watcher.start()
