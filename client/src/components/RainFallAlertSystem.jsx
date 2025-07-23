import React, { useEffect, useState } from 'react';
import RainfallMap from './RainfallMap';
import WeatherTable from './WeatherTable';
import { Button } from 'react-bootstrap';
import { FaTable, FaInfoCircle } from 'react-icons/fa';
import '../App.css';

const API_URL = import.meta.env.VITE_API_URL; // Vite uses import.meta.env

const provinceData = {
    "Calanasan": "Apayao",
    "Conner": "Apayao",
    "Flora": "Apayao",
    "Kabugao": "Apayao",
    "Luna": "Apayao",
    "Pudtol": "Apayao",
    "Santa_Marcela": "Apayao",

    // Benguet
    "Atok": "Benguet",
    "Bakun": "Benguet",
    "Itogon": "Benguet",
    "Buguias": "Benguet",
    "City_of_Baguio": "Benguet",
    "La_Trinidad": "Benguet",
    "Tuba": "Benguet",
    "Bokod": "Benguet",
    "Kabayan": "Benguet",
    "Kapangan": "Benguet",
    "Kibungan": "Benguet",
    "Mankayan": "Benguet",
    "Sablan": "Benguet",
    "Tublay": "Benguet",

    // Ifugao
    "Alfonso_Lista": "Ifugao",
    "Aguinaldo": "Ifugao",
    "Asipulo": "Ifugao",
    "Banaue": "Ifugao",
    "Hingyon": "Ifugao",
    "Lamut": "Ifugao",
    "Hungduan": "Ifugao",
    "Kiangan": "Ifugao",
    "Lagawe": "Ifugao",
    "Mayoyao": "Ifugao",
    "Tinoc": "Ifugao",

    // Kalinga
    "City_of_Tabuk": "Kalinga",
    "Pinukpuk": "Kalinga",
    "Balbalan": "Kalinga",
    "Pasil": "Kalinga",
    "Tanudan": "Kalinga",
    "Lubuagan": "Kalinga",
    "Rizal": "Kalinga",
    "Tinglayan": "Kalinga",

    // Mountain Province
    "Bauko": "MP",
    "Barlig": "MP",
    "Besao": "MP",
    "Bontoc": "MP",
    "Sabangan": "MP",
    "Sadanga": "MP",
    "Tadian": "MP",
    "Sagada": "MP",
    "Natonin": "MP",
    "Paracelis": "MP",

    // Abra
    "Bangued": "Abra",
    "Peñarrubia": "Abra",
    "PeÃ±arrubia": "Abra",
    "Penarrubia": "Abra",
    "Tayum": "Abra",
    "Boliney": "Abra",
    "Bucay": "Abra",
    "Bucloc": "Abra",
    "Daguioman": "Abra",
    "Danglas": "Abra",
    "Dolores": "Abra",
    "La_Paz": "Abra",
    "Lacub": "Abra",
    "Lagangilang": "Abra",
    "Lagayan": "Abra",
    "Langiden": "Abra",
    "Licuan-Baay": "Abra",
    "Luba": "Abra",
    "Malibcong": "Abra",
    "Manabo": "Abra",
    "Pidigan": "Abra",
    "Pilar": "Abra",
    "Sallapadan": "Abra",
    "San_Isidro": "Abra",
    "San_Juan": "Abra",
    "San_Quintin": "Abra",
    "Tineg": "Abra",
    "Tubo": "Abra",
    "Villaviciosa": "Abra"
};

const ilocanoWeekdays = {
    'Monday': 'Lunes',
    'Tuesday': 'Martes',
    'Wednesday': 'Miyerkules',
    'Thursday': 'Huwebes',
    'Friday': 'Biernes',
    'Saturday': 'Sabado',
    'Sunday': 'Domingo'
};

const getIlocanoDate = (dateStr) => {
    if (!dateStr.includes(',')) return dateStr;
    const [weekday, ...rest] = dateStr.split(',');
    const ilocanoWeekday = ilocanoWeekdays[weekday.trim()] || weekday;
    return [ilocanoWeekday, ...rest].join(',');
};

