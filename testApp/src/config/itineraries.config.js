// itineraries
exports.torino = [
  {
    lat: 45.0650933,
    lon: 7.6757719,
    name: '1 Introduzione - Liceo',
    audio: '1IN'
  },
  {
    lat: 45.0653663,
    lon: 7.6754178,
    name: '2 Centrale - Quintino - Re Umberto',
    audio: '2BS'
  },
  {
    lat: 45.0650721,
    lon: 7.6757804,
    name: '3 Chiorba - T-Art',
    audio: '3SC',
    after: '1IN' // need to start after another spot is visited
  },
  {
    lat: 45.0655831,
    lon: 7.6764021,
    name: '4 Lagone - Parini Carige',
    audio: '4LA'
  },
  {
    lat: 45.0655831,
    lon: 7.6764021,
    name: '5 Soffione - Gioia Matteotti',
    audio: '5SO'
  },
  {
    lat: 45.0652261,
    lon: 7.6786931,
    name: '6 Acqua Forte - Matteotti XX Sett',
    audio: '6AF'
  },
  {
    lat: 45.0654303,
    lon: 7.6792205,
    name: '7 Biancana - XX sett Bagel',
    audio: '7BA'
  },
  {
    lat: 45.0659163,
    lon: 7.6805334,
    name: '8 Anfiteatro (50m) - Miagola',
    audio: '8AT',
    radius_out: 40 // custom outgoing radius
  },
  {
    lat: 45.0653235,
    lon: 7.6814026,
    name: '9 Flora - Buozzi - Gobetti',
    audio: '9IV'
  },
  {
    lat: 45.0666286,
    lon: 7.6831431,
    name: '10 Panchina - Lagrange Giolitti',
    audio: '0RD'
  },
  {
    lat: 45.0670136,
    lon: 7.682433,
    name: '11 Geologi - S.Carlo',
    audio: '1PG'
  },
  {
    lat: 45.066753,
    lon: 7.6811947,
    name: '12 Belvedere - Amendola Frola',
    audio: '2BV',
    meta: 'last_spot'
  }
];

exports.parigi = [];

exports.biancane = [
  {
    lat: 43.152469,
    lon: 10.854057,
    name: 'Introduzione',
    audio: '1IN'
  },
  {
    lat: 43.152111,
    lon: 10.853139,
    name: 'La Centrale',
    audio: '2BS'
  },
  {
    lat: 43.152642,
    lon: 10.853768,
    name: 'Sorgente di Chiorba',
    audio: '3SC',
    radius_out: 25, // custom outgoing radius
    after: '1IN' // need to start after another spot is visited
  },
  {
    lat: 43.152889,
    lon: 10.853639,
    name: 'Lagone',
    audio: '4LA',
    radius_out: 30 // custom outgoing radius
  },
  {
    lat: 43.153095,
    lon: 10.854492,
    name: 'Soffione',
    audio: '5SO'
  },
  {
    lat: 43.154472,
    lon: 10.854750,
    name: 'Sorgente di Acqua Forte',
    audio: '6AF'
  },
  {
    lat: 43.154194,
    lon: 10.855639,
    name: 'Prima Biancana',
    audio: '7BA'
  },
  {
    lat: 43.1545951,
    lon: 10.856635,
    name: 'Anfiteatro',
    audio: '8AT',
    radius_out: 40 // custom outgoing radius
  },
  {
    lat: 43.154404,
    lon: 10.858243,
    name: 'La flora del Parco',
    audio: '9IV'
  },
  {
    lat: 43.156685,
    lon: 10.857959,
    name: 'Panchina',
    audio: '0RD'
  },
  {
    lat: 43.157083,
    lon: 10.857583,
    name: 'Sogno dei geologi',
    audio: '1PG'
  },
  {
    lat: 43.155434,
    lon: 10.856443,
    name: 'Il Belvedere',
    audio: '2BV',
    meta: 'last_spot'
  }
];
