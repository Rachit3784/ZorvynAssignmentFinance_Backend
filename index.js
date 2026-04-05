import http from 'http'
import { app, connectDB } from './app.js'
import { PORT } from './config/EnvVariable.js'

const server  = http.createServer(app);

connectDB().then(() => {
    server.listen(PORT , ()=>{
        console.log(`Server started at http://localhost:${PORT}`);
    });
});