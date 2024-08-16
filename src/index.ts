import { Peer, DataConnection } from "peerjs";
import './style.css';
import { s_signal, s_initialize, s_join, s_addMessage, s_clearMessages } from "./send";
import { r_initialize } from "./receive";

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
s_initialize(send_peer, send_status);

// #### Send Callback Setup ####

// Start peer connection on click

send_connectButton.addEventListener('click', () => {send_conn =s_join(send_peer, send_recvIdInput,send_status, send_message, send_conn)});

// Add click event listener for send_goButton
send_goButton.addEventListener('click', function () {
    s_signal("Go", send_message, send_conn);
});


// Add click event listener for send_resetButton
send_resetButton.addEventListener('click', function () {
    s_signal("Reset", send_message, send_conn);
});


// Add click event listener for send_fadeButton
send_fadeButton.addEventListener('click', function () {
    s_signal("Fade", send_message, send_conn);
});


// Add click event listener for send_offButton
send_offButton.addEventListener('click', function () {
    s_signal("Off", send_message, send_conn);
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
    // console.log(typeof send_conn);
    if (send_conn.open) {
        var msg = send_sendMessageBox.value;
        send_sendMessageBox.value = "";
        send_conn.send(msg);
        console.log("Sent: " + msg);
        s_addMessage("<span class=\"selfMsg\">Self: </span> " + msg, send_message);
    } else {
        console.log('Connection is closed');
    }
});

// Add click event listener for send_clearMsgsButton
send_clearMsgsButton.addEventListener('click', () => s_clearMessages(send_message));


// ######################## Receive ########################
var recv_peer = new Peer({debug: 2});
var recv_conn: DataConnection;
var recv_recvId = document.getElementById("recv_receiver-id") as HTMLElement;
var recv_status = document.getElementById("recv_status") as HTMLElement;
var recv_message = document.getElementById("recv_message") as HTMLElement;
var recv_standbyBox = document.getElementById("recv_standby") as HTMLElement;
var recv_goBox = document.getElementById("recv_go") as HTMLElement;
var recv_fadeBox = document.getElementById("recv_fade") as HTMLElement;
var recv_offBox = document.getElementById("recv_off") as HTMLElement;
var recv_sendMessageBox = document.getElementById("recv_sendMessageBox") as HTMLInputElement;
var recv_sendButton = document.getElementById("recv_sendButton") as HTMLElement;
var recv_clearMsgsButton = document.getElementById("recv_clearMsgsButton") as HTMLElement;

r_initialize(recv_peer, recv_recvId, recv_status, recv_message, recv_standbyBox, recv_goBox, recv_fadeBox, recv_offBox, (conn) => {recv_conn = conn});

// Listen for enter in message box
recv_sendMessageBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        recv_sendButton.click();
      }
});
// Send from Message Receiver
recv_sendButton.addEventListener('click', function () {
    if (recv_conn && recv_conn.open) {
        var msg = recv_sendMessageBox.value;
        recv_sendMessageBox.value = "";
        recv_conn.send(msg);
        console.log("Sent: " + msg)
        s_addMessage("<span class=\"selfMsg\">Self: </span>" + msg, recv_message);
    } else {
        console.log('Connection is closed');
    }
});


// Clear messages box
recv_clearMsgsButton.addEventListener('click', () =>s_clearMessages(recv_message));

