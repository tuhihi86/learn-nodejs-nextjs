import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

const path = require('path');
const swaggerSpec = YAML.load(path.join(__dirname, 'swagger', 'swagger.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true
}));


app.use('/api/users', userRoutes);
app.use('/api/products',productRoutes );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
