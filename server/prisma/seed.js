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
  const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Xiva', 'Nukus'];
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
  
  // Note: Navoiy is skipped as per request to remove it.

  // Create Routes
  const routes = [
    {
      from: 'Toshkent',
      to: 'Samarqand',
      price: 150000,
      duration: 300, // 5 hours
      distance: 300,
      description: 'Samarqandning mashhur Registon maydoni va Shohi-Zinda maqbarasiga sayohat.',
      arrivalLocation: 'Registon',
      videoUrl: 'https://www.youtube.com/embed/ABCDEFG',
    },
    {
      from: 'Toshkent',
      to: 'Buxoro',
      price: 200000,
      duration: 420, // 7 hours
      distance: 600,
      description: 'Qadimgi Buxoro shahrining minoralarini o\'z ko\'zingiz bilan ko\'ring.',
      arrivalLocation: 'Bukhara Old City',
      videoUrl: 'https://www.youtube.com/embed/XYZ1234',
    },
    {
      from: 'Toshkent',
      to: 'Xiva',
      price: 250000,
      duration: 540, // 9 hours
      distance: 800,
      description: 'Ichan Qal\'aning afsonaviy ko\'chalarida sayr qiling.',
      arrivalLocation: 'Khiva. Ichan Kala Old City',
      videoUrl: 'https://www.youtube.com/embed/MNO5678',
    },
     {
      from: 'Toshkent',
      to: 'Nukus',
      price: 300000,
      duration: 720, // 12 hours
      distance: 1000,
      description: 'San\'at va madaniyat durdonasi.',
      arrivalLocation: 'Nukus Markaziy',
      videoUrl: null,
    }
  ];

  for (const route of routes) {
      if (!cityMap[route.from] || !cityMap[route.to]) {
          console.warn(`Skipping route ${route.from} -> ${route.to}: City not found`);
          continue;
      }

      const createdRoute = await prisma.route.upsert({
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
              arrivalLocation: route.arrivalLocation,
              videoUrl: route.videoUrl
          },
          create: {
              fromCityId: cityMap[route.from],
              toCityId: cityMap[route.to],
              price: route.price,
              duration: route.duration,
              distance: route.distance,
              description: route.description,
              arrivalLocation: route.arrivalLocation,
              videoUrl: route.videoUrl
          }
      });
      console.log(`Upserted route: ${route.from} -> ${route.to}`);
      
      // Create Trips for the route
      // We need a bus for trips. Let's create or find one.
       const busParams = { number: '01A777AA', model: 'Yutong ZK6122', seats: 53 };
       const bus = await prisma.bus.upsert({
            where: { number: busParams.number },
            update: {},
            create: busParams
       });
       
       // Create 3 trips for today at different times
       const tripTimes = [3, 7, 11]; // Hours
       const today = new Date();
       today.setHours(0,0,0,0);
       
       for (const hour of tripTimes) {
           const departureTime = new Date(today);
           departureTime.setHours(hour + 5, 0, 0, 0); // +5 to ensurefuture? Or simple fixed times
            
           // Simple check to not duplicate trips excessively if run repeatedly without smarter logic
           // For seeding, usually we wipe or just create. 
           // Let's just create one trip per route per run to be simple or check if exists?
           // Prisma doesn't have easy upsert for trips without unique constraint ID.
           // We will skip trip creation if we want to be safe, OR just create new ones.
           // Let's create new ones for now as it's a seed script.
           
           await prisma.trip.create({
               data: {
                   routeId: createdRoute.id,
                   busId: bus.id,
                   departureTime: departureTime,
                   arrivalTime: new Date(departureTime.getTime() + route.duration * 60000),
                   price: route.price,
                   status: 'SCHEDULED'
               }
           });
           console.log(`Created trip for ${route.from} -> ${route.to} at ${departureTime.toISOString()}`);
       }
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
