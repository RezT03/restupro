import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { db, initDb } from '../src/db.js'
import { hashPassword } from '../src/auth.js'

const USERNAME_RE = /^[a-z0-9_.-]{3,50}$/

const usage = `
Pengelolaan admin di MySQL.

  npm run admin -- list
  npm run admin -- add <username> [password]
  npm run admin -- password [username] [password-baru]
  npm run admin -- rename <username-lama> <username-baru>
  npm run admin -- remove <username>

Jika password tidak diberikan sebagai argumen, akan ditanyakan interaktif.
`

const ask = async (label) => {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  try {
    return (await rl.question(label)).trim()
  } finally {
    rl.close()
  }
}

const usernameValue = (value) => {
  const username = String(value || '').trim().toLowerCase()
  if (!USERNAME_RE.test(username)) {
    throw new Error(`Username tidak valid (3–50 karakter: huruf kecil, angka, ., _, -): ${value || '(kosong)'}`)
  }
  return username
}

const passwordValue = (value) => {
  const password = String(value || '')
  if (password.length < 12) throw new Error('Kata sandi minimal 12 karakter.')
  return password
}

const allAdmins = async () => {
  const [rows] = await db().query('SELECT id, username, password_hash FROM admins ORDER BY id')
  return rows
}

async function run() {
  const [command, ...args] = process.argv.slice(2)

  if (!command || command === 'help') {
    console.log(usage)
    return
  }

  if (command === 'list') {
    const [rows] = await db().query(
      'SELECT id, username, created_at, updated_at FROM admins ORDER BY id',
    )
    if (!rows.length) {
      console.log('Belum ada admin. Tambahkan dengan: npm run admin -- add <username>')
      return
    }
    for (const row of rows) {
      console.log(`#${row.id}  ${row.username}  (dibuat ${row.created_at}, diubah ${row.updated_at})`)
    }
    return
  }

  if (command === 'add') {
    const username = usernameValue(args[0] || (await ask('Username admin baru: ')))
    const existing = await db().query('SELECT id FROM admins WHERE username = ?', [username])
    if (existing[0].length) throw new Error(`Username ${username} sudah terdaftar.`)
    const password = passwordValue(args[1] || (await ask('Kata sandi (min. 12 karakter): ')))
    const now = new Date().toISOString()
    await db().query(
      'INSERT INTO admins (username, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [username, hashPassword(password), now, now],
    )
    console.log(`Admin ${username} ditambahkan ke MySQL.`)
    return
  }

  if (command === 'password') {
    const admins = await allAdmins()
    let username = args[0]
    if (!username) {
      if (admins.length !== 1) {
        throw new Error('Tentukan username admin, atau hapus argumen jika hanya ada satu admin.')
      }
      username = admins[0].username
    }
    username = usernameValue(username)
    if (!admins.some((item) => item.username === username)) {
      throw new Error(`Admin ${username} tidak ditemukan.`)
    }
    const password = passwordValue(args[1] || (await ask('Kata sandi baru (min. 12 karakter): ')))
    await db().query('UPDATE admins SET password_hash = ?, updated_at = ? WHERE username = ?', [
      hashPassword(password),
      new Date().toISOString(),
      username,
    ])
    console.log(`Kata sandi ${username} diperbarui di MySQL.`)
    console.log('Sesi yang sedang aktif tetap berlaku hingga kedaluwarsa; restart server untuk mencabutnya.')
    return
  }

  if (command === 'rename') {
    const oldUsername = usernameValue(args[0] || (await ask('Username lama: ')))
    const newUsername = usernameValue(args[1] || (await ask('Username baru: ')))
    const [result] = await db().query(
      'UPDATE admins SET username = ?, updated_at = ? WHERE username = ?',
      [newUsername, new Date().toISOString(), oldUsername],
    )
    if (!result.affectedRows) throw new Error(`Admin ${oldUsername} tidak ditemukan.`)
    console.log(`Username admin diubah: ${oldUsername} → ${newUsername}`)
    return
  }

  if (command === 'remove') {
    const username = usernameValue(args[0] || (await ask('Username admin yang dihapus: ')))
    const [count] = await db().query('SELECT COUNT(*) AS total FROM admins')
    if (Number(count[0].total) <= 1) throw new Error('Tidak bisa menghapus admin terakhir.')
    const [result] = await db().query('DELETE FROM admins WHERE username = ?', [username])
    if (!result.affectedRows) throw new Error(`Admin ${username} tidak ditemukan.`)
    console.log(`Admin ${username} dihapus dari MySQL.`)
    return
  }

  throw new Error(`Perintah tidak dikenal: ${command}`)
}

await initDb()
try {
  await run()
} catch (error) {
  console.error(`Gagal: ${error.message}`)
  process.exitCode = 1
} finally {
  await db().end()
}
