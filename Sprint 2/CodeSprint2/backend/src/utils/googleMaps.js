const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// origin/destination รับได้ทั้ง {lat,lng} หรือ place_id
const normalizeLocation = (loc) => {
    if (!loc) return null;
    if (loc.placeId) return `place_id:${loc.placeId}`;
    if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
        return `${loc.lat},${loc.lng}`;
    }
    if (Array.isArray(loc) && loc.length === 2) {
        return `${loc[0]},${loc[1]}`;
    }
    // fallback: string address
    if (typeof loc === 'string') return loc;
    return null;
};

const getDirections = async ({ origin, destination, waypoints = [], alternatives = true, departureTime, optimizeWaypoints }) => {
    const originStr = normalizeLocation(origin);
    const destStr = normalizeLocation(destination);
    if (!originStr || !destStr) {
        throw new Error("Invalid origin/destination")
    }

    const params = {
        origin: originStr,
        destination: destStr,
        key: GOOGLE_MAPS_API_KEY,
        language: 'th',
        region: 'th',
        alternatives: alternatives ? 'true' : 'false',
    };

    if (waypoints.length) {
        const wp = waypoints
            .map(w => {
                // ถ้าอยากให้เป็น “ผ่านจุด” (ไม่ถือว่าจอด) ใช้รูปแบบ `via:lat,lng`
                // default: ถือเป็น stopover ปกติ
                const s = normalizeLocation(w);
                return w?.via ? `via:${s}` : s;
            })
            .filter(Boolean);

        // เปิด optimize: Google จะจัดลำดับจุดแวะให้สั้นสุด
        // if (optimizeWaypoints) {
        //     params.waypoints = `optimize:true|${wp.join('|')}`;
        // } else {
        //     params.waypoints = wp.join('|');
        // }
        
        // optimizeWaypoints: ให้ Google จัดลำดับ stopover (ไม่รวม via) ให้อัตโนมัติ
        params.waypoints = (optimizeWaypoints ? 'optimize:true|' : '') + wp.join('|');
    }

    if (departureTime) {
        params.departure_time = Math.floor(new Date(departureTime).getTime() / 1000);
    }

    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    const { data } = await axios.get(url, { params });
    if (data.status !== 'OK') {
        const msg = data.error_message || data.status;
        const err = new Error(`Google Directions error: ${msg}`);
        err.code = data.status;
        throw err;
    }
    return data;
};


const geocode = async (address) => {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const { data } = await axios.get(url, { params: { address, key: GOOGLE_MAPS_API_KEY, language: 'th', region: 'th' } });
    if (data.status !== 'OK') throw new Error(`Geocode error: ${data.status}`);
    return data;
};

const reverseGeocode = async (lat, lng) => {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const { data } = await axios.get(url, { params: { latlng: `${lat},${lng}`, key: GOOGLE_MAPS_API_KEY, language: 'th', region: 'th' } });
    if (data.status !== 'OK') throw new Error(`Reverse geocode error: ${data.status}`);
    return data;
};

module.exports = { getDirections, geocode, reverseGeocode };
