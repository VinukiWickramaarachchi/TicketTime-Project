const events = require("../events");
const users = require("../users");
const db = require("../config/database");

exports.getAllEvents = (req, res) => {
  res.json(events);
};

exports.purchaseTicket = (req, res, io) => {
  const { eventId, userId, quantity } = req.body;
  const user = users.customers.find((u) => u.id === userId);
  if (!user)
    return res.status(400).json({ success: false, message: "User not found!" });

  const event = events[eventId];
  if (!event)
    return res
      .status(404)
      .json({ success: false, message: "Event not found!" });

  const maxTickets = user.isVIP ? 50 : 5;

  if (quantity > maxTickets) {
    return res.status(400).json({
      success: false,
      message: `Purchase limit exceeded! You can buy up to ${maxTickets} tickets.`,
    });
  }

  if (event.tickets >= quantity) {
    event.tickets -= quantity;

    const timestamp = new Date().toISOString().split("T")[0];
    db.run(
      `INSERT INTO sales (eventId, timestamp, quantity) VALUES (?, ?, ?)`,
      [eventId, timestamp, quantity],
      (err) => {
        if (err) {
          console.error("Error saving sale:", err.message);
          return res
            .status(500)
            .json({ success: false, message: "Failed to save sale data." });
        }

        io.emit("ticketsUpdated", events);
        return res.status(200).json({
          success: true,
          message: `${quantity} ticket${quantity > 1 ? 's':''} purchased successfully!`,
        });
      }
    );
  } else {
    res
      .status(400)
      .json({ success: false, message: "Not enough tickets available!" });
  }
};

exports.getAnalytics = (req, res) => {
  const { eventId } = req.params;

  db.all(
    `SELECT timestamp, SUM(quantity) AS totalQuantity 
     FROM sales 
     WHERE eventId = ? 
     GROUP BY timestamp`,
    [eventId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching sales data:", err.message);
        return res
          .status(500)
          .json({ message: "Failed to fetch sales analytics." });
      }

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: "No sales data available for this event." });
      }

      const analyticsData = rows.reduce((acc, row) => {
        const formattedDate = new Date(row.timestamp).toLocaleDateString();
        acc[formattedDate] = row.totalQuantity;
        return acc;
      }, {});

      res.status(200).json(analyticsData);
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const vendor = users.vendors.find(
    (v) => v.username === username && v.password === password
  );
  if (vendor) return res.status(200).json({ user: vendor });

  const customer = users.customers.find(
    (c) => c.username === username && c.password === password
  );
  if (customer) return res.status(200).json({ user: customer });

  res.status(401).json({ message: "Invalid credentials" });
};

exports.addTickets = (req, res, io) => {
  const { eventId, ticketsToAdd } = req.body;

  if (events[eventId]) {
    events[eventId].tickets += ticketsToAdd;
    io.emit("ticketsUpdated", events);
    if(ticketsToAdd > 1){
    return res
      .status(200)
      .json({ success: true, message: `${ticketsToAdd} Tickets added successfully!` })}
      return res
      .status(404)
      .json({ success: false, message: "Ticket number should be more than 0!" })

  }

  res.status(400).json({ success: false, message: "Event not found!" });
};
