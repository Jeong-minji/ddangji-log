---
title: "Sentry 도입 배경 및 기본 세팅 방법"
date: "2023-05-23"
description: "사내 코드에 Sentry를 도입하게 된 배경 및 고찰에 대한 기록"
tags: ["Sentry", "CI"]
thumbnail: "thumbnail.jpg"
---

> 💡 사내 코드에 Sentry를 도입하게 된 배경과, 기본 환경 세팅 방법 및 세팅하면서 어려웠던 점들에 대해 정리한 글입니다.

## 1. 개요

---

실시간으로 로그를 취합하고 분석하는 도구이자 모니터링 플랫폼.
수집된 로그에 대한 다양한 정보를 제공하며, 시각화 도구를 통해 발생한 이벤트와 수치를 쉽게 분석할 수 있도록 도와줌

## 2. 도입 목적

---

### 개발 중인 서비스의 특징

- 타겟 유저가 국내 및 해외(미국, 일본, 중국 등)로 분포되어 있음에 따라, 개발 시 timezone, 다양한 브라우저 환경, 텍스트 번역 등이 고려되어야 한다.
- 반응형 웹 서비스로서, 데스크톱 뿐만 아니라 모바일 기기에서도 사용 가능하므로 모바일 기기에서 사용하는 브라우저 환경이 고려되어야 한다.

### **기존 에러 로그 수집 방식의 문제점**

별도로 에러 로그를 수집하는 프로세스가 없어 CS 담당자가 해당 문제를 개발팀에게 전달한 후, 유저에게서 발생한 것과 동일한 오류를 개발자들이 직접 재현해야 한다. 따라서 유저에게 에러가 발생한 환경 및 상황에 대해 상세한 설명을 요구해야 하는데, 이는 에러를 분석하는데 많은 시간이 소요되고 비효율적이다. 특히, 해외 유저 및 해외 브라우저에서 발생한 오류의 경우에는 오류의 원인을 파악하기가 더욱 어려웠다.

### Sentry의 장점

- 소스맵과 연동해서 릴리스 환경에서도 소스 코드의 어느 위치에서 에러가 발생했는지 상세하게 파악 가능
- 오류에 대한 다양한 정보 제공 (Device, Exception, Browser, OS, Breadcrumbs 등)
- 누적된 에러 정보를 확인 (에러 발생 프로젝트 및 코드, 발생 횟수 등)
- 에러 발생시 연동한 앱으로 알림을 받아 오류 발생과 오류에 대한 정보 파악이 가능

위의 기능들을 이용하면 기존 방식에 비해 효율적인 방식으로 에러 정보를 제공받을 수 있다. 개발자가 직접 오류 알림을 받고 즉각으로 이슈에 대처할 수 있다. 또한, 수집된 에러 로그를 바탕으로 앞으로 발생할 가능성이 있는 이슈 및 문제가 발생할 수 있는 코드를 예측하여 사전에 방지할 수 있다. 오류를 최소화 하는 것 만으로도 서비스에 대한 사용자 경험을 향상시킬 수 있고, 에러 추적 과정에 있어서 개발자 경험도 동시에 향상 시킬 수 있다고 판단하여 Sentry 도입을 결정하게 되었다.

## 3. 사용 방식 및 플랜

---

### 방식

사내에 별도의 인프라를 구축 하기에는 시간적 제한으로 인해 어려움이 있으며, 최대한 적은 비용을 사용해야 하므로 on-premise와 cloud 방식 중 cloud 방식을 도입하여 요금제 플랜을 사용하기로 결정

### 플랜

- Developer 플랜을 사용
- 제약 사항
  - 멤버 수 제한: 하나의 계정만 사용 가능 (멤버 초대 불가)
  - 에러 수 제한: 5,000개 제한
  - 히스토리 저장: 이슈에 대한 히스토리를 30일만 저장

## 4. 초기 세팅

---

### 4-1. 환경 변수

![](/images/posts/sentry/reference.png)

