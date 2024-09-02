const fs = require('fs');

const groups = JSON.parse(fs.readFileSync('groups.json'));

for(let group in groups) {

    groups[group].forEach(team => {
        team.points = 0;
        team.wins = 0;
        team.loses = 0;
        team.scored = 0;
        team.conceded = 0;
        team.scoreDifference = 0;
    })

    // console.log(`\nGrupa ${group}: `);
    // groups[group].forEach(team => {
    //     console.log(`   ${team.Team}`);
    // });
}

function simulateScore(rank) {
    let rankInfluense = 100 - rank;
    return Math.floor(rankInfluense * Math.random());
}

function simulateMatch(team1, team2) {
    let score1 = simulateScore(team1.FIBARanking);
    let score2 = simulateScore(team2.FIBARanking);

    
    team1.scored += score1;
    team1.conceded += score2;
    team1.scoreDifference += (score1 - score2);
    team2.scored += score2;
    team2. conceded += score1;
    team2.scoreDifference += (score2 - score1);

    if(score1 > score2) {
        team1.points += 2;
        team1.wins++;
        team2.points += 1;
        team2.loses++;
        return {winner: team1, loser: team2, score1, score2};
    } else if(score1 < score2) {
        team1.points += 1;
        team1.loses++;
        team2.points += 2;
        team2.wins++;
        return {winner: team2, loser: team1, score1, score2};
    } else {
        team1.points += 0;
        team2.points += 0;
        return {draw: true, score1, score2};
    }
}

console.log("\nRezultati grupne faze: ")
for(let group in groups) {
    console.log(`Grupa ${group}: `)
    let teams = groups[group];
    for(let i = 0; i < teams.length; i++) {
        for(let j = i + 1; j < teams.length; j++) {
            let team1 = teams[i];
            let team2 = teams[j];

            const match = simulateMatch(team1, team2);

            console.log(` ${team1.Team} vs ${team2.Team} - (${match.score1} : ${match.score2})`)
        }
    }
}

function groupRanking(group) {
    return group.sort((team1, team2) => team2.points - team1.points || team2.pointDifference - team1.pointDifference);
}

for(let group in groups) {
    let teams = groups[group];
    groupRanking(teams);
}

console.log("\nKonačan plasman po grupama:")
for(let group in groups) {
    console.log(`Grupa ${group}:`)
    let teams = groups[group]
    teams.forEach((team, index) => {  
        console.log(` ${index + 1 }. ${team.Team.padEnd(20)} ${team.wins} / ${team.loses} / ${team.points} / ${team.scored} / ${team.conceded} / ${team.scoreDifference}`)
    })
}

let rankedTeams = [];
for (let group in groups) {
    let teams = groups[group];
    rankedTeams = rankedTeams.concat(teams);
}

rankedTeams.sort((team1, team2) => team2.points - team1.points || team2.scoreDifference - team1.scoreDifference);

function simulatePots(rankedTeams) {
    let pots = {
        D: [rankedTeams[0], rankedTeams[1]],
        E: [rankedTeams[2], rankedTeams[3]],
        F: [rankedTeams[4], rankedTeams[5]],
        G: [rankedTeams[6], rankedTeams[7]],
    };

    for (let pot in pots) {
        console.log(`\nŠešir ${pot}:`);
        pots[pot].forEach(team => console.log(`  ${team.Team}`));
    }


    //Ispod sam trazio pomoc chatGPT-a
    
    let quarterFinalTeams = [];
    quarterFinalTeams = quarterFinalTeams.concat(
        drawAndMatch(pots.D.concat(pots.G), "Četvrtfinale"),
        drawAndMatch(pots.E.concat(pots.F), "Četvrtfinale")
    );

    return quarterFinalTeams;
}

function drawAndMatch(teams, stage) {
    let matches = [];
    while (teams.length > 0) {
        let team1 = teams.splice(Math.floor(Math.random() * teams.length), 1)[0];
        let team2 = teams.splice(Math.floor(Math.random() * teams.length), 1)[0];
        matches.push(simulateMatch(team1, team2));
    }

    console.log(`\n${stage}:`);
    matches.forEach((match) => {
        console.log(` ${match.winner.Team} vs ${match.loser.Team} - (${match.score1} : ${match.score2})`);
    });

    return matches.map(match => match.winner);
}

let semiFinalTeams = simulatePots(rankedTeams);

let finalists = drawAndMatch(semiFinalTeams, "Polufinale");

let thirdPlaceMatch = simulateMatch(finalists[0], finalists[1]);
console.log(`\nUtakmica za treće mesto: ${thirdPlaceMatch.winner.Team} vs ${thirdPlaceMatch.loser.Team} - (${thirdPlaceMatch.score1} : ${thirdPlaceMatch.score2})`);

let finalMatch = simulateMatch(finalists[0], finalists[1]);
console.log(`\nFinale: ${finalMatch.winner.Team} vs ${finalMatch.loser.Team} - (${finalMatch.score1} : ${finalMatch.score2})`);

console.log("\nMedalje:");
console.log(` 1. ${finalMatch.winner.Team}`);
console.log(` 2. ${finalMatch.loser.Team}`);
console.log(` 3. ${thirdPlaceMatch.winner.Team}`);