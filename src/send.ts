import { Peer, DataConnection } from "peerjs";
// Note: All args of type HTMLElement are global variables defined within index.ts. The observant reader should infer this based on the fact that there are no return values.


// Create the Peer object for our end of the connection.
// Sets up callbacks that handle any events related to our peer object.
export function s_initialize(peer: Peer, status: HTMLElement) {
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

//  Create the connection between the two Peers.
//  Sets up callbacks that handle any events related to the connection and data received on it.
export function s_join(peer: Peer, recvIdInput: HTMLInputElement, status: HTMLElement, message: HTMLElement, conn: DataConnection) {
    // TODO: Add code to handle case where a connection to a peer already exists and a new connection needs to be made then remove the code below
    // Close old connection
    if (conn) {
        conn.close();
    }

    // Create connection to destination peer specified in the input field
    conn = peer.connect(recvIdInput.value, {
        reliable: true
    });

    // Return status message
    conn.on('open', function () {
        status.innerHTML = "Connected to: " + conn.peer;
        console.log("Connected to: " + conn.peer);
        // Check URL params for commands that should be sent immediately
        var command = s_getUrlParam("command");
        if (command)
            conn.send(command);
    });

    // Handle incoming data (messages only since this is the signal sender)
    conn.on('data', function (data) {
        s_addMessage("<span class=\"peerMsg\">Peer:</span> " + data, message);
    });

    conn.on('close', function () {
        if (status !== null){
        status.innerHTML = "Connection closed";
        }
    });
};

//  Send a signal via the peer connection and add it to the log.
//  This will only occur if the connection is still alive.
export function s_signal(sigName: string, message: HTMLElement, conn: DataConnection) {
    var cueString = "<span class=\"cueMsg\">Cue: </span>";
    if (conn && conn.open) {
        conn.send(sigName);
        console.log(sigName + " signal sent");
        s_addMessage(cueString + sigName, message);
    } else {
        console.log('Connection is closed');
    }
};

// Adds a message to the specified HTML element with the current time.
export function s_addMessage(msg: string, message: HTMLElement) {
    var now = new Date();
    var h = now.getHours();
    var m = addZero(now.getMinutes());
    var s = addZero(now.getSeconds());
    if (h > 12)
        h -= 12;
    else if (h === 0)
        h = 12;
    message.innerHTML = "<br><span class=\"msg-time\">" + h + ":" + m + ":" + s + "</span>  -  " + msg + message.innerHTML;
    return message;
};

// Clears the messages in the specified HTML element via adding an empty string and then another string.
export function s_clearMessages(message: HTMLElement) {
    message.innerHTML = "";
    s_addMessage("Msgs cleared",message);
};

// Utility function used in the addMessage function
function addZero(t: number) : string {
    if (t < 10) {
        return "0" + String(t);
    } else {
        return String(t);
    }
};

//  Utility function used in the join function
//  Get first "GET style" parameter from href.
//  This enables delivering an initial command upon page load.
//  TODO: Would have been easier to use location.hash.(Original Author comment)
function s_getUrlParam(name: string) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return null;
    else
        return results[1];
};




