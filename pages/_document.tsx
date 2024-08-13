import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='ko'>
      <Head>
        <title>SCHEDO</title>
        <meta property='og:title' content='SCHEDO' />
        <meta
          property='og:description'
          content='SCHEDO에서 모든 일정을 쉽게 관리하세요!'
        />
        <meta property='og:url' content='https://sched6.netlify.app/' />
        <meta property='og:image' content='/og_image.png' />
        <link rel='icon' href='/favicon.png' />
      </Head>
      <body>
        <Main />
        <div id='_modal'></div>
        <div id='_toast'></div>
        <NextScript />
      </body>
    </Html>
  );
}
