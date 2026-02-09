import React, { useEffect, useState } from 'react';
import RainfallMap from './RainfallMap';
import WeatherTable from './WeatherTable';
import { Button } from 'react-bootstrap';
import { FaTable, FaInfoCircle, FaMapMarkedAlt, FaFileCsv, FaDownload } from 'react-icons/fa';
import '../App.css';
import { formatDateWithDay, getImagePath, escapeCell } from '../utils/helpers';
const PROD_API = import.meta.env.VITE_API_URL || 'https://cordillera-weather.onrender.com/api/cordillera/full';
const LOCAL_API = 'http://localhost:3001/api/cordillera/full';
// Try the online (deployed) server first, then fall back to local server when offline
const API_URLS = [PROD_API, LOCAL_API];

const RainfallAlertSystemClean = () => {
  const [activeTab, setActiveTab] = useState('table');
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    if (weatherData.length === 0) {
      const fetchData = async () => {
        setLoading(true);
        try {
          let success = false;
          let lastErr = null;
          for (const url of API_URLS) {
            try {
              const response = await fetch(url);
              if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);
              const data = await response.json();
              setWeatherData(data.data || []);
              success = true;
              break;
            } catch (err) {
              lastErr = err;
              // try next URL
            }
          }
          if (!success) throw lastErr || new Error('All API endpoints failed');
        } catch (err) {
          console.error('Error fetching weather data (online/offline fallback):', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const dates = [...new Set(weatherData.map((i) => i.date))];
  const date = formatDateWithDay(dates[selectedDay]) || 'date';
  const dateRange = dates.length
    ? `${formatDateWithDay(dates[0])} — ${formatDateWithDay(dates[dates.length - 1])}`
    : null;
  const getDayData = (dayIdx) => {
    if (!weatherData || weatherData.length === 0) return [];
    const d = dates[dayIdx];
    return weatherData.filter((item) => item.date === d);
  };
  const municipalities = getDayData(selectedDay).map((it) => [it.municity, it.rainfall_desc]);

  const generateCSVs = () => {
    if (!weatherData || weatherData.length === 0) return;
    setLoading(true);
    const datesList = [...new Set(weatherData.map((item) => item.date))];
    const columns = [
      'date',
      'province',
      'municity',
      'rainfall_desc',
      'rainfall_total',
      'cloud_cover',
      'tmean',
      'tmin',
      'tmax',
      'humidity',
      'wind_speed',
      'wind_direction'
    ];
    // use shared escapeCell helper
    
    datesList.forEach((d) => {
      const rows = weatherData.filter((r) => r.date === d);
      const lines = [columns.join(',')];
      rows.forEach((r) => lines.push(columns.map((c) => escapeCell(r[c])).join(',')));
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forecast_${d.replace(/\//g, '-').replace(/\s+/g, '_')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    setLoading(false);
  };

  const captureMapAsImage = () => {
    setLoading(true);
    const mapContainer = document.getElementById('grid-coordinates');
    import('html2canvas')
      .then(({ default: html2canvas }) =>
        html2canvas(mapContainer, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
      )
      .then((canvas) => {
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = Array.isArray(date) ? `${date[0]} ${date[1]}.png` : 'map-image.png';
        a.click();
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error capturing map:', err);
        setLoading(false);
      });
  };

  const captureAllMapsAsImages = async () => {
    setLoading(true);
    for (let idx = 0; idx < dates.length; idx++) {
      setSelectedDay(idx);
      await new Promise((r) => setTimeout(r, 400));
      const mapContainer = document.getElementById('grid-coordinates');
      if (!mapContainer) continue;
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(mapContainer, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 });
        const url = canvas.toDataURL('image/png');
        const formatted = formatDateWithDay(dates[idx]);
        const a = document.createElement('a');
        a.href = url;
        a.download = Array.isArray(formatted) ? `${formatted[0]} ${formatted[1]}.png` : `map-image-day${idx + 1}.png`;
        a.click();
      } catch (err) {
        console.error(`Error capturing map for day ${idx + 1}:`, err);
      }
    }
    setLoading(false);
  };

  return (
    <div className="rainfall-alert-system">
      <h1>Cordillera 10-Day Rainfall Forecast System</h1>
         <small>
        <FaInfoCircle/> Developed by: DA-AMIA Cordillera | Weather Data by: DOST-PAGASA API
      </small>
      <hr />
      <div className="toolbar">
        <div className="toolbar-left">
          <button className={`toolbar-button ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')} title="Show map view">
            <FaMapMarkedAlt className="toolbar-icon" />
            <div className="toolbar-label">Map View</div>
          </button>

          <button className={`toolbar-button ${activeTab === 'table' ? 'active' : ''}`} onClick={() => setActiveTab('table')} title="Show weather table">
            <FaTable className="toolbar-icon" />
            <div className="toolbar-label">Weather Table</div>
          </button>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-button outline" onClick={() => generateCSVs()} disabled={loading || weatherData.length === 0} title="Export CSV for all days">
            <FaFileCsv className="toolbar-icon" />
            <div className="toolbar-label">Export CSVs (All)</div>
          </button>
        </div>
      </div>

         {dateRange && <div className="date-range">{dateRange}</div>}
      {activeTab === 'map' ? (
        <RainfallMap
          date={date}
          dates={dates.map(formatDateWithDay)}
          municipalities={municipalities}
          getImagePath={getImagePath}
          loading={loading}
          captureMapAsImage={captureMapAsImage}
          captureAllMapsAsImages={captureAllMapsAsImages}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      ) : (
        <WeatherTable weatherData={weatherData} loading={loading} />
      )}
    </div>
  );
};

export default RainfallAlertSystemClean;
