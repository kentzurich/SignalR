var connectionNotification = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/notification")
    .build();

document.getElementById("sendButton").disabled = true;

connectionNotification.on("LoadNotification", function (message, counter) {
    document.getElementById("messageList").innerHTML = "";
    var notificationCounter = document.getElementById("notificationCounter");
    notificationCounter.innerHTML = "<span>(" + counter + ")</span>";

    for (let x = message.length - 1; x >= 0; x--) {
        var li = document.createElement("li");
        li.textContent = "Notification - " + message[x];
        document.getElementById("messageList").appendChild(li); 
    }
});


document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("notificationInput").value;
    connectionNotification.send("SendMessage", message).then(function () {
        document.getElementById("notificationInput").value = "";
    });
    event.preventDefault;
});

connectionNotification.start().then(function () {
    connectionNotification.send("LoadMessages");
    document.getElementById("sendButton").disabled = false;
});