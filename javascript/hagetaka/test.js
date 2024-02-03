const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// // プレイヤー数を尋ねる
// let playerCount = prompt('プレイヤー数を入力してください');
// // プレイヤー数が1以下の場合、再度入力を求める
// while (playerCount <= 1) {
//     playerCount = prompt('プレイヤー数を入力してください');
// }

// プレイヤー数が2以上の場合、ゲームを開始する
// >>>
// 今回の対戦の初期値を格納するオブジェクトを定義
// let gameRecord = {
//     playerCount: playerCount,
//     scoreCards: [
//         [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//     ]
// };
// // プレイヤーの手札と得点を格納するオブジェクトを定義
// for (let i = 0; i < playerCount; i++) {
//     gameRecord[`player${i + 1}`] = {
//         Hand: [
//             [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
//         ],
//         Score: [0]
//     }
// }
// let gameRecord = {
//     default: {
//         playerCount: playerCount,
//         scoreCards: [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//         playerHand: {},
//         playerScore: {}
//     }
// };
// // プレイヤーの手札と得点を格納するオブジェクトを定義
// for (let i = 0; i < playerCount; i++) {
//     gameRecord.playerHand[`player${i + 1}`] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
//     gameRecord.playerScore[`player${i + 1}`] = 0;
// }


// 得点カードを定義
// const scoreCards = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// プレイヤー数を定義
// const playerCount = 2;

let scoreCards = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let playerLeftHand = {
    player1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    player2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
};
let playerSelect = {
    player1: 0,
    player2: 0
};
let playerScore = {
    player1: 0,
    player2: 0
};
const playerCount = 2;

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, ans => resolve(ans)));
}

async function selectHand(scoreCard, player) {
    let playerSelect;
    while (true) {
        playerSelect = await askQuestion(`
        今回の得点は${scoreCard}点です。プレイヤー${player}は手札から出すカードを選んでください。
        手札: ${playerLeftHand[`player${player}`]}
        現在の点数:
            あなた: ${playerScore[`player${player}`]}点
            相手: ${playerScore[`player${player === 1 ? 2 : 1}`]}点
        `);
        if (playerLeftHand[`player${player}`].includes(Number(playerSelect))) {
            // プレイヤーの手札から選択したカードを削除
            playerLeftHand[`player${player}`].splice(playerLeftHand[`player${player}`].indexOf(Number(playerSelect)), 1);
            // プレイヤーの手札をgameRecordに格納
            // gameRecord.playerHand
            break;
        }
    }
    return playerSelect, playerLeftHand;
}
async function oneCycle() {
    // 得点カードを選択
    let scoreCard = scoreCards[Math.floor(Math.random() * scoreCards.length)];
    // 得点カードをscoreCardsから削除
    scoreCards.splice(scoreCards.indexOf(scoreCard), 1);
    // プレイヤーに手札を選択させる関数を定義
    for (let i = 0; i < playerCount; i++) {
        playerSelect[`player${i + 1}`], playerLeftHand[`player${i + 1}`] = await selectHand(scoreCard, i + 1);
    }
    // playerSelectのうち大きい方を選択
    let winner = Math.max(playerSelect.player1, playerSelect.player2);
    let loser = Math.min(playerSelect.player1, playerSelect.player2);
    // 得点遷移を記録
    if (scoreCard > 0) {
            // let winnersScore = playerScore[`player${winner}`][playerScore[`player${winner}`].length - 1] + scoreCard;
            // let losersScore = playerScore[`player${loser}`][playerScore[`player${loser}`].length - 1];
        // playerScore[`player${winner}`].push(winnersScore);
        // playerScore[`player${loser}`].push(losersScore);
        let winnersScore = playerScore[`player${winner}`] + scoreCard;
        let losersScore = playerScore[`player${loser}`];
        playerScore[`player${winner}`] = winnersScore;
        playerScore[`player${loser}`] = losersScore;
    } else {
        // let winnersScore = playerScore[`player${winner}`][playerScore[`player${winner}`].length - 1];
        // let losersScore = playerScore[`player${loser}`][playerScore[`player${loser}`].length - 1] + scoreCard;
        // playerScore[`player${winner}`].push(winnersScore);
        // playerScore[`player${loser}`].push(losersScore);
        let winnersScore = playerScore[`player${winner}`];
        let losersScore = playerScore[`player${loser}`] + scoreCard;
        playerScore[`player${winner}`] = winnersScore;
        playerScore[`player${loser}`] = losersScore;
    }
    let message = `
    得点カード: ${scoreCard}
    プレイヤー1の手札: ${playerLeftHand.player1}
    プレイヤー2の手札: ${playerLeftHand.player2}
    プレイヤー${winner}の勝ちです！
    得点遷移:
        プレイヤー1: ${playerScore.player1[playerScore.player1.length - 2]} -> ${playerScore.player1[playerScore.player1.length - 1]}
        プレイヤー2: ${playerSelect.player2[playerScore.player2.length - 2]} -> ${playerScore.player2[playerScore.player2.length - 1]}
    次のターンへ進む場合はEnterを押してください
    `
    console.log(message);
    // 次のターンへ進む
    await askQuestion('');
}

