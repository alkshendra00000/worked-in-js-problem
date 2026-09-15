const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");

const randomReplies = [
"ok 👍",
"haha 😂",
"samajh gaya",
"Achha, sahi hai, thik hai 🙂",
"baad me baat karte hain",
"nice!",
"achha idea hai",
"Bilkul, samajh gaya 👍",
"Haan, ye bhi sahi hai",
"Theek hai, koi baat nahi 😊",
"Acha laga sun kar"
];

const questionBank = [
	{
		question: "Tumhara favourite color kya hai?",
		answers: ["blue", "red", "green", "black", "white", "yellow", "pink", "neela", "lal", "hara"],
		reply: "Nice choice! Mera favourite color green hai 💚"
	},
	{
		question: "Tumhe chai pasand hai ya coffee?",
		answers: ["chai", "tea", "coffee", "coffe"],
		reply: "Wah! Ek cup saath mein ho jaye ☕"
	},
	{
		question: "Aaj tumhara din kaisa ja raha hai?",
		answers: ["good", "great", "acha", "achha", "theek", "thik", "bad", "bura", "fine"],
		reply: "Batane ke liye thanks! 😊"
	},
	{
		question: "Tumhe music pasand hai?",
		answers: ["yes", "haan", "ha", "no", "nahi", "nahin"],
		reply: "Music mood ko instantly better kar deta hai 🎵"
	}
];

let activeQuestion = null;

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
		let reply = getBotReply(text);
createMessage(reply,"received");
},1000 + Math.random()*2000);

}

function getBotReply(text){
	const normalizedText = text.toLowerCase().trim();

	if(activeQuestion){
		const isNegative = /\b(nahi|nahin|no|not|pasand nahi|bilkul nahi|bura|bad)\b/.test(normalizedText);
		if(isNegative){
			activeQuestion = null;
			return "Achha, sahi hai, thik hai 🙂 Har kisi ki apni pasand hoti hai." + "\n\n" + askRandomQuestion();
		}

		const answerMatches = activeQuestion.answers.some((answer) => normalizedText.includes(answer));
		const answerReply = answerMatches
			? activeQuestion.reply
			: "Thoda aur clearly batao, please 🙂";

		activeQuestion = null;
		return answerReply + "\n\n" + askRandomQuestion();
	}

	if(normalizedText.includes("hello") || normalizedText.includes("hi") || normalizedText.includes("namaste")){
		return "Hello! 👋" + "\n\n" + askRandomQuestion();
	}

	if(/\b(achha|acha|sahi|thik|theek|ok|okay)\b/.test(normalizedText)){
		return "Haan, achha hai 🙂 Tum batao, aur kya chal raha hai?";
	}

	if(/\b(nahi|nahin|no|not|pasand nahi)\b/.test(normalizedText)){
		return "Achha, sahi hai, thik hai 🙂 Har kisi ki apni pasand hoti hai.";
	}

	if(normalizedText.includes("?") || normalizedText.includes("kya") || normalizedText.includes("kaise")){
		return "Main ek simple chat bot hoon, par baat karna mujhe pasand hai 😊";
	}

	return randomReplies[Math.floor(Math.random()*randomReplies.length)];
}

function askRandomQuestion(){
	activeQuestion = questionBank[Math.floor(Math.random()*questionBank.length)];
	return activeQuestion.question;
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

setTimeout(() => {
	createMessage("Hello! 👋 Main tumse ek random question poochunga.", "received");
	setTimeout(() => createMessage(askRandomQuestion(), "received"), 700);
}, 400);