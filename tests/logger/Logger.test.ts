
import { mock, test } from 'node:test'
import assert from 'node:assert/strict'
import suite from 'node:test'
import Logger from "../../src/logger/Logger";
import config from "../config";
import fs from 'fs/promises'
import fsSync from 'fs'

const logger = new Logger(config)

await suite('Logger', async () => {

  await test('Logger public method "log"', async (t) => {
    const loggerFilePath = config.getField('LOGGER_FILE_PATH')
    const currDate = new Date
    const dateNow = new Date(Date.now())
    const datedDir = currDate.toISOString().split('T')[0]
    const datedDirPath = loggerFilePath + datedDir
    const inputLog = 'Test 1'
    await logger.log(inputLog)
    
    await t.test('Initiates new directory by date if does not exist.', async () => {
      const logDirectories = await fs.readdir(loggerFilePath)
      const actual = logDirectories.includes(datedDir)
      const expected = true
      assert.strictEqual(actual, expected)
    })
    
    await t.test('Initiates new log file if does not exist.', async() => {
      const datedDirContents = await fs.readdir(datedDirPath)
      const actual = datedDirContents.includes('error_log.txt')
      const expected = true
      assert.strictEqual(actual, expected)
    })

    const logFileContents = fsSync.readFileSync(datedDirPath + '/error_log.txt', 'utf-8')
    const logLines = logFileContents.split('\n')
    assert.strictEqual(logLines.length, 3)

    await t.test('Should have logged an file initiation log', () => {
      const actual = logLines[0]
      const expected = `[${dateNow}]: Initializing log`
      assert.strictEqual(actual, expected)
    })
    
    await t.test('Should have logged the input log', () => {
      const actual = logLines[1]
      const expected = `[${new Date(Date.now())}]: ${inputLog}`
      assert.strictEqual(actual, expected)
    })
      
    fsSync.rmSync(datedDirPath, { recursive: true })

    await t.test('Multiple logs behavior', async (t) => {
      const currDate = new Date
      const dateNow = new Date(Date.now())
      const datedDir = currDate.toISOString().split('T')[0]
      const datedDirPath = loggerFilePath + datedDir

      const testMessage1 = 'Test 2'
      const testMessage2 = 'Test 3'
      await logger.log(testMessage1)
      await logger.log(testMessage2)

      const logFileContents = fsSync.readFileSync(datedDirPath + '/error_log.txt', 'utf-8')
      const logLines = logFileContents.split('\n')
      
      assert.strictEqual(logLines.length, 4)

      const actual1 = logLines[1]
      const expected1 = `[${new Date(dateNow)}]: ${testMessage1}`
      const actual2 = logLines[2]
      const expected2 = `[${new Date(dateNow)}]: ${testMessage2}`

      assert.strictEqual(actual1, expected1)
      assert.strictEqual(actual2, expected2)

      fsSync.rmSync(datedDirPath, { recursive: true })
    })

  })
  
})
