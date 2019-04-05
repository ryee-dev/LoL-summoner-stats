import React, { Suspense, useState } from 'react';
import styled from 'styled-components';
import { SummonerForm, MatchList } from './components';

const App = () => {
  const [modalStatus, setModalStatus] = useState(null);
  const [summName, setSummName] = useState('');
  // @ts-ignore
  return (
    <AppShell>
      <FloatingContainer>
        <SummonerForm
          summName={summName}
          setSummName={setSummName}
          setModalStatus={setModalStatus}

          // setStats={setStats}
          // data={data}
        />
        <br />
      </FloatingContainer>

      {modalStatus && (
        <ModalWrapper>
          <ResultsModal>
            <ListWrapper>
              <Suspense
                fallback={
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                    }}
                  >
                    <h1 style={{ color: 'white' }}>loading...</h1>
                  </div>
                }
              >
                <MatchList summonerName={summName} />
              </Suspense>
            </ListWrapper>
          </ResultsModal>
        </ModalWrapper>
      )}
    </AppShell>
  );
};

export default App;

const AppShell = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #06080b;
  overflow: scroll;
`;

const FloatingContainer = styled.div`
  height: 100%;
  background-color: #151a27;
  border-radius: 4px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  //padding: 4rem 0;
  overflow: scroll;

  h1 {
    color: white;
  }

  .data-wrapper {
    position: absolute;
    color: white;
    margin: 2rem 0;
    overflow: scroll;
  }
`;

const ModalWrapper = styled.div`
  position: absolute;
  width: 80%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: scroll;
`;

const ResultsModal = styled.div`
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  //padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;

  button {
    position: fixed;
    top: 10px;
    right: 10px;
  }
`;

const ListWrapper = styled.div`
  //height: 50%;
  position: absolute;
  padding: 0 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  background-color: aliceblue;
  overflow: scroll;

  p {
    font-size: 0.6rem;
  }
`;
