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
  const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Xiva', 'Navoiy', 'Nukus'];
  const cityMap = {};

  for (const cityName of cities) {
    const city = await prisma.city.upsert({
      where: { name: cityName },
      update: {},
      create: { name: cityName },
    });
    console.log(`Upserted city: ${city.name}`);
    cityMap[city.name] = city.id;
  }

  // Create Routes
  // Note: createMany is supported but relation IDs must be known.
  // Since we have cityMap, we can use createMany for bulk insertion if no conflicts,
  // but upsert is safer if running seed multiple times.

  const routes = [
    {
      from: 'Toshkent',
      to: 'Samarqand',
      price: 150000,
      duration: 300,
      distance: 300,
      description: 'Toshkentdan Samarqandga qulay avtobus qatnovi',
      arrivalLocation: 'Samarqand avtovokzali'
    },
    {
      from: 'Toshkent',
      to: 'Buxoro',
      price: 200000,
      duration: 420,
      distance: 600,
      description: 'Toshkentdan Buxoroga qulay avtobus qatnovi',
      arrivalLocation: 'Buxoro avtovokzali'
    },
    {
      from: 'Toshkent',
      to: 'Xiva',
      price: 250000,
      duration: 540,
      distance: 800,
      description: 'Toshkentdan Xivaga qulay avtobus qatnovi',
      arrivalLocation: 'Xiva avtovokzali'
    }
  ];

  for (const route of routes) {
      if (!cityMap[route.from] || !cityMap[route.to]) {
          console.warn(`Skipping route ${route.from} -> ${route.to}: City not found`);
          continue;
      }

      await prisma.route.upsert({
          where: {
              fromCityId_toCityId: {
                  fromCityId: cityMap[route.from],
                  toCityId: cityMap[route.to]
              }
          },
          update: {
              price: route.price,
              duration: route.duration,
              distance: route.distance,
              description: route.description,
              arrivalLocation: route.arrivalLocation
          },
          create: {
              fromCityId: cityMap[route.from],
              toCityId: cityMap[route.to],
              price: route.price,
              duration: route.duration,
              distance: route.distance,
              description: route.description,
              arrivalLocation: route.arrivalLocation
          }
      });
      console.log(`Upserted route: ${route.from} -> ${route.to}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
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
      tag: 'Arzon',
      description: 'Samarqandning mashhur Registon maydoni va Shohi-Zinda maqbarasiga sayohat.',
      arrivalLocation: 'Samarqand Avtovokzal (Registon yonida)',
      videoUrl: 'https://www.youtube.com/embed/ABCDEFG', // Placeholder
    },
    {
      from: 'Toshkent',
      to: 'Buxoro',
      distance: 580,
      duration: 480, // 8 hours
      price: 85000,
      frequency: 'Har kuni 8 ta reys',
      tag: '',
      description: 'Qadimgi Buxoro shahrining minoralarini o\'z ko\'zingiz bilan ko\'ring.',
      arrivalLocation: 'Buxoro Markaziy Avtovokzal',
      videoUrl: 'https://www.youtube.com/embed/XYZ1234', // Placeholder
    },
    {
      from: 'Toshkent',
      to: 'Xiva',
      distance: 1000,
      duration: 840, // 14 hours
      price: 120000,
      frequency: 'Haftada 4 kun',
      tag: '',
      description: 'Xiva - ochiq osmon ostidagi shahar-muzey.',
      arrivalLocation: 'Xiva Avtovokzal (Ichan Qal\'a yaqinida)',
      videoUrl: 'https://www.youtube.com/embed/LMNOP56', // Placeholder
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
            duration: route.duration,
            description: route.description,    // Add this
            arrivalLocation: route.arrivalLocation, // Add this
            videoUrl: route.videoUrl,          // Add this
        },
        create: {
          fromCityId: fromId,
          toCityId: toId,
          distance: route.distance,
          duration: route.duration,
          price: route.price,
          description: route.description,    // Add this
          arrivalLocation: route.arrivalLocation, // Add this
          videoUrl: route.videoUrl,          // Add this
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
