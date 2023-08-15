var connectionBasicChat = new signalR.HubConnectionBuilder().withUrl("/hubs/basicchat").build();

document.getElementById("sendMessage").disabled = true;

connectionBasicChat.on("MessageReceived", function (user, message) {
    var li = document.createElement("li");
    document.getElementById("messagesList").appendChild(li);
    li.textContent = `${user} - ${message}`;
    document.getElementById("chatMessage").value = "";
});

document.getElementById("sendMessage").addEventListener("click", function (event) {
    var sender = document.getElementById("senderEmail").value;
    var message = document.getElementById("chatMessage").value;
    var receiver = document.getElementById("receiverEmail").value;

    if (receiver.length > 0) {
        connectionBasicChat.send("SendMessageToReceiver", sender, receiver, message);
    }
    else {
        //send message to all of the users
        connectionBasicChat.send("SendMessageToAll", sender, message).catch(function (error) {
            return console.error(error.toString());
        });
    }
    document.getElementById("chatMessage").value = "";
    event.preventDefault;
});

connectionBasicChat.start().then(function () {
    document.getElementById("sendMessage").disabled = false;

});