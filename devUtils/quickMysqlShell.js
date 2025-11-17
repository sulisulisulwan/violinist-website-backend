import { spawn } from 'child_process'
import fs from 'fs/promises'
import url from 'url'
import path from 'path';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const quickMysqlShell = async () => {

  const configPath = path.resolve(__dirname, './utils.config.json')
  const configJSON =  await fs.readFile(configPath, 'utf8')
  const config = JSON.parse(configJSON)

  spawn('mysql', ['-u', config.MYSQL_USER, `-p${config.MYSQL_PASSWORD}`, config.MYSQL_DB], 
    { stdio: 'inherit' }
  ); 

}

quickMysqlShell()