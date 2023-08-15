var cloakSpan = document.getElementById("cloakCounter");
var stoneSpan = document.getElementById("stoneCounter");
var wandSpan = document.getElementById("wandCounter");

//create connection
var connectionDeathlyHallows = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/deathlyHallows")
    .build();

//connect to methods that hub invokes aka recieve notif from hub
connectionDeathlyHallows.on("updateDeathlyHallowsCount", (cloakCount, stoneCount, wandCount) => {
    cloakSpan.innerText = cloakCount.toString();
    stoneSpan.innerText = stoneCount.toString();
    wandSpan.innerText = wandCount.toString();
});

//invoke hub methods aka send notif to hub from serverside


//start connections
function Fulfilled() {
    connectionDeathlyHallows.invoke("GetRaceStatus").then((raceCounter) => {
        cloakSpan.innerText = raceCounter.cloak.toString();
        stoneSpan.innerText = raceCounter.stone.toString();
        wandSpan.innerText = raceCounter.wand.toString();
    });
    // do something on start
    console.log("Connection to user hub successful.");
}

function Rejected() {
    // reject logs

}

connectionDeathlyHallows.start().then(Fulfilled, Rejected);