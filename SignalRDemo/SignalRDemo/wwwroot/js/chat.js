var connectionChat = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null]) //default time to reconnect
    .build();

connectionChat.on("ReceiveUserConnected", function (userId, userName) {
    AddMessage(`${userName} has opened a connection.`);
});

connectionChat.on("ReceiveUserDisconnected", function (userId, userName) {
    AddMessage(`${userName} has closed a connection.`);
});

connectionChat.on("ReceiveAddRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    AddMessage(`${userName} has created room ${roomName}.`);
    fillRoomDropDown();
});

connectionChat.on("ReceiveDeleteRoomMessage", function (maxRoom, roomId, roomName, userId, userName) {
    AddMessage(`${userName} has deleted room ${roomName}.`);
    fillRoomDropDown();
});

connectionChat.on("ReceivePublicMessage", function (roomId, message, roomName, userId, userName) {
    AddMessage(`[Public Message - ${roomName}] ${userName} says ${message}`);
});

connectionChat.on("ReceivePrivateMessage", function (senderId, message, senderName, receiverId, chatId, receiverName) {
    AddMessage(`[Private Message - ${receiverName}] ${senderName} says ${message}`);
});

function SendPrivateMessage() {
    let inputMessage = document.getElementById("txtPrivateMessage");
    let ddlSelUser = document.getElementById("ddlSelUser");

    let receiverId = ddlSelUser.value;
    let receiverName = ddlSelUser.options[ddlSelUser.selectedIndex].text;
    var message = inputMessage.value;

    connectionChat.send("SendPrivateMessage", receiverId, message, receiverName);
    inputMessage.value = "";
}

function SendPublicMessage() {
    let inputMessage = document.getElementById("txtPublicMessage");
    let ddlSelRoom = document.getElementById("ddlSelRoom");

    let roomId = ddlSelRoom.value;
    let roomName = ddlSelRoom.options[ddlSelRoom.selectedIndex].text;
    var message = inputMessage.value;

    connectionChat.send("SendPublicMessage", Number(roomId), message, roomName);
}

function addnewRoom(maxRoom) {

    let createRoomName = document.getElementById('createRoomName');

    var roomName = createRoomName.value;

    if (roomName == null && roomName == '') {
        return;
    }

    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom', 
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connectionChat.send("SendAddRoomMessage", maxRoom, json.id, json.name);
            createRoomName.value = '';
        },
        error: function (xhr) {
            alert('error');
        }
    });
}

function DeleteRoom() {

    let ddlDelRoom = document.getElementById('ddlDelRoom');

    var roomName = ddlDelRoom.options[ddlDelRoom.selectedIndex].text;

    let textConfirmation = `Do you want to delete room ${roomName}?`;

    if (confirm(textConfirmation) == false)
        return;

    if (roomName == null && roomName == '')
        return;

    let roomId = ddlDelRoom.value;

    /*POST*/
    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: 'application/json;',
        async: true,
        processData: false,
        cache: false,
        success: function (json) {
            /*REMOVE ROOM COMPLETED SUCCESSFULLY*/
            connectionChat.send("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
            fillRoomDropDown();
        },
        error: function (xhr) {
            alert('error');
        }
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
});

function fillUserDropDown() {
    $.getJSON('/ChatRooms/GetChatUser')
        .done(function (json) {
            var ddlSelUser = document.getElementById("ddlSelUser");
            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");
                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}
function fillRoomDropDown() {

    $.getJSON('/ChatRooms/GetChatRoom')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

function AddMessage(message) {
    if (message == null && message == "")
        return;

    let ui = document.getElementById("messagesList");
    let li = document.createElement("li");
    li.innerHTML = message;
    ui.appendChild(li);
}

connectionChat.start();