let boxes = document.querySelectorAll('.box');
let resetBtn = document.querySelector('.reset-btn');
let newgameBtn = document.querySelector('#new-btn');
let msgcontainer = document.querySelector('.msg-container');
let message = document.querySelector('#message');

let turn0 = true; // player X , player O


const winCombos = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];
const resetgame =() =>{
    turn0 =true;
    enableBoxes();
    msgcontainer.classList.add("hide");
}

boxes.forEach((box )=> {
    box.addEventListener('click', () => {
        if(turn0){// player x
            box.innerText = "X";
            box.style.color = "red";
            turn0 = false;
        }else{// player o
            box.innerText = "O";
            box.style.color = "blue";
            turn0 = true;
        }

        box.disabled = true;
        checkwinner();
    });
});
const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        
        box.innerText="";
        
    }
};
const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
        box.innerText
    }
};

const showwinner = (winner) => {
    message.innerText = `congratulations,winner is ${winner} `;
    msgcontainer.classList.remove("hide");
        disableBoxes();

}

 const checkwinner = () => {
    for(let pattern of winCombos){
        let posval1 = boxes[pattern[0]].innerText;
        let posval2 = boxes[pattern[1]].innerText;
        let posval3 = boxes[pattern[2]].innerText;


        if(posval1 !=""&& posval2!=""&& posval3!=""){
            if(posval1 == posval2 && posval2 == posval3){
            
                showwinner(posval1);

    }
        }
    }
};
newgameBtn.addEventListener("click",resetgame);
resetBtn.addEventListener("click",resetgame);