export default function NextPage({ locationInfo }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString();
  return (
    <div style={{ padding: 32 }}>
      <h2>Sonraki Sayfa</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Tarih:</strong> {dateStr} <br />
        <strong>Saat:</strong> {timeStr}
      </div>
      <div>
        <strong>Konum Bilgisi:</strong><br />
        {locationInfo && locationInfo.latitude && (
          <>
            Enlem: {locationInfo.latitude} <br />
            Boylam: {locationInfo.longitude}
          </>
        )}
        {locationInfo && locationInfo.lat && (
          <>
            Enlem: {locationInfo.lat} <br />
            Boylam: {locationInfo.lng}
          </>
        )}
        {!locationInfo && <span>Konum bilgisi bulunamadı.</span>}
      </div>
    </div>
  );
}
