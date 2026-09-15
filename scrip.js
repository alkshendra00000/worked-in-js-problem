let userscore = 0;
let compscore = 0;


const choices= document.querySelectorAll(".choice");

const msg =document.querySelector("#msg");

const userscorepara = document.querySelector("#user-score");
const compscorepara = document.querySelector("#comp-score");




const gencomchoice = () => {
    const options = ["rock","paper","scissors"];
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];

    //rock,peper,scissors
}

const drawGame = () => {
    msg.innerText = "Game was Draw. Play Again.";
    msg.style.backgroundColor = "blue";
}

const showwinner = (userwin,userchoice,comchoice) => {
    if(userwin){
       userscore++;
       userscorepara.innerText = userscore;
        msg.innerText = `You Win! your ${userchoice} beats ${comchoice}`;
        msg.style.backgroundColor = "green";
    } else {
        compscore++;
        compscorepara.innerText = compscore;
        msg.innerText = `You lose! ${comchoice} beats your ${userchoice}`;
        msg.style.backgroundColor = "red";
    }
};
const playGame = ( userchoice) =>{ 
    //generate computer choice;
    const compchoice = gencomchoice ();
    if(userchoice === compchoice){
        //draw game 
        drawGame();
    }else{
         let userwin = true ;
         if(userchoice === "rock"){
            //scissor,paper
            userwin = compchoice === "paper" ? false:true;
          } else if(userchoice === "paper"){
                //rock,scissors
              userwin = compchoice === "scissors" ? false:true;
            }else{
                //rock,paper
                userwin = compchoice === "rock" ? false : true ;

            }
            showwinner(userwin,userchoice,compchoice);
    }

};

choices.forEach((choice)=>{
    
    choice.addEventListener("click", () =>{
        const userchoice = choice.getAttribute("id");
        playGame(userchoice);

    });

});
