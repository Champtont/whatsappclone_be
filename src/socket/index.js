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

  newClient.on("joinChat", ({userName, room}) => {
    socket.emit("welcome!")

  })

  newClient.on("sendMsg", (message) => {
    const user = getUser(newClient.id)
    io.to(user.room).emit('message', {user: user.username, text: message})
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
