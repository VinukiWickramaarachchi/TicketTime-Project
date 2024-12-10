const express = require("express");
const {
  getAllEvents,
  purchaseTicket,
  getAnalytics,
  login,
  addTickets,
} = require("../controllers/mainController");

const router = express.Router();

// GET events
router.get("/events", getAllEvents);

// POST purchased tickets
router.post("/tickets/purchase", (req, res) =>
  purchaseTicket(req, res, req.app.locals.io)
);

// GET event endpoint
router.get("/analytics/:eventId", getAnalytics);

// POST - Login User
router.post("/login", login);

// POST add tickets
router.post("/events/add", (req, res) =>
  addTickets(req, res, req.app.locals.io)
);

module.exports = router;
