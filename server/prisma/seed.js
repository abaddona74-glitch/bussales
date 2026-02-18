const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding started...');

  // Cities
  const cityData = [
    { name: 'Toshkent' },
    { name: 'Samarqand' },
    { name: 'Buxoro' },
    { name: 'Xiva' },
    { name: 'Navoiy' },
    { name: 'Nukus' },
  ];

  const citiesMap = {};

  for (const city of cityData) {
    const existingCity = await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: { name: city.name },
    });
    citiesMap[city.name] = existingCity.id;
    console.log(`Upserted city: ${city.name}`);
  }

  // Buses
  const buses = [
    { number: '01A777AA', model: 'Yutong ZK6122', seats: 53 },
    { number: '01B888BB', model: 'Man Lion\'s Coach', seats: 49 },
    { number: '01C999CC', model: 'Golden Dragon', seats: 51 },
  ];

  const busIds = [];
  for (const bus of buses) {
    const existingBus = await prisma.bus.upsert({
      where: { number: bus.number },
      update: {},
      create: bus,
    });
    busIds.push(existingBus.id);
    console.log(`Upserted bus: ${bus.number}`);
  }

  // Routes (Popular ones)
  const popularRoutes = [
    {
      from: 'Toshkent',
      to: 'Samarqand',
      distance: 300,
      duration: 240, // 4 hours
      price: 55000,
      frequency: 'Har kuni 12 ta reys', // Just for logic reference, not stored directly yet
      tag: 'Arzon'
    },
    {
      from: 'Toshkent',
      to: 'Buxoro',
      distance: 580,
      duration: 480, // 8 hours
      price: 85000,
      frequency: 'Har kuni 8 ta reys',
      tag: ''
    },
    {
      from: 'Toshkent',
      to: 'Xiva',
      distance: 1000,
      duration: 840, // 14 hours
      price: 120000,
      frequency: 'Haftada 4 kun',
      tag: ''
    }
  ];

  for (const route of popularRoutes) {
    const fromId = citiesMap[route.from];
    const toId = citiesMap[route.to];

    if (fromId && toId) {
      const createdRoute = await prisma.route.upsert({
        where: {
          fromCityId_toCityId: {
            fromCityId: fromId,
            toCityId: toId,
          }
        },
        update: {
            price: route.price,
            distance: route.distance,
            duration: route.duration
        },
        create: {
          fromCityId: fromId,
          toCityId: toId,
          distance: route.distance,
          duration: route.duration,
          price: route.price,
        },
      });
      console.log(`Upserted route: ${route.from} -> ${route.to}`);
      
      // Create some trips for today and tomorrow
      const today = new Date();
      today.setHours(8, 0, 0, 0); // 08:00 AM start

      // Clear existing trips (optional, for clean state)
      // await prisma.trip.deleteMany({ where: { routeId: createdRoute.id } });

      for (let i = 0; i < 3; i++) { // Create 3 trips per route
        const departure = new Date(today);
        departure.setHours(today.getHours() + (i * 4)); // Every 4 hours
        
        const arrival = new Date(departure);
        arrival.setMinutes(arrival.getMinutes() + route.duration);

        await prisma.trip.create({
            data: {
                routeId: createdRoute.id,
                busId: busIds[i % busIds.length],
                departureTime: departure,
                arrivalTime: arrival,
                price: route.price,
                status: 'SCHEDULED'
            }
        });
        console.log(`Created trip for ${route.from} -> ${route.to} at ${departure.toISOString()}`);
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
