const express = require('express')
const app = express()
const WSserver = require('express-ws')(app)
const aWss = WSserver.getWss()
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    console.log('Подключение с вебсокетом установлено')

    ws.on('message', (msg) => {
        // ws.send('Вы успешно подключены')
        // console.log(msg)
        msg = JSON.parse(msg)

        switch (msg.method) {
            case 'connection':
                connectionHandler(ws, msg)
                break;
            case 'draw':
                broadcastHandler(ws, msg)
                break;
            case 'chat':
                chatHandler(ws, msg)
                break;

            default:
                break;
        }
    })
})


app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({
            message: 'Загружено'
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json('Error: ' + error)
    }
})

app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    } catch (error) {
        console.error(error)
        return res.status(500).json('Error: ' + error)
    }
})


app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))

//------------------------------------- need to decompose
const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastHandler(ws, msg)
}

const broadcastHandler = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}

const chatHandler = (ws, msg) => {
    console.log('chat hanler: ');
    console.log(msg);
    ws.id = msg.id
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}