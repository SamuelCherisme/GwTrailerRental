import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import serverRoutes from './serverRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(serverRoutes); // all routes from serverRoutes

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
