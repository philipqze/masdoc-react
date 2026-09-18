import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ulogovan, setUlogovan] = useState(false)
  const [greska, setGreska] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGreska('')

    const response = await fetch('https://masdoc.fon.bg.ac.rs/api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (data.uspesno) {
      setUlogovan(true)
    } else {
      setGreska(data.poruka)
    }
  }

  if (ulogovan) {
    return (
      <div>
        <h1>Dobrodošli!</h1>
        <p>Uspešno ste ulogovani.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>MASdoc</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Uloguj se</button>
        {greska && <p style={{ color: 'red' }}>{greska}</p>}
      </form>
    </div>
  )
}

export default App