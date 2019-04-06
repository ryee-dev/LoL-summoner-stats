import React from 'react';
// import axios from ';
// import useFetch from 'fetch-suspense';
// import axios from ';
import MatchCard from './MatchCard';

interface MatchListProps {
  summonerName: string;
  data: any;
}

const MatchList: React.FC<MatchListProps> = (props: MatchListProps) => {
  const { summonerName, data } = props;
  // let summData;

  // axios.get('http://localhost:3001/api/summoner').then(res => {
  //   console.log(res.data);
  //   const { data } = res;
  // });

  // const data = useFetch('http://localhost:3001/api/summoner', {
  //   method: 'GET',
  // });
  // console.log(summData);
  // let matchList = data.data;

  return (
    <>
      <h1>{summonerName}</h1>

      {// @ts-ignore
      data.map((match: any) => (
        <MatchCard
          key={match.gameId}
          win={match.outcome}
          gameDuration={match.gameDuration}
          summonerName={match.summonerName}
          summAId={match.spell1Id}
          summBId={match.spell2Id}
          keystone={match.runes.keystone}
          primaryRune1={match.runes.primaryRune1}
          primaryRune2={match.runes.primaryRune2}
          primaryRune3={match.runes.primaryRune3}
          secondaryRune1={match.runes.secondaryRune1}
          secondaryRune2={match.runes.secondaryRune2}
          championId={match.championId}
          kills={match.kills}
          deaths={match.deaths}
          assists={match.assists}
          kda={match.kda}
          item0={match.items.item0}
          item1={match.items.item1}
          item2={match.items.item2}
          item3={match.items.item3}
          item4={match.items.item4}
          item5={match.items.item5}
          item6={match.items.item6}
          champLevel={match.championLevel}
          totalMinionsKilled={match.creepScore.totalMinionsKilled}
          neutralMinionsKilled={match.creepScore.neutralMinionsKilled}
          neutralMinionsKilledTeamJungle={
            match.creepScore.neutralMinionsKilledTeamJungle
          }
          neutralMinionsKilledEnemyJungle={
            match.creepScore.neutralMinionsKilledEnemyJungle
          }
        />
      ))}
    </>
  );
};

export default MatchList;
