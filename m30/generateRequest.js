const fs = require('fs')
const sensorInitializeKey = new Int8Array([-1])
const date = new Float64Array([Date.now()])
const sensorKey = new Int8Array([1])
const batch = new Uint8Array([1])
const timestamp = new Float32Array([234098235])
const x = new Float32Array([1.5])
const y = new Float32Array([-1.2])
const z = new Float32Array([-9.81])
const filename = 'request.bin'
const mode = 'binary'
fs.appendFileSync(filename, Buffer.from(sensorInitializeKey.buffer), mode)
fs.appendFileSync(filename, Buffer.from(date.buffer), mode)
fs.appendFileSync(filename, Buffer.from(sensorKey.buffer), mode)
fs.appendFileSync(filename, Buffer.from(batch.buffer), mode)
fs.appendFileSync(filename, Buffer.from(timestamp.buffer), mode)
fs.appendFileSync(filename, Buffer.from(x.buffer), mode)
fs.appendFileSync(filename, Buffer.from(y.buffer), mode)
fs.appendFileSync(filename, Buffer.from(z.buffer), mode)
