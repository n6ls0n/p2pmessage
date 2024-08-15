import { Peer, DataConnection } from "peerjs";

// Create the Peer object for our end of the connection.
// Sets up callbacks that handle any events related to our peer object.
export function initialize(peer: Peer, status: HTMLElement) {
    // Create own peer object with connection to shared PeerJS server
    peer.on('open', function () {
        // if (peer.id === null && lastPeerId !== null) {
        //     console.log('Received null id from peer open');
        //     peer = new Peer(lastPeerId, {debug: 2}) ;
        // } else {
        //     lastPeerId = peer.id;
        // }
        console.log('ID: ' + peer.id);
    });
    peer.on('connection', function (dataConnection) {
        // Disallow incoming connections
        dataConnection.on('open', function() {
            dataConnection.send("Sender does not accept incoming connections");
            setTimeout(function() { dataConnection.close(); }, 500);
        });
    });
    peer.on('disconnected', function () {
        status.innerHTML = "Connection lost. Please reconnect";
        console.log('Connection lost. Please reconnect');
        // TODO: Verify this functionality
        peer.reconnect();
    });
    peer.on('close', function() {
        status.innerHTML = "Connection destroyed. Please refresh";
        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
};

// //  Create the connection between the two Peers.
// //  Sets up callbacks that handle any events related to the connection and data received on it.
// export function join(peer: Peer, recvIdInput: HTMLInputElement, status: HTMLElement, message: HTMLElement) {
//     // TODO: Add code to handle case where a connection to a peer already exists and a new connection needs to be made then remove the code below
//     // Close old connection
//     // if (conn) {
//     //     conn.close();
//     // }

//     // Create connection to destination peer specified in the input field
//     var conn: DataConnection = peer.connect(recvIdInput.value, {
//         reliable: true
//     });

//     // Return status message
//     conn.on('open', function () {
//         status.innerHTML = "Connected to: " + conn.peer;
//         console.log("Connected to: " + conn.peer);
//         // Check URL params for commands that should be sent immediately
//         var command = getUrlParam("command");
//         if (command)
//             conn.send(command);
//     });

//     // Handle incoming data (messages only since this is the signal sender)
//     conn.on('data', function (data) {
//         addMessage("<span class=\"peerMsg\">Peer:</span> " + data, message);
//     });

//     conn.on('close', function () {
//         if (status !== null){
//         status.innerHTML = "Connection closed";
//         }
//     });
// };

// //  Get first "GET style" parameter from href.
// //  This enables delivering an initial command upon page load.
// //  TODO: Would have been easier to use location.hash.(Original Author comment)
// export function getUrlParam(name: string) {
//     name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//     var regexS = "[\\?&]" + name + "=([^&#]*)";
//     var regex = new RegExp(regexS);
//     var results = regex.exec(window.location.href);
//     if (results == null)
//         return null;
//     else
//         return results[1];
// };

// /**
//  * Adds a message to the specified HTML element with the current time.
//  *
//  * @param {string} msg - The message to be added.
//  * @param {HTMLElement} message - The HTML element where the message will be added.
//  * @return {HTMLElement} The updated HTML element with the added message.
//  */
// function addZero(t: number) : string {
//     if (t < 10) {
//         return "0" + String(t);
//     } else {
//         return String(t);
//     }
// }

// export function addMessage(msg: string, message: HTMLElement) {
//     var now = new Date();
//     var h = now.getHours();
//     var m = addZero(now.getMinutes());
//     var s = addZero(now.getSeconds());
//     if (h > 12)
//         h -= 12;
//     else if (h === 0)
//         h = 12;
//     message.innerHTML = "<br><span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg + message.innerHTML;
//     return message;
// };

//  export function clearMessages(message: HTMLElement) {
//     message.innerHTML = "";
//     addMessage("Msgs cleared",message);
// };

// //  Send a signal via the peer connection and add it to the log.
// //  This will only occur if the connection is still alive.
// //  "message" and "conn" are global variables defined in
// export function signal(sigName: string, message: HTMLElement, conn: DataConnection) {
//     var cueString = "<span class=\"cueMsg\">Cue: </span>";
//     if (conn && conn.open) {
//         conn.send(sigName);
//         console.log(sigName + " signal sent");
//         addMessage(cueString + sigName, message);
//     } else {
//         console.log('Connection is closed');
//     }
// };



