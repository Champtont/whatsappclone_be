let onlineUsers = [];

console.log(onlineUsers)

export const newConnectionHandler = (newClient) => {
  console.log("NEW CONNECTION:", newClient.id);
  newClient.emit("welcome", { message: `Hey ${newClient.id}!` });

  newClient.on("setUsername", (payload) => {
    console.log(payload);
    onlineUsers.push({ username: payload.username, socketId: newClient.id });

    newClient.emit("loggedIn", onlineUsers);

    newClient.broadcast.emit("updateOnlineUsersList", onlineUsers);
  });

  newClient.on('joinRoom', (payload) => {
    newClient.join(payload.room)
    newClient.emit("joinedRoom", `You have joined the room: ${payload.room}`)
    console.log("Joined room event", payload.room)
  })

  newClient.on("sendMsg", (message, room) => {
    const user = getUser(newClient.id)
    io.to(room).emit('message', {user: user.username, text: message})
  })


  newClient.on("sendMessage", (message) => {
    console.log("NEW MESSAGE:", message);

    newClient.broadcast.emit("newMessage", message);
  });

  newClient.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== newClient.id);
    newClient.broadcast.emit("updateOnlineUsersList", onlineUsers);
  });
};
