import { spawn } from 'child_process'
import fs from 'fs/promises'
import url from 'url'
import path from 'path';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))




const sshEC2 = async () => {
  const configPath = path.resolve(__dirname, './utils.config.json')
  const configJSON =  await fs.readFile(configPath, 'utf8')

  const config = JSON.parse(configJSON)
  const keyPath = path.resolve(__dirname, config.SSH_KEY_PATH)

  spawn('ssh', ['-i', keyPath, config.EC2_NAME], { stdio: 'inherit' }); 
}

sshEC2()

