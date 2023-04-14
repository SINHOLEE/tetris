import Head from 'next/head';
import Game from '@/feature/tetris/Game';

export default function Home() {
  return (
    <>
      <Head>
        <title>신호의 테트리스</title>
        <meta name="description" content="테트리스 게임 by next js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tetris.png" />
      </Head>
      <main>
        <Game />
      </main>
    </>
  );
}
