const server = require('./api/server.js');

const port = process.env.PORT || 5000; // why do I not need dotenv?
server.listen(port,()=> console.log(`\n** Running on port ${port}**\n`));