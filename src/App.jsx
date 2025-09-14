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
    <div style={{
      minHeight: '160vh',
      width: '100vw',
      background: "url('/icon/AstroSaatIcon2.png') center center no-repeat",
        backgroundSize: 'cover',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
    }}>
      <h1>Hoşgeldiniz!</h1>
      <div className="card">
        {/* Tarih seçimi kaldırıldı, NextPage'de olacak */}
        <button onClick={getLocation}>
          Gezegen kaç?
        </button>
        {location && (
          <div style={{ marginTop: '1em' }}>
            <strong>Konumunuz:</strong><br />
            Enlem: {location.latitude} <br />
            Boylam: {location.longitude}
            <div style={{ marginTop: '1em', display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/today', { state: { locationInfo: location } })} style={{padding:'8px 16px', borderRadius:8, border:'none', fontWeight:'bold', background:'#ffd700'}}>Bugün</button>
              <button onClick={() => navigate('/next', { state: { locationInfo: location } })} style={{padding:'8px 16px', borderRadius:8, border:'none', fontWeight:'bold', background:'#eee'}}>Liste</button>
            </div>
          </div>
        )}
        {error && (
          <div style={{ color: 'red', marginTop: '1em' }}>{error}</div>
        )}
      </div>
      <p className="read-the-docs">
        Enlem-boylam hesaplaması yapmak üzere güncel konumunuz alınacak ancak kayıt edilmeyecektir.
      </p>
    </div>
  )
}

export default App