```jsx
//.env.production

// production mode에서만 실행
SENTRY_IGNORE_API_RESOLUTION_ERROR = 1;
NEXT_PUBLIC_SENTRY_DSN = "별도전달";
NEXT_PUBLIC_SENTRY_AUTH_TOKEN = "별도전달";

// 텔레그램 실시간 오류 알림
NEXT_PUBLIC_TELEGRAM_BOT_KEY = "별도전달";
NEXT_PUBLIC_TELEGRAM_CHAT_ID = "별도전달";
```

## 5. Config

---

Sentry 사용을 위해 기본적으로 세팅한 코드들에 대한 간략한 설명

### .sentryclirc

Sentry 계정에 대한 authorization token값이 들어있는 파일이며, 해당 파일이 없으면 git-action에서 빌드시 권한 에러가 발생한다.

### next.config.js

- Sentry를 이용하기 위해서는 next 웹팩 설정을 `withSentryConfig`로 감싸주어야 한다.
  - 해당 설정은 파일을 **빌드할 때** 적용되고, 빌드한 파일을 센트리 서버에 업로드
  - `next build`가 실행되면, sentry-cli가 자동으로 소스 파일, 소스맵, 번들 등을 센트리에 업로드
    → stacktrace가 원본 코드 확인 가능
- `hideSourceMaps`: 소스맵 공개 여부

  - `false`로 설정하는 경우: production에 함께 올라가서 원본 코드가 브라우저에 노출
  - `true`로 설정하는 경우: 빌드할 때 매핑 파일들이 생성되고 센트리 서버에 업로드 되지만, 최종적으로 배포될 때는 이 파일들이 제외된 채로 업로드되어 브라우저에 코드가 노출되지 않음
  - 예시 이미지
    ![hideSourceMap: true](/images/posts/sentry/hide_true.png)
    ![hideSourceMap: false _ 소스맵을 숨기지 않은 경우 코드가 그대로 노출됨](/images/posts/sentry/hide_false.png)

  ```jsx
  const { withSentryConfig } = require("@sentry/nextjs");

  const moduleExports = {
    sentry: {
      hideSourceMaps: true,
    },
  };

  const sentryWebpackPluginOptions = {
    silent: true,
  };

  module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
  ```

### sentry.client.config.ts

- Next.js 설정에서는 동일한 설정이라도 `sentry.server.config.ts` 파일이 함께 존재해야 한다.
- `Sentry.init()`에 인자값으로 설정에 대한 객체들을 넘겨주면 기본 설정을 변경할 수 있다.
- `ignoreErrors` 옵션에 에러 텍스트를 추가하면, 해당 에러는 발생되어도 Sentry 로그에 쌓이지 않는다.
- `tracesSampelRate` : Transaction이 쌓이는 비율을 나타내는 값이며, `1.0` 에 가까울 수록 로그를 자주 쌓게 되므로, 로그 제한이 있는 플랜을 사용하는 경우 너무 많은 비율을 설정하지 않아야 한다

```jsx
import * as Sentry from "@sentry/nextjs";

const ignoreErrors = ["Abort route change. Please ignore this error."];

Sentry.init({
  dsn: sentryDsn,
  environment: env,
  tracesSampleRate: 0.1,
  ignoreErrors: ignoreErrors,
  beforeSend: (event) => sendErrorMessage(event),
  beforeBreadcrumb: (breadcrumb, hint) =>
    customBreadcrumbData(breadcrumb, hint),
});
```

