---
title: "메타 데이터를 세팅하여 서비스 검색 엔진 \n최적화 하기"
date: "2023-06-12"
description: "서버사이드 렌더링과 NextSEO를 이용하여 메타 데이터를 설정하는 방법"
tags: ["Next.js", "SEO", "SSR"]
thumbnail: "thumbnail.jpg"
---

## 이슈

---

서비스 기능 개발이 어느 정도 안정화 되고 나니, 마케팅을 위해 검색 엔진을 향상하여 사용자들에게 서비스를 최대한 노출시킬 수 있으면 좋겠다는 의견이 있었다. 특히, 커머스 서비스이므로 유저들의 구매율을 높이기 위해서는 판매자들이 올려둔 상품에 대한 홍보가 적극적으로 필요한 상황이었다.
그래서 검색 엔진 최적화 태스크를 만들고 본격적으로 시작하였다.

검색 엔진에서 유리하기 위해서는 페이지별 알맞은 메타 태그 지정이 필요하다. 또한, URL 공유시 콘텐츠가 표시되는 방식을 관리하기 위해 OpenGraph 설정이 필요하다. 또한, 페이지별 적절한 canonical URL도 지정해야 한다. 우리 서비스의 경우에는 검색 엔진 최적화를 위해 아래 3가지를 메인으로 설정해야 했다.

1. 검색어에 따라 연관된 상품명, 작가명, 상품 설명, 상품 태그를 가진 상품이 상위에 노출될 것
2. 작가가 판매하는 상품 링크를 카카오톡, 트위터 등 SNS에 공유했을 때 적절한 썸네일 및 설명이 뜰 것
   - 창작자들의 경우 트위터 공유가 활발하므로, 트위터 게시글에 픽셀의 링크를 공유했을 때 OG 정보가 나타나야 함
3. 모든 페이지 링크 공유 시, 해당 페이지에 적절한 설명을 가진 메타 데이터를 표시할 것

위 3가지를 충족할 수 있는 부분을 모두 설정하고, 개인적으로는 SEO 점수 80을 넘기면 좋겠다는 목표를 가지고 작업을 시작하였다.

## 검색 엔진 작동 방식

---

우리 서비스는 구글과 네이버의 검색 엔진에 대한 최적화가 필요했다. 특히, 네이버에는 창작자나 일러스트에 관한 블로그나 커뮤니티가 활성되어 있어 필수 요소이다.
검색 엔진이 작동하는 방법은 간단하게 다음과 같다.

1. 사용자로부터 검색어 수집
2. 알고리즘을 사용하여, 검색어와 관련된 웹 페이지 식별하여 순위 매기기
3. 크롤링 봇을 이용하여 웹 사이트를 색인하여 DB에 저장
4. 저장된 색인 데이터를 바탕으로 검색어와 관련된 웹 페이지 반환

그런데 구글과 네이버는 각각 자체 알고리즘과 크롤러를 사용하기 때문에, 중요하다고 생각하는 정보의 기준에 차이가 있다.
구글 크롤러는 검색어에 적합한 콘텐츠, 웹 사이트 내부의 링크 구조, 사용자 경험(로딩 속도, 모바일 호환성) 등을 중요하게 여기기 때문에 사용자 경험 최적화를 신경써야 한다.

반면 네이버 크롤러는 한국을 중심으로 한 검색 엔진이므로, 구글과 달리 한국어 및 한국 콘텐츠에 특화되어 있다. 그래서 적절한 한국어 키워드 제공이 중요하다. 또한, 카테고리와 태그를 적절하게 활용하여 콘텐츠를 분류하고 검색 결과에 노출될 수 있도록 한다.

이러한 기준에 맞추어 설정하기로 한 검색 엔진 최적화 항목은 다음과 같다.

1. 각 페이지 정보에 적합한 `<title>`, `<description>`, og 데이터, 트위터 카드 데이터 설정
   - 국가별 번역된 데이터로 표시 (ex) `/ko`: '탐색', `/en`: 'search', `/ja`: '検索'
   - 탐색에 포함된 페이지는 탐색 키워드, 카테고리, 태그 정보 추가 (ex) '음식 탐색 - 픽셀플러스'
2. 각 페이지 canonicalURL 지정
3. 탐색이 포함된 페이지의 title과 description에 검색 키워드 및 카테고리 포함하기

