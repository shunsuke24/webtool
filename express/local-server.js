const app = require('./server')
const cors = require("cors");

app.use(cors({ origin: true, credentials: true }));

app.listen(3000, () => {
    // console.log('listening');
})