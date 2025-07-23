import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../App.css';

// Province mapping for each municipality (same as before)

const RainfallAlertSystem = () => {
    const [rainfallStatus, setRainfallStatus] = useState({});
    const [fileName, setFileName] = useState('');

 
    // Function to handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Convert the sheet to an array of rows
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Extract as 2D array
            console.log(data)

            if (data.length < 2) return; // Ensure there's at least a header and some data

            const newRainfallStatus = {};

            // Process each row starting from the second (index 1) to ignore headers
            data.slice(1).forEach(row => {
                const municipality = (row[1] || "").toLowerCase().replace(/\s+/g, '_'); // Column B (index 1)
                const rainfall = row[6] || "No Rain"; // Column G (index 6)

                if (municipality) {
                    newRainfallStatus[municipality] = rainfall;
                }
            });

            setRainfallStatus(newRainfallStatus);
        };

        reader.readAsBinaryString(file);
    };
    

    // Province mapping for each municipality
const provinceData = {
    "calanasan": "Apayao",
    "conner": "Apayao",
    "flora": "Apayao",
    "kabugao": "Apayao",
    "luna": "Apayao",
    "pudtol": "Apayao",
    "sta_marcela": "Apayao",

    // Benguet
    "atok": "Benguet",
    "bakun": "Benguet",
    "itogon": "Benguet",
    "buguias": "Benguet",
    "baguio_city": "Benguet",
    "la_trinidad": "Benguet",
    "tuba": "Benguet",
    "bokod": "Benguet",
    "kabayan": "Benguet",
    "kapangan": "Benguet",
    "kibungan": "Benguet",
    "mankayan": "Benguet",
    "sablan": "Benguet",
    "tublay": "Benguet",

    // Ifugao
    "alfonso_lista": "Ifugao",
    "aguinaldo": "Ifugao",
    "asipulo": "Ifugao",
    "banaue": "Ifugao",
    "hingyon": "Ifugao",
    "lamut": "Ifugao",
    "hungduan": "Ifugao",
    "kiangan": "Ifugao",
    "lagawe": "Ifugao",
    "mayoyao": "Ifugao",
    "tinoc": "Ifugao",

    // Kalinga
    "tabuk_city": "Kalinga",
    "pinukpuk": "Kalinga",
    "balbalan": "Kalinga",
    "pasil": "Kalinga",
    "tanudan": "Kalinga",
    "lubuagan": "Kalinga",
    "rizal": "Kalinga",
    "tinglayan": "Kalinga",

    // Mountain Province
    "bauko": "MP",
    "barlig": "MP",
    "besao": "MP",
    "bontoc": "MP",
    "sabangan": "MP",
    "sadanga": "MP",
    "tadian": "MP",
    "sagada": "MP",
    "natonin": "MP",
    "paracelis": "MP",

    // Abra
    "bangued": "Abra",
    "peñarrubia": "Abra",
    "tayum": "Abra",
    "boliney": "Abra",
    "bucay": "Abra",
    "bucloc": "Abra",
    "daguioman": "Abra",
    "danglas": "Abra",
    "dolores": "Abra",
    "la_paz": "Abra",
    "lacub": "Abra",
    "lagangilang": "Abra",
    "lagayan": "Abra",
    "langiden": "Abra",
    "licuan_baay": "Abra",
    "luba": "Abra",
    "malibcong": "Abra",
    "manabo": "Abra",
    "pidigan": "Abra",
    "pilar": "Abra",
    "sallapadan": "Abra",
    "san_isidro": "Abra",
    "san_juan": "Abra",
    "san_quintin": "Abra",
    "tineg": "Abra",
    "tubo": "Abra",
    "villaviciosa": "Abra"
};

    const getImagePath = (municipality, rainfall) => {
        let colorFolder = '';
        // Determine the color based on rainfall labels
        switch (rainfall) {
            case 'No Rain':
                colorFolder = 'Green';
                break;
            case 'Light Rains':
                colorFolder = 'Yellow';
                break;
            case 'Moderate Rains':
                colorFolder = 'Orange';
                break;
            case 'Heavy Rains':
                colorFolder = 'Red';
                break;
            default:
                colorFolder = 'Unknown';
        }

        const province = provinceData[municipality] || 'UnknownProvince'; // Default to UnknownProvince if not found
        return `/Images/${province}/${colorFolder}/${municipality
            .replace(/([_-])/g, ' $1 ')  // Add spaces around delimiters to preserve them
            .split(' ')  // Split the string by spaces (which now surround the delimiters)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())  // Capitalize each word
            .join('')  // Join back the words without any extra spaces
        }.png`;
    };

    return (
        <div className="rainfall-alert-system">
            <h1>Rainfall Alert System</h1>
            
            {/* Upload File Button */}
            <div>
                <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    onChange={handleFileUpload} 
                    />
                <p>{fileName ? `Uploaded: ${fileName}` : 'No file uploaded yet'}</p>
            </div>

            {/* Legend */}
            <div id="legend">
                <div><span style={{ backgroundColor: 'green' }}></span> NO RAIN</div>
                <div><span style={{ backgroundColor: 'yellow' }}></span> LIGHT RAINS</div>
                <div><span style={{ backgroundColor: 'orange' }}></span> MODERATE RAINS</div>
                <div><span style={{ backgroundColor: 'red' }}></span> HEAVY RAINS</div>
            </div>
{/* Map container */}
<div id="map-container">
                {/* Apayao */}
                <img id="calanasan" className="municipality" alt="Calanasan" src={getImagePath("calanasan", rainfallStatus.calanasan)} />
                <img id="conner" className="municipality" alt="Conner" src={getImagePath("conner", rainfallStatus.conner)} />
                <img id="flora" className="municipality" alt="Flora" src={getImagePath("flora", rainfallStatus.flora)} />
                <img id="kabugao" className="municipality" alt="Kabugao" src={getImagePath("kabugao", rainfallStatus.kabugao)} />
                <img id="luna" className="municipality" alt="Luna" src={getImagePath("luna", rainfallStatus.luna)} />
                <img id="pudtol" className="municipality" alt="Pudtol" src={getImagePath("pudtol", rainfallStatus.pudtol)} />
                <img id="sta_marcela" className="municipality" alt="Sta Marcela" src={getImagePath("sta_marcela", rainfallStatus.sta_marcela)} />

                {/* Benguet */}
                <img id="atok" className="municipality" alt="Atok" src={getImagePath("atok", rainfallStatus.atok)} />
                <img id="bakun" className="municipality" alt="Bakun" src={getImagePath("bakun", rainfallStatus.bakun)} />
                <img id="itogon" className="municipality" alt="Itogon" src={getImagePath("itogon", rainfallStatus.itogon)} />
                <img id="buguias" className="municipality" alt="Buguias" src={getImagePath("buguias", rainfallStatus.buguias)} />
                <img id="tuba" className="municipality" alt="Tuba" src={getImagePath("tuba", rainfallStatus.tuba)} />
                <img id="bokod" className="municipality" alt="Bokod" src={getImagePath("bokod", rainfallStatus.bokod)} />
                <img id="kabayan" className="municipality" alt="Kabayan" src={getImagePath("kabayan", rainfallStatus.kabayan)} />
                <img id="kapangan" className="municipality" alt="Kapangan" src={getImagePath("kapangan", rainfallStatus.kapangan)} />
                <img id="kibungan" className="municipality" alt="Kibungan" src={getImagePath("kibungan", rainfallStatus.kibungan)} />
                <img id="mankayan" className="municipality" alt="Mankayan" src={getImagePath("mankayan", rainfallStatus.mankayan)} />
                <img id="sablan" className="municipality" alt="Sablan" src={getImagePath("sablan", rainfallStatus.sablan)} />
                <img id="tublay" className="municipality" alt="Tublay" src={getImagePath("tublay", rainfallStatus.tublay)} />
                <img id="baguio_city" className="municipality" alt="Baguio City" src={getImagePath("baguio_city", rainfallStatus.baguio_city)} />
                <img id="la_trinidad" className="municipality" alt="La Trinidad" src={getImagePath("la_trinidad", rainfallStatus.la_trinidad)} />

                {/* Ifugao */}
                <img id="alfonso_lista" className="municipality" alt="Alfonso Lista" src={getImagePath("alfonso_lista", rainfallStatus.alfonso_lista)} />
                <img id="aguinaldo" className="municipality" alt="Aguinaldo" src={getImagePath("aguinaldo", rainfallStatus.aguinaldo)} />
                <img id="asipulo" className="municipality" alt="Asipulo" src={getImagePath("asipulo", rainfallStatus.asipulo)} />
                <img id="banaue" className="municipality" alt="Banaue" src={getImagePath("banaue", rainfallStatus.banaue)} />
                <img id="lamut" className="municipality" alt="Lamut" src={getImagePath("lamut", rainfallStatus.lamut)} />
                <img id="hungduan" className="municipality" alt="Hungduan" src={getImagePath("hungduan", rainfallStatus.hungduan)} />
                <img id="kiangan" className="municipality" alt="Kiangan" src={getImagePath("kiangan", rainfallStatus.kiangan)} />
                <img id="lagawe" className="municipality" alt="Lagawe" src={getImagePath("lagawe", rainfallStatus.lagawe)} />
                <img id="mayoyao" className="municipality" alt="Mayoyao" src={getImagePath("mayoyao", rainfallStatus.mayoyao)} />
                <img id="natonin" className="municipality" alt="Natonin" src={getImagePath("natonin", rainfallStatus.natonin)} />
                <img id="pinukpuk" className="municipality" alt="Pinukpuk" src={getImagePath("pinukpuk", rainfallStatus.pinukpuk)} />
                <img id="tinoc" className="municipality" alt="Tinoc" src={getImagePath("tinoc", rainfallStatus.tinoc)} />
                <img id="hingyon" className="municipality" alt="Hingyon" src={getImagePath("hingyon", rainfallStatus.hingyon)} />


                {/* Kalinga */}
                <img id="tabuk_city" className="municipality" alt="Tabuk City" src={getImagePath("tabuk_city", rainfallStatus.tabuk_city)} />
                <img id="balbalan" className="municipality" alt="Balbalan" src={getImagePath("balbalan", rainfallStatus.balbalan)} />
                <img id="pasil" className="municipality" alt="Pasil" src={getImagePath("pasil", rainfallStatus.pasil)} />
                <img id="tanudan" className="municipality" alt="Tanudan" src={getImagePath("tanudan", rainfallStatus.tanudan)} />
                <img id="lubuagan" className="municipality" alt="Lubuagan" src={getImagePath("lubuagan", rainfallStatus.lubuagan)} />
                <img id="rizal" className="municipality" alt="Rizal" src={getImagePath("rizal", rainfallStatus.rizal)} />
                <img id="tinglayan" className="municipality" alt="Tinglayan" src={getImagePath("tinglayan", rainfallStatus.tinglayan)} />
                <img id="pinukpuk" className="municipality" alt="Tinglayan" src={getImagePath("pinukpuk", rainfallStatus.pinukpuk)} />

                {/* Mountain Province */}
                <img id="bauko" className="municipality" alt="Bauko" src={getImagePath("bauko", rainfallStatus.bauko)} />
                <img id="barlig" className="municipality" alt="Barlig" src={getImagePath("barlig", rainfallStatus.barlig)} />
                <img id="besao" className="municipality" alt="Besao" src={getImagePath("besao", rainfallStatus.besao)} />
                <img id="bontoc" className="municipality" alt="Bontoc" src={getImagePath("bontoc", rainfallStatus.bontoc)} />
                <img id="sabangan" className="municipality" alt="Sabangan" src={getImagePath("sabangan", rainfallStatus.sabangan)} />
                <img id="sadanga" className="municipality" alt="Sadanga" src={getImagePath("sadanga", rainfallStatus.sadanga)} />
                <img id="tadian" className="municipality" alt="Tadian" src={getImagePath("tadian", rainfallStatus.tadian)} />
                <img id="sagada" className="municipality" alt="Sagada" src={getImagePath("sagada", rainfallStatus.sagada)} />
                <img id="paracelis" className="municipality" alt="Paracelis" src={getImagePath("paracelis", rainfallStatus.paracelis)} />

                {/* Abra */}
                <img id="langiden" className="municipality" alt="Langiden" src={getImagePath("langiden", rainfallStatus.langiden)} />
                <img id="tayum" className="municipality" alt="Tayum" src={getImagePath("tayum", rainfallStatus.tayum)} />
                <img id="bangued" className="municipality" alt="Bangued" src={getImagePath("bangued", rainfallStatus.bangued)} />
                <img id="boliney" className="municipality" alt="Boliney" src={getImagePath("boliney", rainfallStatus.boliney)} />
                <img id="bucay" className="municipality" alt="Bucay" src={getImagePath("bucay", rainfallStatus.bucay)} />
                <img id="bucloc" className="municipality" alt="Bucloc" src={getImagePath("bucloc", rainfallStatus.bucloc)} />
                <img id="daguioman" className="municipality" alt="Daguioman" src={getImagePath("daguioman", rainfallStatus.daguioman)} />
                <img id="danglas" className="municipality" alt="Danglas" src={getImagePath("danglas", rainfallStatus.danglas)} />
                <img id="la_paz" className="municipality" alt="La Paz" src={getImagePath("la_paz", rainfallStatus.la_paz)} />
                <img id="dolores" className="municipality" alt="Dolores" src={getImagePath("dolores", rainfallStatus.dolores)} />
                <img id="lacub" className="municipality" alt="Lacub" src={getImagePath("lacub", rainfallStatus.lacub)} />
                <img id="lagayan" className="municipality" alt="Lagayan" src={getImagePath("lagayan", rainfallStatus.lagayan)} />
                <img id="luba" className="municipality" alt="Luba" src={getImagePath("luba", rainfallStatus.luba)} />
                <img id="malibcong" className="municipality" alt="Malibcong" src={getImagePath("malibcong", rainfallStatus.malibcong)} />
                <img id="licuan_baay" className="municipality" alt="Licuan Baay" src={getImagePath("licuan_baay", rainfallStatus.licuan_baay)} />
                <img id="pilar" className="municipality" alt="Pilar" src={getImagePath("pilar", rainfallStatus.pilar)} />
                <img id="sallapadan" className="municipality" alt="Sallapadan" src={getImagePath("sallapadan", rainfallStatus.sallapadan)} />
                <img id="san_isidro" className="municipality" alt="San Isidro" src={getImagePath("san_isidro", rainfallStatus.san_isidro)} />
                <img id="tineg" className="municipality" alt="Tineg" src={getImagePath("tineg", rainfallStatus.tineg)} />
                <img id="tubo" className="municipality" alt="Tubo" src={getImagePath("tubo", rainfallStatus.tubo)} />
                <img id="san_juan" className="municipality" alt="San Juan" src={getImagePath("san_juan", rainfallStatus.san_juan)} />
                <img id="lagangilang" className="municipality" alt="Lagangilang" src={getImagePath("lagangilang", rainfallStatus.lagangilang)} />
                <img id="peñarrubia" className="municipality" alt="Peñarrubia" src={getImagePath("peñarrubia", rainfallStatus.peñarrubia)} />
                <img id="manabo" className="municipality" alt="Manabo" src={getImagePath("manabo", rainfallStatus.manabo)} />
                <img id="san_quintin" className="municipality" alt="San Quintin" src={getImagePath("san_quintin", rainfallStatus.san_quintin)} />
                <img id="pidigan" className="municipality" alt="Pidigan" src={getImagePath("pidigan", rainfallStatus.pidigan)} />
                <img id="villaviciosa" className="municipality" alt="Villaviciosa" src={getImagePath("villaviciosa", rainfallStatus.villaviciosa)} />
            </div>
        </div>
    );
};

export default RainfallAlertSystem;
