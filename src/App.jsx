import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ekran, setEkran] = useState('login')
  const [greska, setGreska] = useState('')
  const [pojam, setPojam] = useState('')
  const [studenti, setStudenti] = useState([])
  const [izabraniStudent, setIzabraniStudent] = useState(null)
  const [porukaPretrage, setPorukaPretrage] = useState('')
  const [predmet, setPredmet] = useState('')
  const [token, setToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGreska('')

    const response = await fetch('https://masdoc.fon.bg.ac.rs/api/login.php', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (data.uspesno) {
      setToken(data.token)
      setEkran('meni')
    } else {
      setGreska(data.poruka)
    }
  }

  const handlePretraga = async (e) => {
    e.preventDefault()
    setPorukaPretrage('')
    setStudenti([])
    setIzabraniStudent(null)

    const response = await fetch('https://masdoc.fon.bg.ac.rs/api/search.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ pojam }),
    })

    const data = await response.json()

    if (data.uspesno) {
      setStudenti(data.studenti)
    } else {
      setPorukaPretrage(data.poruka)
    }
  }

  const handleGenerisiPdf = async () => {
    const response = await fetch('https://masdoc.fon.bg.ac.rs/api/generate-pdf.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ indeks: izabraniStudent.Indeks }),
    })

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  const handleGenerisiPdfIspitna = async () => {
    const response = await fetch('https://masdoc.fon.bg.ac.rs/api/generate-pdf-ispitna.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ indeks: izabraniStudent.Indeks, predmet }),
    })

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  if (ekran === 'meni') {
    return (
      <div>
        <h1>MASdoc</h1>
        <button onClick={() => setEkran('login')}>Излаз</button>
        <br /><br />
        <button>Пракса и приступни</button>
        <button>ОМОТ CD</button>
        <button onClick={() => setEkran('bodovanje')}>Бодовање</button>
        <button onClick={() => setEkran('ispitna')}>Испитна пријава</button>
        <button>Оригиналност</button>
      </div>
    )
  }

  if (ekran === 'bodovanje') {
    return (
      <div>
        <h1>Бодовање</h1>
        <button onClick={() => setEkran('meni')}>← Назад</button>
        <br /><br />

        <form onSubmit={handlePretraga}>
          <input
            type="text"
            placeholder="Unesi broj indeksa ili prezime"
            value={pojam}
            onChange={(e) => setPojam(e.target.value)}
          />
          <button type="submit">Тражи</button>
        </form>

        {porukaPretrage && <p>{porukaPretrage}</p>}

        {studenti.length > 0 && !izabraniStudent && (
          <ul>
            {studenti.map((s) => (
              <li
                key={s.Indeks}
                onClick={() => setIzabraniStudent(s)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {s.Ime} {s.Prezime} — {s.Indeks}
              </li>
            ))}
          </ul>
        )}

        {izabraniStudent && (
          <div>
            <h3>Изабрани студент:</h3>
            <p>{izabraniStudent.Ime} {izabraniStudent.Prezime}</p>
            <p>Индекс: {izabraniStudent.Indeks}</p>
            <p>Тема: {izabraniStudent.Tema}</p>
            <p>Ментор: {izabraniStudent.Mentor}</p>
            <button onClick={() => setIzabraniStudent(null)}>Промени избор</button>
            <button onClick={handleGenerisiPdf}>Генериши PDF</button>
          </div>
        )}
      </div>
    )
  }

  if (ekran === 'ispitna') {
    return (
      <div>
        <h1>Испитна пријава</h1>
        <button onClick={() => setEkran('meni')}>← Назад</button>
        <br /><br />

        <label>
          <input
            type="radio"
            name="predmet"
            value="Стручна пракса"
            checked={predmet === 'Стручна пракса'}
            onChange={(e) => setPredmet(e.target.value)}
          />
          Стручна пракса
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="predmet"
            value="Приступни рад"
            checked={predmet === 'Приступни рад'}
            onChange={(e) => setPredmet(e.target.value)}
          />
          Приступни рад
        </label>
        <br /><br />

        <form onSubmit={handlePretraga}>
          <input
            type="text"
            placeholder="Unesi broj indeksa ili prezime"
            value={pojam}
            onChange={(e) => setPojam(e.target.value)}
          />
          <button type="submit">Тражи</button>
        </form>

        {porukaPretrage && <p>{porukaPretrage}</p>}

        {studenti.length > 0 && !izabraniStudent && (
          <ul>
            {studenti.map((s) => (
              <li
                key={s.Indeks}
                onClick={() => setIzabraniStudent(s)}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {s.Ime} {s.Prezime} — {s.Indeks}
              </li>
            ))}
          </ul>
        )}

        {izabraniStudent && (
          <div>
            <h3>Изабрани студент:</h3>
            <p>{izabraniStudent.Ime} {izabraniStudent.Prezime}</p>
            <p>Индекс: {izabraniStudent.Indeks}</p>
            <button onClick={() => setIzabraniStudent(null)}>Промени избор</button>
            <button onClick={handleGenerisiPdfIspitna} disabled={!predmet}>Генериши PDF</button>
          </div>
        )}
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