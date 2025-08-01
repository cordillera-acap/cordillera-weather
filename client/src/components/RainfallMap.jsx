import React from 'react';
import html2canvas from 'html2canvas';
import { Button, Spinner } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';

const RainfallMap = ({
    date,
    dates,
    municipalities,
    getImagePath,
    getIlocanoDate,
    loading,
    captureMapAsImage,
    captureAllMapsAsImages,
    selectedDay,
    setSelectedDay
}) => (
    <div>

        {/* 10-day tabs */}
        <div className="ten-day-tabs" style={{ margin: '1rem 0' }}>
            {dates.map((d, idx) => (
                <Button
                    key={idx}
                    variant={selectedDay === idx ? 'primary' : 'outline-primary'}
                    size="sm"
                    style={{ marginRight: '4px' }}
                    onClick={() => setSelectedDay(idx)}
                >
                    Day {idx + 1}
                </Button>
            ))}
        </div>
        {/* Save Image buttons */}
        <div style={{ marginBottom: '1rem', textAlign: 'right', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button variant="success" size="md" onClick={captureMapAsImage} disabled={loading}>
                <FaCamera style={{ marginRight: '8px' }} />
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Image'}
            </Button>
            <Button variant="info" size="md" onClick={captureAllMapsAsImages} disabled={loading}>
                <FaCamera style={{ marginRight: '8px' }} />
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save All 10-Day Maps'}
            </Button>
        </div>
        {/* Map */}
        <div id='grid-coordinates'>
            <p className='date'>
                {Array.isArray(date) ? (
                    <>
                      {date[0]}<br />{date[1]}
                    </>
                ) : date}
            </p>
            <img
                src='/Map/background-items.png'
                alt='white map'
                className='municipality'
                style={{ zIndex: -1 }}
            />
            {municipalities.map(([municipality, rainfall], index) => (
                <img
                    key={index}
                    id={municipality.replace(/\s+/g, '_')}
                    className="municipality"
                    alt={municipality}
                    src={getImagePath(municipality, rainfall)}
                />
            ))}
            <img
                src='/Map/foreground-texts.png'
                alt='foreground municipality names'
                className='municipality'
                style={{ zIndex: 2 }}
            />
        </div>
    </div>
);

export default RainfallMap;