// ゲームを開始
(async function startGame() {
    for (let i = 0; i < 10; i++) {
        console.log(`ターン${i + 1}`);
        await oneCycle();
    }
    rl.close();
})();

// ゲームの一サイクルの処理を定義
// function oneCycle (turnCount) { // turnCountは0から始まる
//     // このターンの記録用オブジェクトを定義
//     let turnRecord = {
//         turn: turnCount + 1,
//         scoreCard: 0,
//         leftScoreCards: {},
//         playerHand: {},
//         playerScore: {}
//     }; // 最後にgameRecordに格納する
//     // 得点カードからランダムに1枚選択
//     let scoreCard = gameRecord.default.scoreCards[Math.floor(Math.random() * gameRecord.default.scoreCards.length)];
//     // 得点カードのリストから選択したカードを
//     gameRecord.scoreCards.splice(scoreCards.indexOf(scoreCard), 1);
//     // 得点カードと、プレイヤー1の手札を表示
//     console.log(`得点カード: ${scoreCard}`);
//     console.log(`プレイヤー1の手札: ${player1Hand}`);
//     // すべてのプレイヤーに手札を選択させる
//     for (let i = 0; i < playerCount; i++) {
//         selectHand(gameRecord.playerHand[`player${i + 1}`], `プレイヤー${i + 1}`);
//     }

//     // プレイヤーに手札を選択させる関数を定義
//     function selectHand (playerHand, player) {
//         let playerSelect;
//         while (true) {
//             playerSelect = prompt(`${player}の手札を選んでください`);
//             if (playerHand.indexOf(Number(playerSelect)) !== -1) {
//                 // プレイヤーの手札から選択したカードを削除
//                 playerHand.splice(playerHand.indexOf(Number(playerSelect)), 1);
//                 // プレイヤーの手札をgameRecordに格納
//                 gameRecord.playerHand
//                 break;
//             }
//         }
//         return playerSelect;
//     }
//     for (let i = 0; i < 2; i++) {
//         while (true) {
//             player1Select = prompt('プレイヤー1の手札を選んでください');
//             if (player1Hand.indexOf(Number(player1Select)) !== -1) {
//                 // プレイヤー1の手札から選択したカードを削除
//                 player1Hand.splice(player1Hand.indexOf(Number(player1Select)), 1);
//                 // プレイヤー1の手札をgameRecordに格納
//                 gameRecord.playerHand.player1 = player1Select;
//                 break;
//             }
//         }
//     }
//     // プレイヤー2に手札を選択させる
//     let player2Select;
//     while (true) {
//         player2Select = prompt('プレイヤー2の手札を選んでください');
//         if (player2Hand.indexOf(Number(player2Select)) !== -1) {
//             break;
//         }
//     }
//     // プレイヤー2の手札から選択したカードを削除
//     player2Hand.splice(player2Hand.indexOf(Number(player2Select)), 1);
//     // プレイヤー1とプレイヤー2の手札を比較
//     console.log(`得点カード: ${scoreCard}\nプレイヤー1の手札: ${player1Hand}\nプレイヤー2の手札: ${player2Hand}`);
//     // 得点カードが＋の場合
//     if (scoreCard > 0) {
//         //
//     }
// }

