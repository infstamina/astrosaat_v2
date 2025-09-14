import SunCalc from 'suncalc';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import './Today.css';

export default function Today() {
  const [selectedPlanetIdx, setSelectedPlanetIdx] = useState(null);
  const planetCardsRef = useRef([]);
  const locationRouter = useLocation();
  const locationInfo = locationRouter.state?.locationInfo;

  // Bugünün tarihi
  const today = new Date();
  const dateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
  const dateStr = today.toLocaleDateString('tr-TR');
  const timeStr = today.toLocaleTimeString('tr-TR');

  // Konum bilgisi
  let lat = null, lng = null;
  if (locationInfo) {
    lat = locationInfo.latitude || locationInfo.lat;
    lng = locationInfo.longitude || locationInfo.lng;
  }

  let sunrise = null, sunset = null, nextSunrise = null, nextSunset = null;
  let dayDuration = null, nightDuration = null;
  if (lat && lng) {
    const todayTimes = SunCalc.getTimes(dateObj, lat, lng);
    sunrise = todayTimes.sunrise;
    sunset = todayTimes.sunset;
    // Ertesi gün için
    const tomorrow = new Date(dateObj);
    tomorrow.setDate(dateObj.getDate() + 1);
    const tomorrowTimes = SunCalc.getTimes(tomorrow, lat, lng);
    nextSunrise = tomorrowTimes.sunrise;
    nextSunset = tomorrowTimes.sunset;
    // Gündüz süresi (gün batımı - gün doğumu)
    if (sunrise && sunset) {
      dayDuration = (sunset - sunrise) / 1000; // saniye
    }
    // Gece süresi (ertesi gün doğumu - önceki gün batımı)
    if (sunset && nextSunrise) {
      nightDuration = (nextSunrise - sunset) / 1000; // saniye
    }
  }
  function formatDuration(seconds) {
    if (seconds == null) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h} saat ${m} dk ${s} sn`;
  }

  // Gezegen isimleri, ikonları ve renkleri
  const planetData = [
    { name: 'Satürn', icon: '🪐', color: '#bdbdbd', info: 'Disiplin, sorumluluk, sınırlar, sabır, olgunluk, yapı, kısıtlama, dersler.' },
    { name: 'Jüpiter', icon: '🟤', color: '#c49a6c', info: 'Bolluk, şans, büyüme, genişleme, bilgelik, inanç, iyimserlik, fırsatlar.' },
    { name: 'Mars', icon: '🔴', color: '#e53935', info: 'Enerji, hareket, mücadele, cesaret, irade, öfke, motivasyon, girişim.' },
    { name: 'Güneş', icon: '☀️', color: '#ffd600', info: 'Kimlik, yaşam enerjisi, ego, yaratıcılık, liderlik, öz güven, merkez.' },
    { name: 'Venüs', icon: '🟣', color: '#ba68c8', info: 'Aşk, güzellik, uyum, sanat, değerler, ilişkiler, çekicilik, zevk.' },
    { name: 'Merkür', icon: '⚪', color: '#b0bec5', info: 'Zihin, iletişim, mantık, öğrenme, hareket, ticaret, analiz.' },
    { name: 'Ay', icon: '🌙', color: '#90caf9', info: 'Duygular, içgüdü, alışkanlıklar, annelik, güvenlik, bilinçaltı.' },
  ];

  // Haftanın günü -> gündüz/gece ilk gezegeni (Pazar:0, Pazartesi:1, ...)
  // Pazar: Güneş, Pazartesi: Ay, Salı: Mars, Çarşamba: Merkür, Perşembe: Jüpiter, Cuma: Venüs, Cumartesi: Satürn
  const weekdayFirstPlanetIdx = [3, 6, 2, 5, 1, 4, 0];
  const weekday = dateObj.getDay();
  const firstPlanetIdx = weekdayFirstPlanetIdx[weekday];

  // Gezegen saatleri için gündüz ve gece sürelerini 12'ye böl ve saat aralıklarını hesapla, gezegen isimlerini sırala
  let dayPlanetHours = [], nightPlanetHours = [];
  if (dayDuration && sunrise && sunset) {
    const part = dayDuration / 12;
    let start = new Date(sunrise);
    for (let i = 0; i < 12; i++) {
      let end = new Date(start.getTime() + part * 1000);
      // Gündüz saatleri için gezegen sırası: ilk gezegen + i
      const planetIdx = (firstPlanetIdx + i) % 7;
      dayPlanetHours.push({
        start: new Date(start),
        end: new Date(end),
        planet: planetData[planetIdx].name,
        icon: planetData[planetIdx].icon,
        color: planetData[planetIdx].color,
        type: 'day',
      });
      start = end;
    }
  }
  if (nightDuration && sunset && nextSunrise) {
    const part = nightDuration / 12;
    let start = new Date(sunset);
    for (let i = 0; i < 12; i++) {
      let end = new Date(start.getTime() + part * 1000);
      // Gece saatleri için gezegen sırası: ilk gezegen + 12 + i
      const planetIdx = (firstPlanetIdx + 12 + i) % 7;
      nightPlanetHours.push({
        start: new Date(start),
        end: new Date(end),
        planet: planetData[planetIdx].name,
        icon: planetData[planetIdx].icon,
        color: planetData[planetIdx].color,
        type: 'night',
      });
      start = end;
    }
  }

  // Şu anki gezegen aralığını bul
  const now = today;
  const allPlanetHours = [...dayPlanetHours, ...nightPlanetHours];
  const currentPlanetIdx = allPlanetHours.findIndex(
    (d) => now >= d.start && now < d.end
  );
  // Seçili gezegen indexi: tıklanmadıysa anlık gezegen, tıklandıysa seçili
  const activePlanetIdx = selectedPlanetIdx !== null ? selectedPlanetIdx : currentPlanetIdx;

  // Scroll ve işaretleme için effect
  useEffect(() => {
    if (activePlanetIdx !== -1 && planetCardsRef.current[activePlanetIdx]) {
      planetCardsRef.current[activePlanetIdx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activePlanetIdx]);
  function formatTime(date) {
    if (!date) return '-';
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // An'ı yakala butonuna tıklandığında scroll için
  const handleCatchMoment = () => {
    setSelectedPlanetIdx(currentPlanetIdx);
    setTimeout(() => {
      if (planetCardsRef.current[currentPlanetIdx]) {
        planetCardsRef.current[currentPlanetIdx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 50);
  };

  return (
  <div style={{ padding: '24px 4vw', maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{textAlign:'center', fontSize:'2.1rem', marginBottom:8, letterSpacing:1}}>Bugünün Gezegen Saatleri</h2>
      <div style={{textAlign:'center', marginBottom: 16}}>
        <button
          style={{
            background: '#ffd600',
            color: '#1a237e',
            border: 'none',
            borderRadius: 8,
            padding: '10px 22px',
            fontWeight: 'bold',
            fontSize: '1.08rem',
            cursor: 'pointer',
            boxShadow: '0 1px 6px 0 rgba(0,0,0,0.08)',
            transition: 'background 0.2s',
          }}
          onClick={handleCatchMoment}
        >
          An'ı yakala
        </button>
      </div>
      <div style={{textAlign:'center', color:'#888', marginBottom:18}}>
        <span style={{fontWeight:'bold'}}>Tarih:</span> {dateStr} &nbsp; <span style={{fontWeight:'bold'}}>Saat:</span> {timeStr}
      </div>
      <div style={{textAlign:'center', marginBottom:18}}>
        <span style={{fontWeight:'bold'}}>Konum:</span> {lat && lng ? `Enlem: ${lat}  Boylam: ${lng}` : 'Konum bilgisi bulunamadı.'}
      </div>
      {/* Gündüz + Gece Saatleri Scrollable */}
      <div style={{margin:'32px 0'}}>
        <div style={{fontWeight:'bold', fontSize:'1.15rem', marginBottom: 8, color:'#1a237e'}}>Gündüz & Gece Gezegen Saatleri</div>
        <div style={{color:'#666', fontSize:'0.98rem', marginBottom: 8}}>
          Gündüz: {formatTime(sunrise)} - {formatTime(sunset)} &nbsp; <em>Fark:</em> {formatDuration(dayDuration)} &nbsp; Gezegen Süresi: {formatDuration(dayDuration / 12)}<br />
          Gece: {formatTime(sunset)} - {formatTime(nextSunrise)} &nbsp; <em>Fark:</em> {formatDuration(nightDuration)} &nbsp; Gezegen Süresi: {formatDuration(nightDuration / 12)}
        </div>
        <div className="planet-cards">
          {allPlanetHours.map((d, i) => (
            <div
              className={`planet-card planet-${d.type}${i === activePlanetIdx ? ' planet-current' : ''}`}
              key={i}
              ref={el => planetCardsRef.current[i] = el}
              style={{'--card-bg': d.type === 'day' ? '#f7faff' : '#23243a', '--card-fg': d.color}}
              onClick={() => setSelectedPlanetIdx(i)}
            >
              <div className="planet-icon" style={{color: d.color}}>{d.icon}</div>
              <div className="planet-label">{d.planet}</div>
              <div className="planet-time">{i+1}. {formatTime(d.start)} - {formatTime(d.end)}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Seçili gezegenin tema bilgileri kartı */}
      {activePlanetIdx !== -1 && (
        <>
        <div className="planet-theme-card" style={{
          margin: '0 auto',
          marginTop: 24,
          maxWidth: 340,
          background: '#fff',
          color: '#1a237e',
          borderRadius: 18,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
          padding: '22px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: `2px solid ${allPlanetHours[activePlanetIdx].color}`,
        }}>
          <div style={{fontSize:'2.5rem', marginBottom:8}}>{allPlanetHours[activePlanetIdx].icon}</div>
          <div style={{fontWeight:'bold', fontSize:'1.25rem', marginBottom:4}}>{allPlanetHours[activePlanetIdx].planet}</div>
          <div style={{fontSize:'1.05rem', marginBottom:6, textAlign:'center'}}>
            <span style={{fontWeight:'bold', color: allPlanetHours[activePlanetIdx].color}}>
              {planetData.find(p => p.name === allPlanetHours[activePlanetIdx].planet)?.info}
            </span>
          </div>
        </div>
        {/* Öneri Kartı */}
        <div style={{
          margin: '0 auto',
          marginTop: 18,
          maxWidth: 340,
          background: '#f7faff',
          color: '#1a237e',
          borderRadius: 14,
          boxShadow: '0 1px 6px 0 rgba(0,0,0,0.07)',
          padding: '16px 22px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: `1.5px dashed ${allPlanetHours[activePlanetIdx].color}`,
        }}>
          <div style={{fontWeight:'bold', fontSize:'1.08rem', marginBottom:6}}>
            Öneri
          </div>
          <div style={{fontSize:'0.98rem', textAlign:'center'}}>
            {/* Burada gezegene göre öneri metni dinamikleştirilebilir */}
            {allPlanetHours[activePlanetIdx].planet === 'Mars' && 'Enerjini harekete dönüştür, yeni bir işe başlamak için cesur ol!'}
            {allPlanetHours[activePlanetIdx].planet === 'Venüs' && 'Sevdiklerinle vakit geçir, güzellikleri fark et ve kendine değer ver.'}
            {allPlanetHours[activePlanetIdx].planet === 'Güneş' && 'Kendini ifade et, liderlik et ve yaratıcılığını ortaya koy.'}
            {allPlanetHours[activePlanetIdx].planet === 'Jüpiter' && 'Yeni şeyler öğren, fırsatları değerlendir ve iyimser ol.'}
            {allPlanetHours[activePlanetIdx].planet === 'Satürn' && 'Sorumluluklarını yerine getir, sabırlı ol ve plan yap.'}
            {allPlanetHours[activePlanetIdx].planet === 'Merkür' && 'İletişim kur, yaz, oku ve zihnini çalıştır.'}
            {allPlanetHours[activePlanetIdx].planet === 'Ay' && 'Duygularına kulak ver, iç dünyana dön ve sevdiklerine yakın ol.'}
          </div>
        </div>
        </>
      )}
    </div>
  );
}
