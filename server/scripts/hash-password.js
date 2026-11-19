import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { hashPassword } from '../src/auth.js'

let password = process.argv.slice(2).join(' ')

if (!password) {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  password = await rl.question('Kata sandi admin (min. 12 karakter): ')
  rl.close()
}

if (password.length < 12) {
  console.error('Kata sandi minimal 12 karakter.')
  process.exit(1)
}

console.log('\nHash scrypt siap dipakai (mis. lewat script admin atau kolom password_hash):\n')
console.log(hashPassword(password))
