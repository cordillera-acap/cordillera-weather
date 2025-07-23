import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';

const groupBy = (array, key) =>
    array.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item);
        return result;
    }, {});

const WeatherTable = ({ weatherData, loading }) => {
    const [selectedProvince, setSelectedProvince] = useState(null);

    if (loading) {
        return (
            <div style={{ marginTop: '2rem' }} className="d-flex justify-content-center">
                <span>Loading...</span>
            </div>
        );
    }

    // Group data by province
    const provinceGroups = groupBy(weatherData, 'province');
    const provinceNames = Object.keys(provinceGroups);

    // Default to first province if none selected
    const activeProvince = selectedProvince || provinceNames[0];
    const provinceData = provinceGroups[activeProvince] || [];
    const muniGroups = groupBy(provinceData, 'municity');

    return (
        <div style={{ marginTop: '2rem' }}>
            {/* Province buttons */}
            <div className="ten-day-tabs" style={{ marginBottom: '1.2rem', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {provinceNames.map((province) => (
                    <button
                        key={province}
                        className={`btn btn-sm ${activeProvince === province ? 'btn-primary' : 'btn-outline-primary'}`}
                        style={{
                            borderRadius: '8px',
                            fontSize: '1rem',
                            padding: '8px 22px',
                            fontWeight: 500,
                            boxShadow: activeProvince === province ? '0 2px 8px rgba(0,123,255,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                            background: activeProvince === province ? '#007bff' : '#f1f3f5',
                            color: activeProvince === province ? '#fff' : '#1a2a3a',
                            border: 'none',
                            transition: 'background 0.2s, color 0.2s'
                        }}
                        onClick={() => setSelectedProvince(province)}
                    >
                        {province}
                    </button>
                ))}
            </div>
            {/* Accordion per municipality */}
            <Accordion defaultActiveKey="0" alwaysOpen style={{ minWidth: '950px', maxWidth: '100%', margin: '0 auto' }}>
                {Object.entries(muniGroups).map(([municity, muniData], mIdx) => (
                    <Accordion.Item eventKey={String(mIdx)} key={municity}>
                        <Accordion.Header>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#007bff', minWidth:'1200px' }}>{municity}</span>
                        </Accordion.Header>
                        <Accordion.Body style={{ background: '#f7f9fa', borderRadius: '0 0 12px 12px', padding: '0.5rem 1rem' }}>
                            <table className="weather-table" style={{
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: 0,
                                background: '#fff',
                                borderRadius: '12px',
                                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                                overflow: 'hidden',
                                marginBottom: '0'
                            }}>
                                <thead>
                                    <tr style={{ background: '#f1f3f5' }}>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Date</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Rainfall Desc</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Rainfall Total</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Cloud Cover</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Tmean</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Tmin</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Tmax</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Humidity</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Wind Speed</th>
                                        <th style={{ fontWeight: 600, color: '#1a2a3a', padding: '10px 14px' }}>Wind Direction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {muniData.map((item, idx) => (
                                        <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f7f9fa' }}>
                                            <td style={{ padding: '10px 14px' }}>{item.date}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.rainfall_desc}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.rainfall_total}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.cloud_cover}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.tmean}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.tmin}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.tmax}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.humidity}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.wind_speed}</td>
                                            <td style={{ padding: '10px 14px' }}>{item.wind_direction}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
};

export default WeatherTable;