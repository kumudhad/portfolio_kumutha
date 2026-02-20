/* ===== Scroll Animation Background ===== */

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240;
const images = [];
let currentFrame = 0;

function currentFramePath(index){
return `frames/ezgif-frame-${String(index+1).padStart(3,'0')}.jpg`;
}

for(let i=0;i<frameCount;i++){
const img = new Image();
img.src = currentFramePath(i);
images.push(img);
}

function drawFrame(index){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.drawImage(images[index],0,0,canvas.width,canvas.height);
}

window.addEventListener("scroll", ()=>{
const scrollTop = document.documentElement.scrollTop;
const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
const scrollFraction = scrollTop / maxScroll;
currentFrame = Math.min(frameCount-1, Math.floor(scrollFraction * frameCount));
drawFrame(currentFrame);
});

images[0].onload = ()=> drawFrame(0);


/* ===== Chat Widget (Gemini 2.5 Flash API) ===== */

const SYSTEM_PROMPT = `
You are a resume assistant AI.
STRICT RULES:
1. Answer ONLY using the resume content below.
2. Do NOT add new information.
3. Do NOT assume.
4. Do NOT generalize.
5. If question is outside resume, reply:
   "This information is not available in the resume."

RESUME DATA:
Name: D. Kumudha
Field: Electronics & Communication Engineering
College: Government College of Engineering, Tirunelveli
Year: 3rd Year
CGPA: 7.56
10th: 100%
12th: 86%
School: Government Girls Higher Secondary School, Acharapakkam
Projects:
- Smart Door System
- Automated Railway Crossing System
Skills:
- Core ECE Knowledge
- Embedded Systems
- Basic Programming
- Hardware Projects
- Automation Concepts
- Communication Skills
- Problem Solving
Career Objective:
Motivated ECE student aiming to build a strong career in embedded systems and software-driven technologies, seeking opportunities in internships, core engineering roles, and tech-driven organizations.
`;

const API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";  // 🔴 add your Gemini key
const MODEL = "models/gemini-2.5-flash";

async function sendMessage(){
const input = document.getElementById("userInput");
const msg = input.value.trim();
if(!msg) return;

addMessage("You", msg);
input.value="";

const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${API_KEY}`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[{
role:"user",
parts:[{text: SYSTEM_PROMPT + "\n\nUser Question: " + msg}]
}]
})
});

const data = await response.json();
let reply = "No response";
try{
reply = data.candidates[0].content.parts[0].text;
}catch(e){
reply = "Error getting response";
}

addMessage("AI", reply);
}

function addMessage(sender,text){
const chatBody = document.getElementById("chatBody");
const msgDiv = document.createElement("div");
msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
msgDiv.style.marginBottom="8px";
chatBody.appendChild(msgDiv);
chatBody.scrollTop = chatBody.scrollHeight;
}