const getImagePath = (municipality, rainfall) => {
    let colorFolder = '';
    switch (rainfall) {
        case 'NO RAIN': colorFolder = 'Red'; break;
        case 'LIGHT RAINS': colorFolder = 'Yellow'; break;
        case 'MODERATE RAINS': colorFolder = 'Green'; break;
        case 'HEAVY RAINS': colorFolder = 'Blue'; break;
        default: colorFolder = 'White';
    }
    const province = provinceData[municipality.replace(/\s+/g, '_')] || 'UnknownProvince';
    const muniFile = municipality.replace(/\s+/g, '_');
    return `/Map/Municipality_shapes_colored/${province}/${colorFolder}/${muniFile}.png`;
};

const RainfallAlertSystem = () => {
    const [activeTab, setActiveTab] = useState('map');
    const [weatherData, setWeatherData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(0);

    useEffect(() => {
        if (weatherData.length === 0) {
            setLoading(true);
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    setWeatherData(data.data || []);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    setLoading(false);
                });
        }
    }, []);

    const getDayData = (dayIdx) => {
        if (!weatherData || weatherData.length === 0) return [];
        const dates = [...new Set(weatherData.map(item => item.date))];
        const dayDate = dates[dayIdx];
        return weatherData.filter(item => item.date === dayDate);
    };

    const dates = [...new Set(weatherData.map(item => item.date))];
    const date = dates[selectedDay] || 'date';
    const municipalities = getDayData(selectedDay).map(item => [item.municity, item.rainfall_desc]);

    // Save single map image
    const captureMapAsImage = () => {
        setLoading(true);
        const mapContainer = document.getElementById('grid-coordinates');
        import('html2canvas').then(({ default: html2canvas }) => {
            html2canvas(mapContainer, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 2,
                logging: false
            }).then((canvas) => {
                const imageUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = date ? `${date}.png` : 'map-image.png';
                link.click();
                setLoading(false);
            }).catch(error => {
                console.error("Error capturing the map:", error);
                setLoading(false);
            });
        });
    };

    // Save all 10-day map images
    const captureAllMapsAsImages = async () => {
        setLoading(true);
        for (let idx = 0; idx < dates.length; idx++) {
            setSelectedDay(idx);
            await new Promise(resolve => setTimeout(resolve, 500));
            const mapContainer = document.getElementById('grid-coordinates');
            if (mapContainer) {
                try {
                    const html2canvas = (await import('html2canvas')).default;
                    const canvas = await html2canvas(mapContainer, {
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: null,
                        scale: 2,
                        logging: false
                    });
                    const imageUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = dates[idx] ? `${dates[idx]}.png` : `map-image-day${idx + 1}.png`;
                    link.click();
                } catch (error) {
                    console.error(`Error capturing map for day ${idx + 1}:`, error);
                }
            }
        }
        setLoading(false);
    };

    return (
        <div className="rainfall-alert-system">
            <h1>10-Day Rainfall Forecast System</h1>
            <div>AMIA-Cordillera</div>
            <div className='button-group'>
                <Button
                    variant={activeTab === 'map' ? 'primary' : 'outline-primary'}
                    size="md"
                    onClick={() => setActiveTab('map')}
                >
                    Map View
                </Button>
                <Button
                    variant={activeTab === 'table' ? 'primary' : 'outline-primary'}
                    size="md"
                    onClick={() => setActiveTab('table')}
                >
                    <FaTable style={{ marginRight: '8px' }} />
                    Weather Table
                </Button>
            </div>
            <small>
                <FaInfoCircle />Data Source: DOST-PAGASA
            </small>
            {activeTab === 'map' ? (
                <RainfallMap
                    date={date}
                    dates={dates}
                    municipalities={municipalities}
                    getImagePath={getImagePath}
                    getIlocanoDate={getIlocanoDate}
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

export default RainfallAlertSystem;

