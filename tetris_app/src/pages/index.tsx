import Head from 'next/head';
import Link from 'next/link';
export default function Home() {
  return (
    <>
      <Head>
        <title>신호의 게임</title>
        <meta name="description" content="게임 by next js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tetris.png" />
      </Head>
      <main>
        <Link href="/tetris">tetris</Link>
      </main>
    </>
  );
}
