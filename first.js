const text = ["Web Developer 💻", "Frontend Designer 🎨", "JavaScript Lover ⚡"];
let i = 0, j = 0;
let current = "";
let isDeleting = false;

function type() {
    current = text[i];

    if (isDeleting) {
        j--;
    } else {
        j++;
    }

    document.getElementById("typing").innerText = current.substring(0, j);

    if (!isDeleting && j === current.length) {
        isDeleting = true;
        setTimeout(type, 1000);
        return;
    }

    if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % text.length;
    }

    setTimeout(type, isDeleting ? 50 : 100);
}

type();

/* Button Message */
function showMessage() {
    document.getElementById("msg").innerText = "Thanks for visiting my portfolio! 🚀";
}