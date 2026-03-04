const express = require('express');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const ctrl = require('../controllers/maps.controller');
const { z } = require('zod');

const router = express.Router();

// POST /api/maps/directions
router.post(
    '/directions',
    protect, // ให้เฉพาะผู้ล็อกอินใช้
    validate({
        body: z.object({
            origin: z.any(),
            destination: z.any(),
            waypoints: z.array(z.any()).optional(),
            alternatives: z.boolean().optional(),
            departureTime: z.string().optional(),
            optimizeWaypoints: z.boolean().optional(),
        })
    }),
    ctrl.directions
);

// GET /api/maps/geocode?address=...
router.get(
    '/geocode',
    protect,
    validate({ query: z.object({ address: z.string().min(1) }) }),
    ctrl.geocodeCtrl
);

// GET /api/maps/reverse-geocode?lat=..&lng=..
router.get(
    '/reverse-geocode',
    protect,
    validate({ query: z.object({ lat: z.string(), lng: z.string() }) }),
    ctrl.reverseGeocodeCtrl
);

module.exports = router;