## canonical(표준) URL이란?

---

SEO 점수를 향상시킬 수 있는 항목 중 가장 기본적인 것이 canonicalURL 설정이었다.

중복되거나 유사한 여러 페이지 중 가장 대표적이라고 간주되는 페이지의 URL로, canonicalURL을 검색 엔진에게 알려주어야 SEO에 유리하다. 동일한 웹페이지가 서로 다른 URL 3개로 검색엔진에 등록되어 있다면, 방문자 수도 3배가 되어야 하는데, 실제 방문자 수는 이보다 낮은 경우가 많다. 그 이유는 3개로 분산된 만큼 중요도도 분산되기 때문에 검색엔진이 웹페이지를 올바르게 인식하기 어렵기 때문이다.

```jsx
https://pxplus.io/library
https://pxplus.io/library?type=package
https://pxplus.io/library?type=groupPurchase
```

위 세 url은 동일한 페이지를 보여주며, 쿼리에 따라 리스트 결과값만 달라지는 형태이다. 따라서 canonicalURL을 `https://pxplus.io/library`로 지정하여 세 url이 결국 동일한 페이지라는 것을 검색엔진에게 알려주어 방문자 수를 통계하면 된다.

1. 검색엔진은 동일 컨텐츠를 가진 여러개의 페이지가 존재할 경우 어떤 것이 본래의 URL 주소인지 알 수 없다.
2. 똑같은 내용이 여러개의 페이지를 가질 경우 중요도가 분산되어 검색엔진에 악영향을 미치기 때문에 Canonical 태그를 사용해야한다.

```jsx
<link rel='canonical' href={canonicalUrl} />
```

## 페이지마다 다른 메타 데이터를 지정하는 방법

---

### 1. 페이지 마다 각각 헤더를 지정하는 방법

컴포넌트 작성하는 곳에 함께 메타 태그 지정 코드를 삽입해야 하기 때문에 메타 태그 수정을 위해서는 각 페이지 코드에 진입하여 일일이 수정해야 하며, 뷰를 위한 코드와 같은 곳에 존재하여 관심사 분리가 되지 않아 유지 보수 및 코드 가독성 측면에서 아쉽다.

모든 페이지에 동일한 메타 태그를 지정한다면 `_document.page.tsx`에 세팅하면 되므로 상관없지만, 각 페이지 콘텐츠에 따라 동적인 값을 설정하기에는 비효율적인 것 같다.

```jsx
// pages/cart.page.tsx
import Head from 'next/head';

const CartPage = () => {
  return (
    <div>
      <Head>
        <title>장바구니 - 픽셀플러스</title>
        <meta name="description" content="Description for the About page" />
				<meta property="og:image" content="..." />
				<link rel="canonical" href="https://pxplus.io/cart" />
      </Head>
      <h1>장바구니</h1>
			...
    </div>
  )
}

export default CartPage;

// pages/alarm.page.tsx
import Head from 'next/head';

const AlarmPage = () => {
  return (
    <div>
      <Head>
        <title>알람 - 픽셀플러스</title>
        <meta name="description" content="Description for the About page" />
				<meta property="og:image" content="..." />
				<link rel="canonical" href="https://pxplus.io/alarm" />
      </Head>
      <h1>알람</h1>
			...
    </div>
  )
}

export default AlarmPage;

...
```

### 2. next-seo 라이브러리를 사용하는 방법 → 최종 선택

next-seo는 페이지마다 다른 메타 태그를 쉽게 관리할 수 있도록 도와주는 라이브러리이다. 따라서 페이지별 다른 메타 데이터를 지정하더라도 뷰 코드와 분리하여 한 곳에서 일괄적으로 관리 가능하다. 또한 트위터 공유시 트위터 ui에 알맞게 카드 형식으로 지정할 수 있는 기능도 활용할 수 있어서 트위터 공유 기능이 있는 현재 서비스에 적합하다고 판단하였다.

