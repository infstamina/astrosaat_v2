import SunCalc from 'suncalc';

export default function NextPage({ locationInfo }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();

  // Konum bilgisi
  let lat = null, lng = null;
  if (locationInfo) {
    lat = locationInfo.latitude || locationInfo.lat;
    lng = locationInfo.longitude || locationInfo.lng;
  }

  let sunrise = null, sunset = null, nextSunrise = null, nextSunset = null;
  let dayDuration = null, nightDuration = null;
  if (lat && lng) {
    const todayTimes = SunCalc.getTimes(now, lat, lng);
    sunrise = todayTimes.sunrise;
    sunset = todayTimes.sunset;
    // Ertesi gün için
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
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

  // Gezegen saatleri için gündüz ve gece sürelerini 12'ye böl ve saat aralıklarını hesapla
  let dayPlanetHours = [], nightPlanetHours = [];
  if (dayDuration && sunrise && sunset) {
    const part = dayDuration / 12;
    let start = new Date(sunrise);
    for (let i = 0; i < 12; i++) {
      let end = new Date(start.getTime() + part * 1000);
      dayPlanetHours.push({
        start: new Date(start),
        end: new Date(end)
      });
      start = end;
    }
  }
  if (nightDuration && sunset && nextSunrise) {
    const part = nightDuration / 12;
    let start = new Date(sunset);
    for (let i = 0; i < 12; i++) {
      let end = new Date(start.getTime() + part * 1000);
      nightPlanetHours.push({
        start: new Date(start),
        end: new Date(end)
      });
      start = end;
    }
  }

  function formatTime(date) {
    if (!date) return '-';
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  return (
    <div style={{ padding: 32 }}>
      <h2>Sonraki Sayfa</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Tarih:</strong> {dateStr} <br />
        <strong>Saat:</strong> {timeStr}
      </div>
      <div>
        <strong>Konum Bilgisi:</strong><br />
        {lat && lng ? (
          <>
            Enlem: {lat} <br />
            Boylam: {lng}
          </>
        ) : (
          <span>Konum bilgisi bulunamadı.</span>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <strong>Gündüz Saat Aralığı:</strong> {formatTime(sunrise)} - {formatTime(sunset)}<br />
        <span style={{marginLeft:16}}><em>Fark:</em> {formatDuration(dayDuration)}</span><br />
        <strong>Gece Saat Aralığı:</strong> {formatTime(sunset)} - {formatTime(nextSunrise)}<br />
        <span style={{marginLeft:16}}><em>Fark:</em> {formatDuration(nightDuration)}</span><br /><br />
        <strong>Gündüz Gezegen Saatleri:</strong>
        <ol>
          {dayPlanetHours.map((d, i) => (
            <li key={i}>{i+1}. saat: {formatTime(d.start)} - {formatTime(d.end)}</li>
          ))}
        </ol>
        <strong>Gece Gezegen Saatleri:</strong>
        <ol>
          {nightPlanetHours.map((d, i) => (
            <li key={i}>{i+1}. saat: {formatTime(d.start)} - {formatTime(d.end)}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
