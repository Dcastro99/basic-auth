const sequelize = require('sequelize');

const MakeModels = (db) => {
  const Flight = db.define('Flight', {
    origin: sequelize.DataTypes.STRING,
    destination: sequelize.DataTypes.STRING,
  });

  const Passenger = db.define('Passenger', {
    name: sequelize.DataTypes.STRING,
    passport_number: sequelize.DataTypes.NUMBER,
  });

  const Ticket = db.define('Ticket', {
    seat_assignment: sequelize.DataTypes.STRING,
  });

  Ticket.belongsTo(Flight);
  Ticket.belongsTo(Passenger);

  Flight.hasMany(Ticket);
  Passenger.hasOne(Ticket);

  return { Flight, Passenger, Ticket };
};

// Lazy vs Eager evaluation
const { Flight, Ticket } = MakeModels({});

async function doStuffLazy() {
  const flight = await Flight.findOne({ where: { flightId: 'ABC123' } });
  // Second DB query
  const tickets = await flight.getTickets();
}

async function doStuffEager() {
  const flight = await Flight.findOne({
    where: { flightId: 'ABC123' },
    include: Ticket,
  });

  const tickets = flight.tickets;
}
