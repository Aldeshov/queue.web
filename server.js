const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, "dist", "queue")));
app.get('/*', function(req,res) {
	res.sendFile(path.join(__dirname, "dist", "queue", "index.html"));
});
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
