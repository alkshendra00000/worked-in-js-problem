const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");

const randomReplies = [
"ok 👍",
"haha 😂",
"samajh gaya",
"thik hai",
"baad me baat karte hain",
"nice!",
"achha idea hai",
"👍👍"
];

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function(e){
if(e.key === "Enter"){
sendMessage();
}
});

function sendMessage(){

let text = messageInput.value.trim();

if(text === "") return;

createMessage(text,"sent");

messageInput.value="";

setTimeout(()=>{
let reply = randomReplies[Math.floor(Math.random()*randomReplies.length)];
createMessage(reply,"received");
},1000 + Math.random()*2000);

}

function createMessage(text,type){

let messageDiv = document.createElement("div");
messageDiv.classList.add("message",type);

let msgText = document.createElement("span");
msgText.innerText = text;

let time = document.createElement("span");
time.classList.add("msg-time");

let now = new Date();
let h = now.getHours();
let m = now.getMinutes();

if(m < 10){
m = "0"+m;
}

time.innerText = h + ":" + m;

messageDiv.appendChild(msgText);
messageDiv.appendChild(time);

chatMessages.appendChild(messageDiv);

chatMessages.scrollTop = chatMessages.scrollHeight;

}