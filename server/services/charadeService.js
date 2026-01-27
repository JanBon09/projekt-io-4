
let answers = ["pies", "kot", "lampa", "żyrafa", "balon", "parasol", "kaskader", "pirat", "samochód", "motocykl", "samolot", "czołg", "morderca", "pistolet", "superman", "dom", "latarka", "pająk", "statek", "morze", "góry",
   "sztaluga", "kosmita", "wilkołak", "zombie", "podanie o prace", "piła łańcuchowa", "matematyka", "salon gier", "słoń", "bałwan", "małpa", "mario", "brachiozaur", "jabłko", "truskawka", "wiśnia", "porzeczka"
]

export function generateRandomAnswer(){
    return answers[Math.floor(Math.random() * answers.length)];
}


export function normalizeAnswer(msg){

    let letterMap = new Map(
        [
            ['ą', 'a'],
            ['ę', 'e'],
            ['ł', 'l'],
            ['ć', 'c'],
            ['ś', 's'],
            ['ź', 'z'],
            ['ż', 'z'],
            ['ó', 'o'],
            ['ń', 'n']
        ]
    )

    let normalizedMsg = "";

    for (const letter of msg) {
       let l = letter;
        if(letterMap.has(l)){
            l = letterMap.get(l);
        }
        normalizedMsg += l;
    }

    return normalizedMsg;
}