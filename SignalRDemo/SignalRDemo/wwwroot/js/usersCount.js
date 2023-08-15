//create connection
var connectionUserCount = new signalR
    .HubConnectionBuilder()
    //.configureLogging(signalR.LogLevel.Information)
    //.withUrl("/hubs/userCount", signalR.HttpTransportType.ServerSentEvents)
    //.withUrl("/hubs/userCount", signalR.HttpTransportType.LongPolling)
    .withAutomaticReconnect()
    .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets)
    .build();

//connect to methods that hub invokes aka recieve notif from hub
connectionUserCount.on("updateTotalViews", (value) => {
    var newCountSpan = document.getElementById("totalViewsCounter");
    newCountSpan.innerText = value.toString();
});

connectionUserCount.on("updateTotalUsers", (totalUsers) => {
    var newCountSpan = document.getElementById("totalUsersCounter");
    newCountSpan.innerText = totalUsers.toString();
});


//invoke hub methods aka send notif to hub from serverside
function NewWindowLoadedOnClient()
{
    //connectionUserCount.send("NewWindowLoaded"); // you do not get any value response from server.
    connectionUserCount.invoke("NewWindowLoaded", "Kent").then((value) => console.log(value)); // expects a value response
}

//start connections
function Fulfilled() {
    // do something on start
    console.log("Connection to user hub successful.");
    NewWindowLoadedOnClient();
}

function Rejected() {
    // reject logs

}

connectionUserCount.onclose((error) => {
    document.body.style.background = "red";
});

connectionUserCount.onreconnected((connectionId) => {
    document.body.style.background = "green";
});

connectionUserCount.onreconnecting((error) => {
    document.body.style.background = "orange";
});

connectionUserCount.start().then(Fulfilled, Rejected);