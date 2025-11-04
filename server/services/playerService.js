export function AddPoints(player){
    player.points += 10;
    player.roundPoints = player.points;
}

function CreatePlayer(socket){
    return new Player(socket.nickname, 0);
}

export default CreatePlayer;