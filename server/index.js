const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const app = express();

console.log('DATABASE_URL is:', process.env.DATABASE_URL ? 'DEFINED' : 'UNDEFINED');
if (!process.env.DATABASE_URL) {
  console.error('CRITICAL: DATABASE_URL is missing!');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Bussales API is running');
});

// Example route to get cities
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await prisma.city.findMany();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Error fetching cities' });
  }
});

// Endpoint to fetch popular routes
app.get('/api/popular-routes', async (req, res) => {
  try {
    // Ideally, we would fetch routes with the most bookings or search hits
    // For now, we fetch all routes and transform them to match the UI requirements
    const routes = await prisma.route.findMany({
      include: {
        fromCity: true,
        toCity: true,
        trips: { // Include trips to calculate frequency
            where: {
                departureTime: {
                    gte: new Date(), // Only future trips or all?
                }
            },
            take: 100 // Safe limit
        }
      }
    });

    const formattedRoutes = routes.map(route => {
        // Calculate mocked frequency based on the seeded logic for now 
        // In real app, this would be a complex query
        let frequency = 'Har kuni reyslar mavjud';
        if (route.trips.length > 5) {
            frequency = `Har kuni ${Math.floor(route.trips.length / 2)} ta reys`; // Simple heuristic
        } else if (route.trips.length > 0) {
             frequency = `Haftada ${route.trips.length} kun`;
        }
        
        // Mock tag logic
        let tag = '';
        if (route.price < 60000) tag = 'Arzon';
        
        return {
            id: route.id,
            from: route.fromCity.name, // "Toshkent"
            to: route.toCity.name,   // "Samarqand"
            price: route.price,
            frequency: frequency, 
            tag: tag,
            description: route.description,    // NEW
            arrivalLocation: route.arrivalLocation, // NEW
            videoUrl: route.videoUrl           // NEW
        };
    });

    res.json(formattedRoutes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching popular routes' });
  }
});

// Search trips by from/to city
app.get('/api/search', async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'from and to parameters are required' });
    }

    const trips = await prisma.trip.findMany({
      where: {
        route: {
          fromCity: { name: from },
          toCity: { name: to },
        },
        status: 'SCHEDULED',
      },
      include: {
        route: {
          include: {
            fromCity: true,
            toCity: true,
          },
        },
        bus: true,
      },
      orderBy: {
        departureTime: 'asc',
      },
    });

    const formatted = trips.map(trip => {
      const dep = new Date(trip.departureTime);
      const arr = new Date(trip.arrivalTime);
      const durationMin = Math.round((arr - dep) / 60000);
      const hours = Math.floor(durationMin / 60);
      const mins = durationMin % 60;

      return {
        id: trip.id,
        departureTime: dep.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', hour12: false }),
        arrivalTime: arr.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: `${hours}s ${String(mins).padStart(2, '0')}m`,
        price: trip.price,
        from: trip.route.fromCity.name,
        to: trip.route.toCity.name,
        fromStation: trip.route.arrivalLocation ? `${trip.route.fromCity.name} Avtovokzal` : `${trip.route.fromCity.name}`,
        toStation: trip.route.arrivalLocation || trip.route.toCity.name,
        busModel: trip.bus.model,
        seats: trip.bus.seats,
        status: trip.status,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error searching trips:', error);
    res.status(500).json({ error: 'Error searching trips' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
