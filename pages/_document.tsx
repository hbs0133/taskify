import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='ko'>
      <Head>
        <title>SCHEDO</title>
        <meta property='og:title' content='SCHEDO' />
        <meta
          property='og:description'
          content='스마트하게 나의 일정을 관리해보자!'
        />
        <meta property='og:url' content='https://schedo-7-6.netlify.app/' />
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
