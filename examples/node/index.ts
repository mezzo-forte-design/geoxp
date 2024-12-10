import express, { Router } from 'express';
import { config } from './config';
import GeoXpCore from '@geoxp/core';

const PORT = 8000;

const app = express();
const router = Router();

// GeoXp core init
const geoXpCore = new GeoXpCore(config.core);
geoXpCore.on('active', spot => {
  console.log('[EVENT] - Spot active', spot);
});
geoXpCore.on('inactive', spot => {
  console.log('[EVENT] - Spot inactive', spot);
});
geoXpCore.on('incoming', spot => {
  console.log('[EVENT] - Spot incoming', spot);
});
geoXpCore.on('visited', spot => {
  console.log('[EVENT] - Spot visited', spot);
});
geoXpCore.on('complete', patternId => {
  console.log('[EVENT] - Pattern complete', patternId);
});
geoXpCore.on('last', patternId => {
  console.log('[EVENT] - Last spot in pattern', patternId);
});

// curl http://localhost:8000/health
router.get('/health', (req, res) => res.send('I\'m alive!'));

// curl http://localhost:8000/config
router.get('/config', (req, res) => res.send(config));

// curl -H "Content-Type: application/json" -d '{"lat": 45.116177, "lon": 7.742615, "accuracy": 10}' http://localhost:8000/location
router.post('/location', (req, res) => {
  try {
    const location = req.body;
    geoXpCore.geolocationUpdate(location);
    res.send('Location updated');
  } catch (e) {
    console.error('Error during init', e);
    res.sendStatus(400);
  }
});

app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}! Try POST /location to send user positions and see GeoXp in action.`);
});
