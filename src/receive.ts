import { Peer, DataConnection } from "peerjs";
import { s_addMessage } from "./send";
// Note: All args of type HTMLElement are global variables defined within index.ts. The observant reader should infer this based on the fact that there are no return values.

// Create the Peer object for our end of the connection.
export function r_initialize(peer: Peer, recvId: HTMLElement, status: HTMLElement, message: HTMLElement, goBox: HTMLElement, fadeBox: HTMLElement, standbyBox: HTMLElement, offBox: HTMLElement, callback:(conn: DataConnection) => void) {
    let conn: DataConnection | null = null;
    peer.on('open', function () {
        // Workaround for peer.reconnect deleting previous id
        // if (peer.id === null) {
        //     console.log('Received null id from peer open');
        //     peer.id = lastPeerId;
        // } else {
        //     lastPeerId = peer.id;
        // }
        console.log('Recv ID: ' + peer.id);
        status.innerHTML = "Awaiting connection...";
        recvId.innerHTML = "ID: " + peer.id;

    });
    peer.on('connection', function (c) {
        // Allow only a single connection
        // Only runs if there isn't an existing connection
        if (conn && conn.open) {
            c.on('open', function() {
                c.send("Already connected to another client");
                setTimeout(function() { c.close(); }, 500);
            });
            // This return prevents all the code at the bottom from running. T
            return conn;
        }
        conn = c;
        console.log("Receiver Connected to: " + conn.peer);
        status.innerHTML = "Connected";
        conn = ready(conn, status, message, goBox, fadeBox, standbyBox, offBox);
        console.log("Receiver Conn Created");
        callback(conn)
    });
    peer.on('disconnected', function () {
        status.innerHTML = "Connection lost. Please reconnect";
        console.log('Connection lost. Please reconnect');
        // Workaround for peer.reconnect deleting previous id
        // peer.id = lastPeerId;
        // peer._lastServerId = lastPeerId;
        peer.reconnect();
    });
    peer.on('close', function() {
        // TODO: If this is used within a callback, remember to call peer.destroy
        if(conn){conn.close()};
        status.innerHTML = "Connection destroyed. Please refresh";
        console.log('Connection destroyed');
    });
    peer.on('error', function (err) {
        console.log(err);
        alert('' + err);
    });
    return conn;
};

//  Triggered once a connection has been achieved.
//  Defines callbacks to handle incoming data and connection events.
function ready(conn: DataConnection, status: HTMLElement, message: HTMLElement, goBox: HTMLElement, fadeBox: HTMLElement, standbyBox: HTMLElement, offBox: HTMLElement) {
    // TODO: Use an ENUM for the different cases
    conn.on('data', function (data) {
        console.log("Data received");
        var cueString = "<span class=\"cueMsg\">Cue: </span>";
        switch (data) {
            case 'Go':
                go(goBox, fadeBox, standbyBox, offBox);
                s_addMessage(cueString + data, message);
                break;
            case 'Fade':
                fade(goBox, fadeBox, standbyBox, offBox);
                s_addMessage(cueString + data, message);
                break;
            case 'Off':
                off(goBox, fadeBox, standbyBox, offBox);
                s_addMessage(cueString + data, message);
                break;
            case 'Reset':
                reset(goBox, fadeBox, standbyBox, offBox);
                s_addMessage(cueString + data, message);
                break;
            default:
                s_addMessage("<span class=\"peerMsg\">Peer: </span>" + data, message);
                break;
        };
    });
    conn.on('close', function () {
        status.innerHTML = "Connection reset<br>Awaiting connection...";
        console.log('Connection closed. Receiver Side');
    });
    return conn;
}

function go(goBox: HTMLElement, fadeBox: HTMLElement, standbyBox: HTMLElement, offBox: HTMLElement) {
    standbyBox.className = "display-box hidden";
    goBox.className = "display-box go";
    fadeBox.className = "display-box hidden";
    offBox.className = "display-box hidden";
    return;
};

function fade(goBox: HTMLElement, fadeBox: HTMLElement, standbyBox: HTMLElement, offBox: HTMLElement) {
    standbyBox.className = "display-box hidden";
    goBox.className = "display-box hidden";
    fadeBox.className = "display-box fade";
    offBox.className = "display-box hidden";
    return;
};

function off(goBox: HTMLElement, fadeBox: HTMLElement, standbyBox: HTMLElement, offBox: HTMLElement) {
    standbyBox.className = "display-box hidden";
    goBox.className = "display-box hidden";
    fadeBox.className = "display-box hidden";
    offBox.className = "display-box off";
    return;
}

function reset(goBox: HTMLElement, fadeBox: HTMLElement, standbyBox: HTMLElement, offBox: HTMLElement) {
    standbyBox.className = "display-box standby";
    goBox.className = "display-box hidden";
    fadeBox.className = "display-box hidden";
    offBox.className = "display-box hidden";
    return;
};
