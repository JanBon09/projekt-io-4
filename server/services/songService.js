import { title } from "process";

const songs = [
    { title: "Bohemian Rhapsody", artist:"Queen", clue: "Mama, just killed a man...",  country: "US"},
    { title: "Shape of You", artist:"Ed Sheeran", clue: "The club isn't the best place to find a lover...",  country: "US" },
    { title: "Billie Jean", artist:"Micheal Jackson", clue: "She was more like a beauty queen from a movie scene...",  country: "US" },
    { title: "Szklana Pogoda", artist: "Lombard", clue: "Szyby niebieskie od telewizorów...", country: "PL" },
    { title: "Parostatek", artist:"Krzysztof Krawczyk", clue: "Parostatkiem w piękny rejs...", country: "PL" },
    { title: "Fear of the Dark", artist: "Iron Maiden", clue: "I have a constant fear that something's always near..."},
    { title: 'Slow Burner', artist: "Interplanetary Criminal", clue: "Brak wskazówki"},
    { title: "Blinding Lights", artist:"The Weeknd", clue: "I said, ooh, I'm blinded by the lights...",  country: "US"},
    { title: "Levitating", artist:"Dua Lipa", clue: "You want me, I want you, baby...",  country: "US" },
    { title: "Rolling in the Deep", artist:"Adele", clue: "We could have had it all...",  country: "US" },
    { title: "Dancing Queen", artist: "ABBA", clue: "You can dance, you can jive...", country: "SE" },
    { title: "Hotel California", artist:"Eagles", clue: "You can check out any time you like, but you can never leave...", country: "US" },
    {title: "Take On Me", artist: "a-ha", clue: "I'll be gone in a day or two..."},
    {title: "Bad Guy", artist: "Billie Eilish", clue: "So you're a tough guy..."},
    {title: "The Sound of Silence", artist: "Simon & Garfunkel", clue: "In the shadows of the night..."},
    {title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", clue: "Don't believe me just watch..."},
    {title: "Co mi panie dasz", artist:"Bajm", clue: "Kilka starych szmat..", country: "PL" },
    {title: "Smells Like Teen Spirit", artist: "Nirvana", clue: "With the lights out, it's less dangerous..."},
    {title: "Imagine", artist: "John Lennon", clue: "You may say I'm a dreamer..."},
    {title: "Thriller", artist: "Michael Jackson", clue: "Cause this is thriller, thriller night..."},
    {title: "Faint", artist: "Linkin Park", clue: "I am a little bit of loneliness..."},
    {title: "Get Ready", artist: "2 Unlimited", clue: "Get ready for this..."},
    {title: "We Found Love", artist: "Rihanna ft. Calvin Harris", clue: "We found love in a hopeless place..."},
    {title: "Poker Face", artist: "Lady Gaga", clue: "Can't read my, can't read my..."},
    {title: "Memories", artist: "Calvin Harris Kid Cudi", clue: "I just wanna let it go for the night..."},
    {title: "Addicted to You", artist: "Avicii", clue: "Lost in your eyes, driving in blue..."},
    {title: "Wake Me Up", artist: "Avicii", clue: "So..."},
    {title: "Like A G6", artist: "Far East Movement", clue: "When sober girls around me, they be actin' like they drunk..."},
    {title: "GDFR", artist: "Flo Rida ft. Sage The Gemini & Lookas", clue: "Can you take me to the dance floor..."},
    {title: "International Love", artist: "Pitbull ft. Chris Brown", clue: "Blow the whistle, baby, you the referee, dale..."},
    {title: "Danza Kuduro", artist: "Don Omar ft. Lucenzo", clue: "La mano arriba, cintura sola..."},
    {title: "How Deep Is Your Love", artist: "Calvin Harris & Disciples", clue: "I want you to breathe me in..."},
    {title: "Black and Yellow", artist: "Wiz Khalifa", clue: "Yeah, uh huh, you know what it is..."},
    {title: "We Own It", artist: "2 Chainz & Wiz Khalifa", clue: "One shot, everything rides on tonight..."},
    {title: "Timber", artist: "Pitbull ft. Kesha", clue: "It's going down..."},
    {title: "On The Floor", artist: "Jennifer Lopez ft. Pitbull", clue: "Dance the night away..."},
    {title: "Hipnotize", artist: "Notorious B.I.G.", clue: "Biggie Biggie Biggie can't you see..."},
    {title: "California Love", artist: "2Pac ft. Dr. Dre", clue: "California knows how to party..."},
    {title: "In Da Club", artist: "50 Cent", clue: "Go shawty, it's your birthday..."},
    {title: "Just A Lil Bit", artist: "50 Cent", clue: "Give me just a little bit..."},
    {title: "Butterfly", artist: "Crazy Town", clue: "Come my lady..."},
    {title: "Flashing Lights", artist: "Kanye West ft. Dwele", clue: "As I recall, I know you love to show off..."},
    {title: "Low", artist: "Flo Rida ft. T-Pain", clue: "Shawty had them Apple Bottom Jeans..."},
    {title: "Regulate", artist: "Warren G ft. Nate Dogg", clue: "It was a clear black night..."},
    {title: "The Real Slim Shady", artist: "Eminem", clue: "I'm a real slim shady..."},
    {title: "Lose Yourself", artist: "Eminem", clue: "Mom spaghetti..."},
    {title: "It Was A Good Day", artist: "Ice Cube", clue: "Just waking up in the morning..."},
    {title: "All Eyez On Me", artist: "2Pac", clue: "Until I die, live the life of a boss player, 'cause even when I'm high..."},
    {title: "Act A Fool", artist: "Ludacris", clue: "2 Fast 2 furious..."},
    {title: "Remember The Name", artist: "Fort Minor Styles Of Beyond", clue: "This is ten percent luck, twenty percent skill..."},
    {title: "The Next Episode", artist: "Dr. Dre ft. Snoop Dogg", clue: "Smoke weed every day..."},
    {title: "Staright Outta Compton", artist: "N.W.A", clue: "AK-47 is the tool\nDon't make me act a motherfucking fool..."},
    {title: "Gold Digger", artist: "Kanye West ft. Jamie Foxx", clue: "I ain't sayin' she a..."},
    {title: "Where The Hood At", artist: "DMX", clue: "D to the M to the X..."},
    {title: "Everyday", artist: "A$AP Rocky ft. Rod Stewart, Miguel, Mark Ronson", clue: "I spend my time drinking wine..."},
    {title: "4Minutes", artist: "Madonna ft. Justin Timberlake & Timbaland", clue: "Time is running out..."},
    {title: "Stronger", artist: "Kanye West", clue: "That that don't kill me..."},
    {title: "Get Low", artist: "Lil Jon & The East Side Boyz ft. Ying Yang Twins", clue: "To the window, to the wall..."},
    {title: "Return To The Tres", artist: "Delinquent Habits", clue: "..."},
    {title: "Wake Up In The Sky", artist: "Gucci Mane, Bruno Mars, Kodak Black", clue: "I drink 'til I'm drunk, smoke til I'm high..."},
    {title: "November Rain", artist: "Guns N' Roses", clue: "Nothing lasts forever..."},
    {title: "In The End", artist: "Linkin Park", clue: "I tried so hard and got so far..."},
    {title: "Zombie", artist: "The Cranberries", clue: "With their tanks and their bombs..."},
    {title: "Thunderstruck", artist: "AC/DC", clue: "Rode down the highway\nBroke the limit, we hit the ton..."},
    {title: "Bring Me To Life", artist: "Evanescence", clue: "Wake me up inside..."},
    {title: "Nothing Else Matters", artist: "Metallica", clue: "So close, no matter how far..."},
    {title: "Every Breathe You Take", artist: "The Police", clue: "Oh, can't you see\nYou belong to me?..."},
    {title: "Losing My Religion", artist: "R.E.M.", clue: "That's me in the corner..."},
    {title: "The Final Countdown", artist: "Europe", clue: "We're leaving together\nBut Still iťs farewell..."},
    {title: "Eye of the tiger", artist: "Survivor", clue: "Rising up, back on the street..."},
    {title: "Californication", artist: "Red Hot Chili Peppers", clue: "Destruction leads to a very rough road..."},
    {title: "Demons", artist: "Imagine Dragons", clue: "Don't get too close, It's where my..."},
    {title: "Radioactive", artist: "Imagine Dragons", clue: "I'm waking up to ash and dust..."},
    {title: "Africa", artist: "Toto", clue: "I bless the rains down in..."},
    {title: "Back In Black", artist: "AC/DC", clue: "I hit the sack..."},
    {title: "Your Love", artist: "The Outfield", clue: "Josie's on a vacation far away..."},
    {title: "Paradise City", artist: "Guns N' Roses", clue: "Take me down..."},
    {title: "Seven Nation Army", artist: "The White Stripes", clue: "I'm gonna fight 'em all..."},
    {title: "Enter Sandman", artist: "Metallica", clue: "Exit light..."},
    {title: "Girlfriend", artist: "Avril Lavigne", clue: "Hey hey you you..."},
    {title: "Highway to Hell", artist: "AC/DC", clue: "Living easy..."},
    {title: "Come As You Are", artist: "Nirvana", clue: "As I want you to be\nAs a friend, as a friend..."},
    {title: "Welcome To The Jungle", artist: "Guns N' Roses", clue: "We got fun and games..."},
    {title: "We Will Rock You", artist: "Queen", clue: "Buddy you're a boy make a big noise..."},
    {title: "Another Day In Paradise", artist: "Phil Collins", clue: "She calls out to the man on the street..."},
    {title: "How You Remind Me", artist: "Nickelback", clue: "It's not like you to say sorry..."},
    {title: "Scar Tissue", artist: "Red Hot Chili Peppers", clue: "With the birds I'll share this lonely view..."},
    {title: "All Star", artist: "Smash Mouth", clue: "Somebody once told me..."},
    {title: "Zanim pójdę", artist:"Happysad", clue: "Miłośc to nie pluszowy miś...", country: "PL" },
    {title: "Urke", artist:"Wilki", clue:"Pijemy za lepszy czas...", country: "PL" },
    {title: "Wszystko Jedno", artist:"Video", clue:"Jeśli to ostatni w życiu dzień...", country: "PL" },
    {title: "Środa Czwartek", artist:"Video", clue:"Światło zgaś, zamknij drzwi...", country: "PL" },
    {title: "Kryzysowa Narzeczona", artist:"Lady Pank", clue:"Wesołych świąt...", country: "PL" },
    {title: "Dzieci wybiegły", artist:"Elektryczne gitary", clue:"Wszyscy mamy źle w głowach że żyjemy...", country: "PL" },
    {title: "Byłaś Dla mnie wszystkim", artist:"Poparzeni Kawą Trzy", clue:"Prezentem od losu...", country: "PL" }
];

// Funkcja mieszająca (Fisher-Yates Shuffle)
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Generuje nową, przemieszaną kopię listy dla pokoju
export function getShuffledPlaylist() {
    return shuffle([...songs]);
}

export async function getSongDataFromObject(songObj) {
    const BASE_URL = "https://itunes.apple.com/search?";
    const searchParams = new URLSearchParams({
        "term": `${songObj.title} ${songObj.artist}`,
        "country": songObj.country ? songObj.country : "US",
        "media": "music",
        "entity": "song"
    });

    try {
        const result = await fetch(`${BASE_URL}${searchParams}`, { method: "GET" });
        if(result.ok){
            const data = await result.json();
            let songUrl = "";
            let albumCover = "";
            let albumName = "";
            let releaseYear = "";
            let artistName = songObj.artist;

            if(data.results.length > 0){
                const track = data.results[0];
                songUrl = track.previewUrl;
                albumCover = track.artworkUrl100.replace("100x100bb", "600x600bb");
                albumName = track.collectionName;
                artistName = track.artistName;
                releaseYear = track.releaseDate ? track.releaseDate.substring(0, 4) : "";
            }

            return({
                title: songObj.title,
                artist: artistName,
                album: albumName,
                year: releaseYear,
                clue: songObj.clue,
                songUrl: songUrl,
                albumCover: albumCover
            });
        }
    } catch (e) {
        console.error("iTunes API error:", e);
    }
    return null;
}