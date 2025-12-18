const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;

// Serve static files
app.use(express.static(__dirname));

// All routes go to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(` Animated app running on port ${port}`);
    console.log(` Open: http://localhost:${port}`);
});
