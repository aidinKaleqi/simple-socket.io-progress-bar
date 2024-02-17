const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let progress = 0;

// Socket.io connection event
io.on('connection', (socket) => {
  // Emit initial progress value when a new client connects
  socket.emit('progress', progress);

  // Simulate a task that increments the progress and emits it to all clients
  const taskInterval = setInterval(() => {
    if (progress < 100) {
      progress += 1;
      io.emit('progress', progress); // Broadcast progress to all connected clients
    } else {
      clearInterval(taskInterval);
    }
  }, 1000);

  // Handle disconnect event
  socket.on('disconnect', () => {
    clearInterval(taskInterval);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
