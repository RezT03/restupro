import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { db, initDb } from '../src/db.js'
import { hashPassword } from '../src/auth.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const usage = `
Pengelolaan admin di MySQL.

  npm run admin -- list
  npm run admin -- add <email> [password]
  npm run admin -- password [email] [password-baru]
  npm run admin -- email <email-lama> <email-baru>
  npm run admin -- remove <email>

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

const emailValue = (value) => {
  const email = String(value || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) throw new Error(`Email tidak valid: ${value || '(kosong)'}`)
  return email
}

const passwordValue = (value) => {
  const password = String(value || '')
  if (password.length < 12) throw new Error('Kata sandi minimal 12 karakter.')
  return password
}

const allAdmins = async () => {
  const [rows] = await db().query('SELECT id, email, password_hash FROM admins ORDER BY id')
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
      'SELECT id, email, created_at, updated_at FROM admins ORDER BY id',
    )
    if (!rows.length) {
      console.log('Belum ada admin. Tambahkan dengan: npm run admin -- add <email>')
      return
    }
    for (const row of rows) {
      console.log(`#${row.id}  ${row.email}  (dibuat ${row.created_at}, diubah ${row.updated_at})`)
    }
    return
  }

  if (command === 'add') {
    const email = emailValue(args[0] || (await ask('Email admin baru: ')))
    const existing = await db().query('SELECT id FROM admins WHERE email = ?', [email])
    if (existing[0].length) throw new Error(`Email ${email} sudah terdaftar.`)
    const password = passwordValue(args[1] || (await ask('Kata sandi (min. 12 karakter): ')))
    const now = new Date().toISOString()
    await db().query(
      'INSERT INTO admins (email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [email, hashPassword(password), now, now],
    )
    console.log(`Admin ${email} ditambahkan ke MySQL.`)
    return
  }

  if (command === 'password') {
    const admins = await allAdmins()
    let email = args[0]
    if (!email) {
      if (admins.length !== 1) {
        throw new Error('Tentukan email admin, atau hapus argumen jika hanya ada satu admin.')
      }
      email = admins[0].email
    }
    email = emailValue(email)
    if (!admins.some((item) => item.email === email)) {
      throw new Error(`Admin ${email} tidak ditemukan.`)
    }
    const password = passwordValue(args[1] || (await ask('Kata sandi baru (min. 12 karakter): ')))
    await db().query('UPDATE admins SET password_hash = ?, updated_at = ? WHERE email = ?', [
      hashPassword(password),
      new Date().toISOString(),
      email,
    ])
    console.log(`Kata sandi ${email} diperbarui di MySQL.`)
    console.log('Sesi yang sedang aktif tetap berlaku hingga kedaluwarsa; restart server untuk mencabutnya.')
    return
  }

  if (command === 'email') {
    const oldEmail = emailValue(args[0] || (await ask('Email lama: ')))
    const newEmail = emailValue(args[1] || (await ask('Email baru: ')))
    const [result] = await db().query(
      'UPDATE admins SET email = ?, updated_at = ? WHERE email = ?',
      [newEmail, new Date().toISOString(), oldEmail],
    )
    if (!result.affectedRows) throw new Error(`Admin ${oldEmail} tidak ditemukan.`)
    console.log(`Email admin diubah: ${oldEmail} → ${newEmail}`)
    return
  }

  if (command === 'remove') {
    const email = emailValue(args[0] || (await ask('Email admin yang dihapus: ')))
    const [count] = await db().query('SELECT COUNT(*) AS total FROM admins')
    if (Number(count[0].total) <= 1) throw new Error('Tidak bisa menghapus admin terakhir.')
    const [result] = await db().query('DELETE FROM admins WHERE email = ?', [email])
    if (!result.affectedRows) throw new Error(`Admin ${email} tidak ditemukan.`)
    console.log(`Admin ${email} dihapus dari MySQL.`)
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
