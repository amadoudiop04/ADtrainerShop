import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import * as db from 'db';
import userRoutes from './src/routes/user.route';
import collectionRoutes from './src/routes/collection.route';
import productRoutes from './src/routes/product.route';
import orderRoutes from './src/routes/order.route';
import coachingRequestRoutes from './src/routes/coaching-request.route';
import newsletterSubscriptionRoutes from './src/routes/newsletter-subscription.route';


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// global request logger for diagnostics
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[INCOMING] ${req.method} ${req.path}`);
  next();
});

// ✅ ENREGISTRER LES ROUTES AVANT DE DÉMARRER LE SERVEUR
console.log('DEBUG: userRoutes type:', typeof userRoutes);
console.log('DEBUG: userRoutes:', userRoutes);

app.use('/users', userRoutes);
app.use('/collections', collectionRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/coaching-requests', coachingRequestRoutes);
app.use('/newsletter-subscriptions', newsletterSubscriptionRoutes);

// diagnostic route to verify which users handler is active
app.get('/users/check', (req: Request, res: Response) => {
  res.json({ debug: 'users-check from index.ts' });
});

app.get('/', (req: Request, res: Response) => {
  res.send('api is working');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const startServer = async () => {
  const dbPostgresURI = process.env.DB_POSTGRES_URI;

  try {
    if (!dbPostgresURI) {
      throw new Error('DB_POSTGRES_URI is not defined in environment variables');
    }
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }

  await db.connect(dbPostgresURI);
  console.log('Database connected successfully');

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // dump router stack for diagnostics (after app.listen)
    setTimeout(() => {
      try {
        const stack = (app as any)._router.stack || [];
        console.log('DEBUG: app router layers:');
        stack.forEach((layer: any) => {
          if (layer && layer.name) console.log(' layer name:', layer.name, ' regexp:', layer.regexp && layer.regexp.toString());
          if (layer && layer.route && layer.route.path) console.log('  route path:', layer.route.path, ' methods:', layer.route.methods);
        });
      } catch (err) {
        console.error('DEBUG: failed to dump router stack', err);
      }
    }, 100);
  });
};

startServer();
