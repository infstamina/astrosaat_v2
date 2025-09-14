import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import NextPage from './NextPage';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function App() {
  const [count, setCount] = useState(0);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Manuel ilçe seçimi kaldırıldı

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Konum servisi desteklenmiyor.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setError(null);
      },
      (err) => {
        setError('Konum alınamadı: ' + err.message);
      }
    );
  };



  return (
    <>
      <div style={{
        background: "url('/icon/AstroSaatIcon5x.png')"
      }}>
        <img src="/icon/AstroSaatIcon4.png" width={380}/>
          <p className="read-the-docs">Enlem-boylam hesaplaması yapmak üzere <br />güncel konumunuz alınacak ancak <br />kayıt edilmeyecektir.</p>
          {location && (
            <div style={{ marginTop: '1em' }}>
              <button onClick={() => navigate('/today', { state: { locationInfo: location } })} style={{ background:'#ffd700'}}>Bugün</button>
              <button onClick={() => navigate('/next', { state: { locationInfo: location } })} style={{ background:'#eee'}}>Liste</button>
            </div>
          )}
          {!location && (
            <div style={{ marginTop: '1em' }}>
              <button onClick={getLocation}>
                Konum Al
              </button>
            </div>
          )}
          {error && (
            <div style={{ color: 'red', marginTop: '1em' }}>{error}</div>
          )}
          <br />
      </div>
    </>
  )
}

export default App
