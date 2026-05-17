const express = require('express');
const authroutes = require('./routes/auth.routes');
const cookies = require('cookie-parser');
const workspaveRoutes = require('./routes/workspace.routes');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cookies());
app.use(cors({
    origin: 'https://notes-manager.vercel.app',
    credentials: true
}
));

app.use('/api/auth', authroutes);
app.use('/api/workspace', workspaveRoutes);

module.exports = app;