const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')

const app = express()

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'front', 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'front', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000
const MONGO_URI = config.get('mongoUri')

async function start() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch(err) {
        console.log(`Server error ${err}`)
        process.exit(1)
    }
}

start()

app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`)) 