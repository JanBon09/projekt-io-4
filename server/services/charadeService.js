
let answers = ["cat", "dog", "house"]


export function generateRandomAnswer(){
    return answers[Math.floor(Math.random() * answers.length)];
}

export function isCorrectAnswer(room, userAnswer){
    return userAnswer === room.currentAnswer;
}