```jsx
// next-seo.config.ts
import { DefaultSeoProps } from "next-seo";

import { DEFAULT } from "./lib/config/headerData";
import { getTranslatedMeta } from "./utils/meta";

const meta = {
  title: DEFAULT.title,
  description: DEFAULT.description,
  openGraph: {
    type: "website",
    title: DEFAULT.ogTitle,
    description: DEFAULT.description,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/img/default-open-graph.png`,
        alt: "PIXEL+",
      },
    ],
    siteName: "픽셀플러스",
  },
  twitter: {
    cardType: "summary_large_image",
  },
};

const config: (locale: string) => DefaultSeoProps = (locale: string) =>
  getTranslatedMeta(meta, locale);

export default config;
```

```jsx
// pages/cart/index.page.tsx (각 페이지)
import { GetServerSidePropsContext } from "next";

const CartPage = () => {
  return <>...</>;
};

export const getServerSideProps = async ({
  locale,
}: GetServerSidePropsContext) => {
  return {
    props: {
      seoProps: {
        ...getTranslatedMeta(CART_HEADER, locale),
      },
    },
  };
};

export default CartPage;
```

```jsx
// _app.page.tsx
import Head from "next/head";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import getSeoConfig from "../next-seo.config";

const App = (props) => {
  const { seoProps } = pageProps;
  const { asPath } = useRouter();

  const canonicalUrl = `${frontendDomain}${asPath}`;
  const DEFAULT_SEO = getSeoConfig(locale);

  return (
    <>
      <Head>
        <NextSeo
          {...DEFAULT_SEO}
          {...seoProps}
          canonical={canonicalUrl}
          openGraph={{
            type: "website",
            url: `${canonicalUrl}`,
            ...(seoProps?.openGraph ?? DEFAULT_SEO.openGraph),
          }}
        />
      </Head>
    </>
  );
};
export default App;
```

## 적용 확인 방법

---

최종적으로 각 페이지의 getServerSideProps로 필요한 메타 태그값을 리턴하면, `_app.page.tsx`에서 pageProps에 포함된 seoProps 값을 받아서 `<NextSeo/>`로 전달하여 메타 태그를 지정한다. pageProps로 넘어온 props 값이 있으면 해당 데이터로 값을 지정하고, 없다면 디폴트 값으로 값을 지정한다.

우리는 번역도 고려해야 했기 때문에, `getTranslatedMeta`라는 유틸 함수를 만들어 한 번 더 래핑하여 사용했다. OG 데이터 같은 경우는 배포된 상태에서 url을 붙여넣기 했을 때 이미지가 올바르게 뜨는지 확인할 수 있는데, 테스트 환경에서도 데이터가 잘 적용되었는지 확인하려면 다음과 같이 확인하면 된다.

![서버 사이드 메타 데이터 적용 확인 방법](/images/posts/seo_improve/docs.png)

네트워크 탭에 들어가서 해당 페이지를 소스를 불러온 파일을 들어가보면, response 탭에서 에서 문서의 메타 데이터를 확인할 수 있다. OG 데이터와 관련된 태그는 `og:-` , 트위터 공유 카드와 관련된 카드는 `twitter:card` 등으로 표시되어 알맞은 데이터가 들어가 있는 것을 볼 수 있다.

## 결과

---

![메인](/images/posts/seo_improve/main.png)
![상품 상세](/images/posts/seo_improve/product_detail.png)
![창작사 스토어](/images/posts/seo_improve/store.png)

페이지마다 별도의 헤더를 생성하는 방식보다 훨씬 효율적이고, 메타 태그 관련된 코드를 따로 분리할 수 있다. 국가별 번역된 메타 태그를 제공해야 해서 더욱 복잡했던 코드가 훨씬 정리된 듯 했고, 유지보수 시에도 편리했다.

그리고 무엇보다 링크 공유가 많은 주요 페이지에 대한 SEO 점수가 90점 이상이 되었다.

![](/images/posts/seo_improve/result.png)

검색 엔진 최적화 작업이 배포되고 나서, 마케팅 팀에서도 사이트 등록과 관련된 작업이나 그 외 많은 작업들을 해주셨다. 원래 네이버에 상품이나 창작자를 검색해도 검색 엔진에서 밀려 상위 노출이 되지 않았었는데, 바로 상위 노출 되는 것을 확인할 수 있었다. 서비스에 실질적인 도움이 된 것 같아 뿌듯하면서도, 기능 개발할 때 조금씩만 더 신경썼으면 좋았겠다 라는 생각도 들었다.