[Configuration for JavaScript](https://docs.sentry.io/platforms/javascript/configuration/)

### sentry.properties

해당 값들이 올바르게 설정되어 있어야 Sentry가 정상적으로 작동한다.
추후 `Sentry.io`에서 organization이나 프로젝트명 등을 변경할 경우 해당 파일도 함께 변경해야 한다.

```jsx
defaults.url=https://sentry.io/
defaults.org=[organization명]
defaults.project=[프로젝트명]
cli.executable=node_modules/@sentry/cli/bin/sentry-cli
```

### git action 설정

Sentry 세팅 코드를 git에 push 후 깃 액션 실행시 `Sentry reported an error: Authentication credentials were not provided. (http status: 401)` 에러가 발생했다. 액션 실행시 auth token 값이 필요하기 때문이다.

따라서 레포지토리 시크릿 환경변수에 토큰값을 세팅한 후, 액션 실행할 때 빌드 전 해당 토큰값을 읽도록 설정하였다.

![](/images/posts/sentry/action.png)

```jsx
name: Node.js CI

on:
  pull_request:
    branches:
      - main
      - 'release-**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'
          registry-url: https://npm.pkg.github.com/
          scope: '@pixel-develop'
      - name: Install dependencies
        run: yarn install | echo "NEXT_PUBLIC_SENTRY_AUTH_TOKEN=${{ secrets.NEXT_PUBLIC_SENTRY_AUTH_TOKEN}}" >> .env
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - name: Build test
        run: yarn build
```

## 6. [Sentry.io](http://Sentry.io) 사용법

---

### 6-1. 이슈 목록

![](/images/posts/sentry/1.png)

- Projects 페이지 하단 또는 Issues 페이지에서 누적된 이슈를 확인할 수 있다.
- Issue type
  - New Issues: 새로 발생한 이슈
  - Unhandled: 별도로 handling 및 에러 처리되지 않은 곳에서 발생한 이슈
  - Regressed: resolved 된 적 있으나 재발생한 이슈
  - Resolved: 해결된 이슈

### 6-2. 이슈 상세

![](/images/posts/sentry/2.png)

- 이슈 내용, 발생 URL, eventID, 유저 IP, 브라우저 정보(종류, 버전), OS 정보, 런타임 등에 대한 정보 제공
- 우측 상단 버튼
  - Ignore: 발생한 이슈를 무시하고 Ignored 상태로 전환
  - Resolve: 해당 이슈가 해결되었을 때 클릭하여 해결 완료 상태로 전환
- Breadcrumbs
  - 이슈가 발생하기까지 유저의 이동 경로
  - API 요청의 경우 [주소, 메소드, status code, body값, response값을 확인할 수 있도록 세팅](https://www.notion.so/2b2d2507f94e432d97ef03ad42c49068?pvs=21)
    ![](/images/posts/sentry/3.png)

## 7. Sentry 작동 방식

---

try-catch를 이용하여 명시적으로 에러를 처리한 경우, 개발 모드에서는 에러가 전송되나 배포 모드에서는 에러가 전송되지 않으므로 `captureException`이나 `captureMessage`를 이용하여 직접 에러를 전송해야 한다.

### Scope

`configureScope`는 공통 정보(글로벌 스코프와 비슷함), `withScope`는 각 에러 상황시 추가 정보 전송

```jsx
Sentry.configureScope((scope) => {
  scope.setUser({
    accountId: 2023,
    email: "example@gmail.com",
  });

  scope.setTag({
    webViewType: "WEB",
  });
});
```

API 에러에 대한 태그와 레벨 정보 설정

```jsx
Sentry.withScope((scope) => {
  scope.setTag("type", "api");
  scope.setLevel(Sentry.Severity.Error);

  Sentry.captureException(new Error("API Internal Server Error"));
});
```

### 2. Context

이벤트에 임의의 데이터를 연결할 수 있다. 검색은 할 수 없고, 이벤트가 발생한 이벤트 로그에서 확인 가능하다.

```jsx
const handleAxiosError = (error: AxiosError) => {
  const { method, url, params, data: requestData, headers } = error.config;
  Sentry.setContext("API Request Detail", {
    method,
    url,
    params,
    requestData,
    headers,
  });

  if (error.response) {
    const { data, status } = error.response;
    Sentry.setContext("API Response Detail", {
      status,
      data,
    });
  }
};
```

### 3. Customized Tags

tag는 인덱싱이 되는 요소이므로 이슈 검색 및 트래킹을 신속하게 진행할 수 있다.

```jsx
Sentry.withScope((scope) => {
  scope.setTag("type", "api");
  scope.setTag("api", "general");

  scope.setLevel(Sentry.Severity.Error);

  Sentry.captureException(new Error("API Internal Server Error"));
});
```

### 4. Level

이벤트마다 level을 설정항 이벤트의 중요도를 식별할 수 있다.
fatal, error, warning, log, info, debug, critical로 설정 가능

### 5. Issue Grouping

모든 이벤트는 fingerprint를 가지고 있으며, **fingerprint가 동일한 이벤트는 하나의 이슈로 그룹화** 된다.
이를 이용하여 재설정 가능하다.

```jsx
// axios의 error 객체
const { method, url } = error.config;
const { status } = error.response;

// fingerprint 재설정
Sentry.withScope((scope) => {
  scope.setTag("type", "api");
  scope.setTag("api", "general");

  // 같은 API에 대한 에러가 fingerprint 설정에 의해 grouping
  scope.setFingerprint([method, status, url]);
  scope.setFingerprint([method, path, err.statusCode]);

  Sentry.captureException(new Error("API Internal Server Error"));
});
```

### 알람 조건 설정하기

1. When: 처음 보는 이슈 발생시 / 해결된 이슈 재발생시 / 무시하고 있던 이슈 해제시
2. If: level, tag, attribute, n번 중복 발생, 원하는 레벨 이벤트가 n번 발생할 경우

### 유의미한 데이터를 수집하자

1. chunk load 에러나 network 에러는 수집 제외 (timeout 에러는 수집)
   - `blackListUrls`: 써드 파티 라이브러리 사용시, 특정 url을 무시해야 할 때 사용함 (ex) 채널톡, 제니퍼
2. 분석하고자 하는 API의 http status를 구분하여 수집 (4xx 에러는 부분적 수집 제외, 5xx는 대부분 수집)
3. 에러 데이터 뿐 아니라 디버깅과 분석에 필요한 추가적인 정보 수집

### 에러의 종류

1. throw Error 등 직접적으로 에러를 핸들링 하여 보내는 경우
2. Axios 등에서 발생한 에러이지만 핸들링 하지 않은 에러를 보내는 경우
3. Sentry.captureException을 통해 에러를 보내는 경우

## 8. 배운점

---

### 1. `tracesSampleRate` 설정

요금제로 인해 이슈 로그에만 제한이 있는줄 알았는데, 어느날 대시보드에 들어가보니 transaction이 가득 차서 에러 수집이 중단된 것을 발견하게 되었다. 이유를 찾아본 결과 트랜잭션이 많이 쌓였기 때문이었다. Sentry에서 트랜잭션이 무엇이고 트랜잭션을 왜 수집하는지, 그리고 이를 핸들링 할 수 있는 방법이 없는지 찾다가 이에 관련된 공식 문서 설명을 발견하였다.

Sentry에서 성능 모니터링을 위해 처리량과 대기시간 등을 측정해서 오류에 영향을 미치는 정도를 표시한다.
샘플 속도를 구성할 때 `sentry.client.config.ts`에 `tracesSampleRate` 값을 설정하는데, 모든 트랜잭션에 대해 균일한 샘플 속도를 나타내는 0~1 사이로 설정한다.

(ex) 트랜잭션의 20%를 내보내려면 tracesSampleRate = 0.2

공식 문서에서는 테스트 하는 동안 모든 트랜잭션을 Sentry로 전송하고(1.0), 테스트가 완료되면 값을 낮추거나 트랜잭션을 동적으로 샘플링하기를 권정하고 있다. 그리고 프로덕션 모드에서는 값을 낮추는것이 좋다고 한다. 샘플링 속도를 1.0으로 그대로 두면, 사용자가 페이지를 로드하거나 앱의 모든 곳을 탐색할 때마다 트랜잭션을 전송하기 때문이다. 이 수치를 조정하여 Sentry 트랜잭션에 부담을 주지 않고 대표 데이터를 수집할 수 있다.

### 2. `mutateAsync`의 잘못된 사용

Sentry 로그를 확인하던 중 `unhandled exception error` 가 많이 쌓여있는 것을 보게 되었다. 유저에게 직접적인 불편함을 주거나 기능상 문제가 생기는 오류가 아니여서, 어떤 케이스에 잡히는 에러인지 파악하는데 시간이 걸렸다.

그러다가 post 요청 보내는 몇몇 곳에서 요청 보낼 때 마다 해당 에러가 쌓이는 것을 확인하게 되었고, 이 요청들의 공통점은 react-query의 mutateAsync를 사용한다는 것이었다. 왜 mutateAsync 사용부에서만 `unhandled exception` 오류가 발생한 것일까?

mutateAsync를 사용하면 promise를 반환하는데, 이 때 별도로 에러를 핸들링 해주지 않으면 `unhandled exception error`가 발생하여 mutateAsync 사용하는 모든 곳에서 Sentry 에러가 잡히게 된다.

post 요청을 보낸 후 그 response값을 promise로 받아오기 위해 mutateAsync를 사용하고 있었는데, 이 때 `.then()`으로 데이터를 받아오기만 하고 `.catch()`로 에러 핸들링을 따로 처리하지 않은 것이 원인이었다.

react-query 개발자가 직접 쓴 [mutation에 관한 글](https://tkdodo.eu/blog/mastering-mutations-in-react-query)을 보았는데, 그는 아래와 같이 설명하였다.

> 💡 변형 응답에 액세스해야 할 때 mutateAsync를 사용하고 싶을 수도 있지만 **저는 거의 항상 mutate를 사용해야 한다고 주장합니다.**
> 콜백을 통해 데이터 또는 오류에 계속 액세스할 수 있으며 오류 처리에 대해 걱정할 필요가 없습니다. **mutateAsync를 사용하면 Promise를 제어할 수 있으므로 수동으로 오류를 잡아야 합니다.**
> 그렇지 않으면 unhandled promise rejection을 을 만나게 됩니다.

따라서 mutateAsync 사용부 중, 불필요하게 mutateAsync를 사용한 곳은 mutate 함수로 일괄 변경 했고, 필요에 의해 mutateAsync를 사용해야 하는 곳은 `.catch()`문을 추가하여 별도로 에러를 핸들링 했다.

### 3. 아쉬운점

Sentry 설치한지 반년의 시간이 흘렀다. 하지만 초반에 세팅에 들인 시간에 비해 Sentry를 엄청 적극적으로 활용하고 있지 못했다는 생각이 든다. 그 이유에 대해 생각해봤을 때, 가장 큰 이유는 유의미한 에러 로그 쌓기에 실패한 것이라고 생각한다. 필요없는 에러까지 모두 쌓이다 보니 에러 발생 알람이 무의미한 경우가 있었기 때문이다.
이를 보완하기 위해서는 앱 전체를 `withSentry`로 감싸서 사용하지 말고 다른 방법을 사용했어야 할 것 같다.

자바스크립트 에러인지, axios 요청 에러인지 구분하고 이 에러들을 정리해서 필요한 에러만 Sentry 로그에 쌓이도록 별도 제공 함수를 군데군데 사용했으면 더 유의미한 로그가 쌓이지 않았을까 싶다.

그리고 다른 업무에 밀려 에러 트래킹은 우선 순위가 밀리게 되었고, 그러다 보니 기존에 작성되어 있던 많은 양의 코드에 에러 핸들링을 추가하고, 에러 관련 모듈을 만들어 적용하는 것이 쉽지 않은 상황이 되었던 것 같다.
다른 곳에서는 어떻게 유의미한 데이터를 쌓았는지 많이 찾아보고 적용해보고 싶다.

참고 자료: [Sentry로 우아하게 프론트엔드 에러 추적하기 | 카카오페이 기술 블로그](https://tech.kakaopay.com/post/frontend-sentry-monitoring/)
