import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import leadRoutes from './routes/lead.routes';
import favoriteRoutes from './routes/favorite.routes';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Android Property Listing App API');
});

// Routes will be added here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
