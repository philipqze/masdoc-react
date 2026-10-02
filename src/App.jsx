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
  const [istorija, setIstorija] = useState([])
  const [generisanje, setGenerisanje] = useState(false)
  const [pojamIstorija, setPojamIstorija] = useState('')

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

  const handleIstorija = async () => {
    const response = await fetch('https://masdoc.fon.bg.ac.rs/api/istorija.php', {
      headers: {
        'Authorization': token,
      },
    })

    const data = await response.json()

    if (data.uspesno) {
      setIstorija(data.zapisi)
    }

    setEkran('istorija')
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
    setGenerisanje(true)

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

    setGenerisanje(false)
  }

  const handleGenerisiPdfIspitna = async () => {
    setGenerisanje(true)

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

    setGenerisanje(false)
  }

  if (ekran === 'meni') {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">MASdoc</h1>
          <div className="flex gap-3">
            <button
              onClick={handleIstorija}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Историја
            </button>
            <button
              onClick={() => setEkran('login')}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
            >
              Излаз
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
          <button className="bg-white shadow-md rounded-xl p-6 text-lg font-semibold text-gray-800 hover:shadow-lg hover:-translate-y-1 transition">
            Пракса и приступни
          </button>
          <button className="bg-white shadow-md rounded-xl p-6 text-lg font-semibold text-gray-800 hover:shadow-lg hover:-translate-y-1 transition">
            ОМОТ CD
          </button>
          <button
            onClick={() => setEkran('bodovanje')}
            className="bg-white shadow-md rounded-xl p-6 text-lg font-semibold text-gray-800 hover:shadow-lg hover:-translate-y-1 transition"
          >
            Бодовање
          </button>
          <button
            onClick={() => setEkran('ispitna')}
            className="bg-white shadow-md rounded-xl p-6 text-lg font-semibold text-gray-800 hover:shadow-lg hover:-translate-y-1 transition"
          >
            Испитна пријава
          </button>
          <button className="bg-white shadow-md rounded-xl p-6 text-lg font-semibold text-gray-800 hover:shadow-lg hover:-translate-y-1 transition">
            Оригиналност
          </button>
        </div>
      </div>
    )
  }

  if (ekran === 'bodovanje') {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setEkran('meni')}
              className="text-gray-500 hover:text-gray-800 transition text-xl"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Бодовање</h1>
          </div>

          <form onSubmit={handlePretraga} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Unesi broj indeksa ili prezime"
              value={pojam}
              onChange={(e) => setPojam(e.target.value)}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Тражи
            </button>
          </form>

          {porukaPretrage && (
            <p className="text-gray-500 text-center mb-4">{porukaPretrage}</p>
          )}

          {studenti.length > 0 && !izabraniStudent && (
            <div className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
              {studenti.map((s) => (
                <div
                  key={s.Indeks}
                  onClick={() => setIzabraniStudent(s)}
                  className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-800">{s.Ime} {s.Prezime}</span>
                  <span className="text-gray-400 ml-2 text-sm">{s.Indeks}</span>
                </div>
              ))}
            </div>
          )}

          {izabraniStudent && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Изабрани студент</h3>
              <div className="space-y-1 text-gray-600 mb-5">
                <p><span className="text-gray-400">Име:</span> {izabraniStudent.Ime} {izabraniStudent.Prezime}</p>
                <p><span className="text-gray-400">Индекс:</span> {izabraniStudent.Indeks}</p>
                <p><span className="text-gray-400">Тема:</span> {izabraniStudent.Tema}</p>
                <p><span className="text-gray-400">Ментор:</span> {izabraniStudent.Mentor}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIzabraniStudent(null)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Промени избор
                </button>
                <button
                  onClick={handleGenerisiPdf}
                  disabled={generisanje}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {generisanje ? 'Генеришем...' : 'Генериши PDF'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (ekran === 'ispitna') {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setEkran('meni')}
              className="text-gray-500 hover:text-gray-800 transition text-xl"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Испитна пријава</h1>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 mb-6">
            <p className="text-sm text-gray-500 mb-3">Тип</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="predmet"
                  value="Стручна пракса"
                  checked={predmet === 'Стручна пракса'}
                  onChange={(e) => setPredmet(e.target.value)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-800">Стручна пракса</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="predmet"
                  value="Приступни рад"
                  checked={predmet === 'Приступни рад'}
                  onChange={(e) => setPredmet(e.target.value)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-gray-800">Приступни рад</span>
              </label>
            </div>
          </div>

          <form onSubmit={handlePretraga} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Unesi broj indeksa ili prezime"
              value={pojam}
              onChange={(e) => setPojam(e.target.value)}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Тражи
            </button>
          </form>

          {porukaPretrage && (
            <p className="text-gray-500 text-center mb-4">{porukaPretrage}</p>
          )}

          {studenti.length > 0 && !izabraniStudent && (
            <div className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
              {studenti.map((s) => (
                <div
                  key={s.Indeks}
                  onClick={() => setIzabraniStudent(s)}
                  className="px-5 py-3 cursor-pointer hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-800">{s.Ime} {s.Prezime}</span>
                  <span className="text-gray-400 ml-2 text-sm">{s.Indeks}</span>
                </div>
              ))}
            </div>
          )}

          {izabraniStudent && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Изабрани студент</h3>
              <div className="space-y-1 text-gray-600 mb-5">
                <p><span className="text-gray-400">Име:</span> {izabraniStudent.Ime} {izabraniStudent.Prezime}</p>
                <p><span className="text-gray-400">Индекс:</span> {izabraniStudent.Indeks}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIzabraniStudent(null)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Промени избор
                </button>
                <button
                  onClick={handleGenerisiPdfIspitna}
                  disabled={!predmet || generisanje}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {generisanje ? 'Генеришем...' : 'Генериши PDF'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (ekran === 'istorija') {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setEkran('meni')}
            className="text-gray-500 hover:text-gray-800 transition text-xl"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Историја</h1>
        </div>
<input
  type="text"
  placeholder="Претражи по студенту, индексу или кориснику..."
  value={pojamIstorija}
  onChange={(e) => setPojamIstorija(e.target.value)}
  className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
  <tr>
    <th className="px-5 py-3 text-sm font-semibold text-gray-600">Корисник</th>
    <th className="px-5 py-3 text-sm font-semibold text-gray-600">Тип документа</th>
    <th className="px-5 py-3 text-sm font-semibold text-gray-600">Студент</th>
    <th className="px-5 py-3 text-sm font-semibold text-gray-600">Индекс</th>
    <th className="px-5 py-3 text-sm font-semibold text-gray-600">Датум</th>
    <th className="px-5 py-3 text-sm font-semibold text-gray-600">Време</th>
  </tr>
</thead>
<tbody className="divide-y divide-gray-100">
  {istorija
    .filter((z) =>
      z.student_ime.toLowerCase().includes(pojamIstorija.toLowerCase()) ||
      z.student_prezime.toLowerCase().includes(pojamIstorija.toLowerCase()) ||
      z.student_indeks.includes(pojamIstorija) ||
      z.korisnik.toLowerCase().includes(pojamIstorija.toLowerCase())
    )
    .map((z) => (
      <tr key={z.id} className="hover:bg-gray-50 transition">
        <td className="px-5 py-3 text-gray-800">{z.korisnik}</td>
        <td className="px-5 py-3 text-gray-800">{z.tip_dokumenta}</td>
        <td className="px-5 py-3 text-gray-800">{z.student_ime} {z.student_prezime}</td>
        <td className="px-5 py-3 text-gray-500">{z.student_indeks}</td>
        <td className="px-5 py-3 text-gray-500 text-sm">{z.datum_formatiran}</td>
        <td className="px-5 py-3 text-gray-500 text-sm">{z.vreme_formatirano}</td>
      </tr>
    ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">MASdoc</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
          >
            Uloguj se
          </button>
          {greska && <p className="text-red-600 text-sm text-center">{greska}</p>}
        </form>
      </div>
    </div>
  )
}

export default App