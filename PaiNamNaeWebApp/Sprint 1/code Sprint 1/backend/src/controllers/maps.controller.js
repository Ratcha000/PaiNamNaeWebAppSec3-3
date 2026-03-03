const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const { getDirections, geocode, reverseGeocode } = require('../utils/googleMaps');

const directions = asyncHandler(async (req, res) => {
    const { origin, destination, waypoints, alternatives, departureTime } = req.body;

    if (!origin || !destination) throw new ApiError(400, 'origin & destination are required');
    const data = await getDirections({
        origin, destination,
        waypoints: waypoints || [],
        alternatives: alternatives !== false,
        departureTime
    });

    res.status(200).json({
        success: true,
        data
    });
});

const geocodeCtrl = asyncHandler(async (req, res) => {
    const { address } = req.query;

    if (!address)
        throw new ApiError(400, 'address is required');
    const data = await geocode(address);

    res.status(200).json({
        success: true,
        data
    });
});

const reverseGeocodeCtrl = asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;

    if (lat == null || lng == null)
        throw new ApiError(400, 'lat & lng are required');
    const data = await reverseGeocode(Number(lat), Number(lng));

    res.status(200).json({
        success: true,
        data
    });
});

module.exports = { directions, geocodeCtrl, reverseGeocodeCtrl };
