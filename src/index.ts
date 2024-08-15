import { Peer, DataConnection } from "peerjs";
import './style.css';
import { signal, initialize, join, addMessage, clearMessages } from "./send";

// ######################## Send ########################

// #### Send Global Variables ####
var send_peer: Peer =  new Peer({debug: 2}); // own peer object
var send_conn: DataConnection;
var send_status = document.getElementById("send_status") as HTMLElement;
var send_recvIdInput = document.getElementById("send_receiver-id") as HTMLInputElement;
var send_message = document.getElementById("send_message") as HTMLElement;
var send_goButton = document.getElementById("send_goButton") as HTMLElement;
var send_resetButton = document.getElementById("send_resetButton") as HTMLElement;
var send_fadeButton = document.getElementById("send_fadeButton") as HTMLElement;
var send_offButton = document.getElementById("send_offButton") as HTMLElement;
var send_sendMessageBox = document.getElementById("send_sendMessageBox") as HTMLInputElement;
var send_sendButton = document.getElementById("send_sendButton") as HTMLElement;
var send_clearMsgsButton = document.getElementById("send_clearMsgsButton") as HTMLElement;
var send_connectButton = document.getElementById("send_connect-button") as HTMLElement;

// Initialize peer
if (send_status)
{initialize(send_peer, send_status);}

// #### Send Callback Setup ####
// Start peer connection on click
if (send_connectButton && send_recvIdInput && send_status && send_message)
{send_connectButton.addEventListener('click', () => join(send_peer, send_recvIdInput,send_status, send_message, send_conn));}

// Add click event listener for send_goButton
send_goButton.addEventListener('click', function () {
    signal("Go", send_message, send_conn);
});


// Add click event listener for send_resetButton
send_resetButton.addEventListener('click', function () {
    signal("Reset", send_message, send_conn);
});


// Add click event listener for send_fadeButton
send_fadeButton.addEventListener('click', function () {
    signal("Fade", send_message, send_conn);
});


// Add click event listener for send_offButton
send_offButton.addEventListener('click', function () {
    signal("Off", send_message, send_conn);
});


// Add click event listener for send_sendMessageButton
send_sendMessageBox.addEventListener('keydown', function (e) {
    // Listen for enter in message box
    if (e.key === 'Enter') {
      send_sendButton.click();
    }
});

// Add click event listener for send_sendButton
// Send message
send_sendButton.addEventListener('click', function () {
    if (send_conn && send_conn.open) {
        var msg = send_sendMessageBox.value;
        send_sendMessageBox.value = "";
        send_conn.send(msg);
        console.log("Sent: " + msg);
        addMessage("<span class=\"selfMsg\">Self: </span> " + msg, send_message);
    } else {
        console.log('Connection is closed');
    }
});

// Add click event listener for send_clearMsgsButton
send_clearMsgsButton.addEventListener('click', () => clearMessages(send_message));


// ######################## Receive  ########################
