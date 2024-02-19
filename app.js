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

  function startPouring() {
    if (progress < 100) {
      progress += Math.floor(Math.random() * 6);

      if(progress > 100 ) progress += 100 - progress;
      io.emit('progress', progress);
    } else {
      clearInterval(taskInterval);
    }
    if(progress == 100) progress = 0;
  }

  const taskInterval = setInterval(() => {
    startPouring();
  }, 500);

  // Handle disconnect event
  socket.on('disconnect', () => {
    clearInterval(taskInterval);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
