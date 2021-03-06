import { EventEmitter } from 'events'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import mongoose from '../src/services/mongoose'

EventEmitter.defaultMaxListeners = Infinity
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

global.Array = Array
global.Date = Date
global.Function = Function
global.Math = Math
global.Number = Number
global.Object = Object
global.RegExp = RegExp
global.String = String
global.Uint8Array = Uint8Array
global.WeakMap = WeakMap
global.Set = Set
global.Error = Error
global.TypeError = TypeError
global.parseInt = parseInt
global.parseFloat = parseFloat
global.console = {
  warn: jest.fn,
  info: jest.fn,
  log: console.log,
  error: console.error,
  debug: console.debug
}

let mongoServer

jest.setTimeout(30000)

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } })
  const mongoUri = await mongoServer.getUri()
  await mongoose.connect(mongoUri, undefined, (err) => {
    if (err) console.error(err)
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  const { collections } = mongoose.connection
  const promises = []
  Object.keys(collections).forEach((collection) => {
    promises.push(collections[collection].deleteMany({}))
  })
  await Promise.all(promises)
})
