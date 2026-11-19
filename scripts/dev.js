import { spawn } from 'node:child_process'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const children = [
  spawn(npm, ['--prefix', 'server', 'run', 'dev'], { stdio: 'inherit', shell: process.platform === 'win32' }),
  spawn(npm, ['run', 'dev'], { stdio: 'inherit', shell: process.platform === 'win32' }),
]

let closing = false
function shutdown(code = 0) {
  if (closing) return
  closing = true
  children.forEach((child) => {
    if (!child.killed) child.kill('SIGTERM')
  })
  process.exit(code)
}

children.forEach((child) => child.on('exit', (code) => shutdown(code || 0)))
process.on('SIGINT', () => shutdown())
process.on('SIGTERM', () => shutdown())
