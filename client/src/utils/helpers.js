// Shared helpers and data for the Rainfall components
export const provinceData = {
  Calanasan: 'Apayao',
  Conner: 'Apayao',
  Flora: 'Apayao',
  Kabugao: 'Apayao',
  Luna: 'Apayao',
  Pudtol: 'Apayao',
  Santa_Marcela: 'Apayao',
  Atok: 'Benguet',
  Bakun: 'Benguet',
  Itogon: 'Benguet',
  Buguias: 'Benguet',
  City_of_Baguio: 'Benguet',
  La_Trinidad: 'Benguet',
  Tuba: 'Benguet',
  Bokod: 'Benguet',
  Kabayan: 'Benguet',
  Kapangan: 'Benguet',
  Kibungan: 'Benguet',
  Mankayan: 'Benguet',
  Sablan: 'Benguet',
  Tublay: 'Benguet',
  Alfonso_Lista: 'Ifugao',
  Aguinaldo: 'Ifugao',
  Asipulo: 'Ifugao',
  Banaue: 'Ifugao',
  Hingyon: 'Ifugao',
  Lamut: 'Ifugao',
  Hungduan: 'Ifugao',
  Kiangan: 'Ifugao',
  Lagawe: 'Ifugao',
  Mayoyao: 'Ifugao',
  Tinoc: 'Ifugao',
  City_of_Tabuk: 'Kalinga',
  Pinukpuk: 'Kalinga',
  Balbalan: 'Kalinga',
  Pasil: 'Kalinga',
  Tanudan: 'Kalinga',
  Lubuagan: 'Kalinga',
  Rizal: 'Kalinga',
  Tinglayan: 'Kalinga',
  Bauko: 'MP',
  Barlig: 'MP',
  Besao: 'MP',
  Bontoc: 'MP',
  Sabangan: 'MP',
  Sadanga: 'MP',
  Tadian: 'MP',
  Sagada: 'MP',
  Natonin: 'MP',
  Paracelis: 'MP',
  Bangued: 'Abra',
  Penarrubia: 'Abra',
  Tayum: 'Abra',
  Boliney: 'Abra',
  Bucay: 'Abra',
  Bucloc: 'Abra',
  Daguioman: 'Abra',
  Danglas: 'Abra',
  Dolores: 'Abra',
  La_Paz: 'Abra',
  Lacub: 'Abra',
  Lagangilang: 'Abra',
  Lagayan: 'Abra',
  Langiden: 'Abra',
  'Licuan-Baay': 'Abra',
  Luba: 'Abra',
  Malibcong: 'Abra',
  Manabo: 'Abra',
  Pidigan: 'Abra',
  Pilar: 'Abra',
  Sallapadan: 'Abra',
  San_Isidro: 'Abra',
  San_Juan: 'Abra',
  San_Quintin: 'Abra',
  Tineg: 'Abra',
  Tubo: 'Abra',
  Villaviciosa: 'Abra'
};

export const formatDateWithDay = (dateStr) => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj)) return dateStr;
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const day = dateObj.getDate();
  return [weekday, `${month} ${day}`];
};

export const getImagePath = (municipality, rainfall) => {
  let colorFolder = 'White';
  if (rainfall === 'NO RAIN') colorFolder = 'Red';
  else if (rainfall === 'LIGHT RAINS') colorFolder = 'Yellow';
  else if (rainfall === 'MODERATE RAINS') colorFolder = 'Green';
  else if (rainfall === 'HEAVY RAINS') colorFolder = 'Blue';
  const province = provinceData[municipality.replace(/\s+/g, '_')] || 'UnknownProvince';
  const muniFile = municipality.replace(/\s+/g, '_');
  return `/Map/Municipality_shapes_colored/${province}/${colorFolder}/${muniFile}.png`;
};

export const escapeCell = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};
