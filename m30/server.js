const bodyParser = require('body-parser')
const express = require('express')
const fs = require('fs')
const app = express()
app.use(bodyParser.raw({ type: 'application/octet-stream' }))
app.get('/', (request, response) => {
	response.writeHead(200)
	response.end(JSON.stringify(fs.readFileSync('./post.bin', 'binary')))
})
app.post('/', (request, response) => {
	fs.writeFile('post.bin', request.body, 'binary', () => {})
	response.writeHead(200)
	response.end(request.body)
})
const port = 80
app.listen(port)
console.log(`Listening at http://localhost:${port}`)
