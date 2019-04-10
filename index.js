require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

let summonerName;

app.post('/api/summoner', (req, res) => {
  summonerName = req.body.summName;
  res.status(204).send();
});

const searchSummoner = async () => {
  let accountId;
  let matchHistory;
  let matchStats;
  let playerMatchStatsList = [];
  let matchIdList = [];
  let matchData;

  if (summonerName !== undefined) {
    let fetchAccountId = await axios.get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${
        process.env.API_KEY
      }`
    );

    accountId = fetchAccountId.data.accountId;

    let fetchMatchHistory = await axios.get(
      `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${
        process.env.API_KEY
      }`
    );
    matchHistory = fetchMatchHistory.data.matches;

    for (let i = 0; i < matchHistory.length; i++) {
      matchIdList.push(matchHistory[i].gameId);
    }

    for (let i = 0; i < 10; i++) {
      matchData = await axios.get(
        `https://na1.api.riotgames.com/lol/match/v4/matches/${
          matchIdList[i]
        }?api_key=${process.env.API_KEY}`
      );

      for (let i = 0; i < matchData.data.participants.length; i++) {
        if (
          fetchAccountId.data.name ===
            matchData.data.participantIdentities[i].player.summonerName &&
          matchData.data.participantIdentities[i].participantId ===
            matchData.data.participants[i].participantId
        ) {
          matchStats = {
            gameId: matchData.data.gameId,
            gameMode: matchData.data.gameMode,
            outcome: matchData.data.participants[i].stats.win,
            gameDuration: matchData.data.gameDuration,
            summonerName: summonerName,
            spell1Id: matchData.data.participants[i].spell1Id,
            spell2Id: matchData.data.participants[i].spell2Id,
            runes: {
              keystone: matchData.data.participants[i].stats.perk0,
              primaryRune1: matchData.data.participants[i].stats.perk1,
              primaryRune2: matchData.data.participants[i].stats.perk2,
              primaryRune3: matchData.data.participants[i].stats.perk3,
              secondaryRune1: matchData.data.participants[i].stats.perk4,
              secondaryRune2: matchData.data.participants[i].stats.perk5,
            },
            championId: matchData.data.participants[i].championId,
            kills: matchData.data.participants[i].stats.kills,
            deaths: matchData.data.participants[i].stats.deaths,
            assists: matchData.data.participants[i].stats.assists,
            kda: (
              (matchData.data.participants[i].stats.kills +
                matchData.data.participants[i].stats.assists) /
              matchData.data.participants[i].stats.deaths
            ).toFixed(2),
            items: {
              item0: matchData.data.participants[i].stats.item0,
              item1: matchData.data.participants[i].stats.item1,
              item2: matchData.data.participants[i].stats.item2,
              item3: matchData.data.participants[i].stats.item3,
              item4: matchData.data.participants[i].stats.item4,
              item5: matchData.data.participants[i].stats.item5,
              item6: matchData.data.participants[i].stats.item6,
            },
            championLevel: matchData.data.participants[i].stats.champLevel,
            creepScore: {
              totalMinionsKilled:
                matchData.data.participants[i].stats.totalMinionsKilled,
              neutralMinionsKilled:
                matchData.data.participants[i].stats.neutralMinionsKilled,
              neutralMinionsKilledTeamJungle:
                matchData.data.participants[i].stats
                  .neutralMinionsKilledTeamJungle,
              neutralMinionsKilledEnemyJungle:
                matchData.data.participants[i].stats
                  .neutralMinionsKilledEnemyJungle,
            },
          };

          playerMatchStatsList.push(matchStats);
        }
      }
    }
    return playerMatchStatsList;
  } else {
    console.log('error');
  }
};

let output;

app.get('/api/summoner', async (req, res) => {
  if (summonerName !== undefined) {
    await searchSummoner().then(res => {
      output = res;
    });
    res.json(output);
  }
});

let summItemData;
fs.readFile('./static/item.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  summItemData = JSON.parse(data);
});

// serve champion.json
let summChampiondata;
let decodedChampion;
let championKeyList = [];
let championNameList = [];

fs.readFile('./static/champion.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  summChampiondata = JSON.parse(data);
  const entries = Object.entries(summChampiondata.data);
  for (const [champion, values] of entries) {
    championKeyList.push(values.key);
    championNameList.push(champion);

    decodedChampion = {
      championNames: championNameList,
      championKeys: championKeyList,
    };
  }
});

// serve item.json
let decodedItem;
let itemKeyList = [];
let itemNameList = [];

fs.readFile('./static/item.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  let summItemData = JSON.parse(data);
  const entries = Object.entries(summItemData.data);
  for (const [item, values] of entries) {
    itemKeyList.push(item);
    itemNameList.push(values.name);

    decodedItem = {
      itemNames: itemNameList,
      itemKeys: itemKeyList,
    };
  }
});

// serve summoner spells
let summSpellData;
let decodedSpell;
let spellKeyList = [];
let spellNameList = [];
let spellIdList = [];

fs.readFile('./static/summoner.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }

  summSpellData = JSON.parse(data);
  const entries = Object.entries(summSpellData.data);
  for (const [spell, values] of entries) {
    spellKeyList.push(values.key);
    spellNameList.push(values.name);
    spellIdList.push(values.id);

    decodedSpell = {
      spellNames: spellNameList,
      spellKeys: spellKeyList,
      spellIds: spellIdList
    };
  }
});

// serve summoner runes
let summKeystoneData;
let decodedKeystone;
let decodedRunesReforged = {
  runeNameList: [],
  runeIdList: [],
};

fs.readFile('./static/runesReforged.json', 'utf8', (err, data) => {
  if (err) {
    throw err;
  }
  summKeystoneData = JSON.parse(data);
  const keystoneEntries = Object.entries(summKeystoneData);
  for (const [keystone, values] of keystoneEntries) {
    decodedRunesReforged.runeNameList.push(values.name);
    decodedRunesReforged.runeIdList.push(values.id);

    for (let i = 0; i < values.slots.length; i++) {
      for (let j = 0; j < values.slots[i].runes.length; j++) {
        decodedRunesReforged.runeNameList.push(values.slots[i].runes[j].name);
        decodedRunesReforged.runeIdList.push(values.slots[i].runes[j].id);
      }
    }
  }

  // console.log(decodedRunesReforged.keystone.runes);
});

app.get('/static/champions', async (req, res) => {
  res.json(decodedChampion);
});

app.get('/static/items', async (req, res) => {
  res.json(decodedItem);
});

app.get('/static/spells', async (req, res) => {
  res.json(decodedSpell);
});

app.get('/static/keystones', async (req, res) => {
  res.json(decodedKeystone);
});

app.get('/static/runes', async (req, res) => {
  res.json(decodedRunesReforged);
});

// fetch static data
app.use('/static', express.static(path.join(__dirname, 'static')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendfile(path.join((__dirname = 'client/build/index.html')));
  });
}

// catchall
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
});

app.listen(port, (req, res) => {
  console.log(`server listening on port ${port}`);
});
