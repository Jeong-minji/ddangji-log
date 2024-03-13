---
title: "서비스 성능 개선 기록"
date: "2023-08-20"
description: "Lighthouse 분석을 통해 로딩 속도를 개선한 경험"
tags: ["웹 성능", "최적화"]
thumbnail: "thumbnail.jpg"
---

## 이슈

---

사이트 진입시 느린 로딩 속도를 개선하기 위하여, 로딩 성능과 관련된 지표인 LCP 및 그 외 지표들을 Lighthouse 분석을 통해 향상시키고, 어플리케이션 번들 사이즈를 감소시켜 초기 렌더링 속도 향상이 필요함

## 해결 방법

---

### 1. NextJS dynamic import 적용

초기 화면에 필요한 리소스를 불러올 때 당장 사용하지 않는 모듈은 dynamic import로 불러온다.
Dynamic import 한 모듈들은 페이지 초기 렌더링 시 필요한 리소스와 분리되어 모듈이 필요할 때 따로 불러오기 때문에(Code splitting) 번들 사이즈를 감소시킬 수 있다.

**적용 대상 및 방법**

1. 모바일에서만 사용하는 모듈: `<Header/>`, `<BottomNavigation/>`, `<BottomPopup/>`

- Breakpoint가 mobile에 해당될 때 dynamic import 하도록 변경

```jsx
const DynamicHeader = dynamic(() => import("../Header"), { ssr: false });

const Layout = () => {
  const { isMobile } = useBreakpoint();
  return <div>{isMobile && <DynamicHeader />}</div>;
};

export default Layout;
```

2. 모달

기존: 최상단 `_app.page.tsx`에서 모달 컴포넌트를 고정으로 import

변경: 모달을 dynamic import하는 `<RenderModal/>` 컴포넌트를 생성하여, 전역에서 관리하는 모달의 상태값이 `open === true`인 경우에 모듈을 import 하도록 처리

```jsx
import dynamic from "next/dynamic";
import useModal from "./useModal";

const DynamicModal = dynamic(() => import("./Modal"), { ssr: false });

const RenderModal = () => {
  const { isOpen } = useModal();

  return <>{isOpen && <DynamicModal />}</>;
};

export default RenderModal;
```

**적용 결과**

![](/images/posts/performance_improve/1.png)

### 2. 전역에서 호출하던 ThirdParty script 동적 호출 및 해제

보통 HTML 문서의 `<head/>`에서 `<script/>`를 호출하는데, 브라우저는 HTML 요소를 위에서 부터 아래로 순차적으로 처리하기 때문에 스크립트를 네트워크를 통해 내려받아 실행이 끝나기 전까지 화면에는 아무것도 나타나지 않는다. 따라서  `<head>` 요소 아래에 스크립트를 불러오기 위한 `<script>` 요소가 많은 경우 웹사이트 성능과 사용자 경험에 좋지 않다.
우리 서비스에는 다양한 서드 파티 스크립트를 사용하고 있는데, 이 스크립트들을 한 번에 불러오니 문제가 되었다.

**적용 대상**
tossPayments(결제), kakaoShare(카카오톡 공유하기), recaptcha(회원가입), happyTalk(1:1 상담툴)

**적용 방법**

기존: `_app.page.tsx` 의 `<Head>` 안에서 ThirdParty 모듈 사용에 필요한 스크립트 일괄 로드

```jsx
const App = () => {
  return (
    <>
      <Head>
        <Script src={TOSS_PAYMENTS_SCRIPT} />
        ...
      </Head>
      <ThemeProvider>...</ThemeProvider>
    </>
  );
};
export default App;
```

변경: 스크립트 로드가 필요한 컴포넌트가 로드될 때, 해당 스크립트를 document에 동적으로 추가하여 로드 후, 컴포넌트가 unmount 될 때 스크립트 해제

```jsx
// 결제 페이지 내부 모듈
const Payment = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = TOSS_PAYMENTS_SCRIPT;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <>...</>;
};
export default Payment;
```

useEffect() 내부 코드를 매 스크립트 호출 페이지 마다 작성하는 것이 비효율적이므로 이부분도 별도 함수로 분리하였다.

```jsx
export const manageScript = (src: string) => {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
};
```

### 3. Lodash-es 모듈 import 방식 변경

![](/images/posts/performance_improve/4.png)

Lighthouse의 performance 탭을 분석했을 때, `lodash-es` 모듈을 불러오는데 차지하는 시간이 큰 것으로 확인됨

**적용 방법**

`lodash-es` 함수를 import 할 때, 전체 모듈로부터 함수를 불러오는 대신 `lodash-es`의 특정 모듈로 import 범위를 좁힌 후 함수를 불러오는 방법 적용

```jsx
// 기존
import { throttle } from "lodash-es";

// 변경
import throttle from "lodash-es/throttle";
```

[The Correct Way to Import Lodash Libraries: A Benchmark | BlazeMeter by Perforce](https://www.blazemeter.com/blog/import-lodash-libraries)

**적용 결과**

![](/images/posts/performance_improve/2.png)
수정 전에 비해 lodash-es 호출 시간이 감소

### 4. 폰트 최적화

폰트를 코드 내부에 저장하는 대신, 아래 코드를 문서 헤더에 포함하여 폰트를 불러온다.

폰트 설정할 때, `font-display: swap` 옵션을 넣으면 폰트가 로딩되지 않았을 때 시스템 폰트를 대체해서 보여준다. 그러면 화면이 비어있는 시간이 줄어들기 때문에 First Contentful Paint 시간을 단축할 수 있다.

```jsx
<link
  href='https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Round&display=swap'
  rel='stylesheet'
/>
```

엄청 큰 효과는 아니었지만 FCP가 0.1s 단축되었다. 폰트로 최적화 할 수 있는 방법을 더 찾아보면 좋을 것 같다.

### 5. 무거운 라이브러리 교체

라이브러리 교체는 교체 시 시간 내에 마이그레이션 가능한 범위 내에서 진행하였다. 이미 해당 라이브러리를 이용하여 너무 많은 기능이 개발된 경우에는 교체하지 못했다.

다른 라이브러리 보다 압도적으로 용량이 큰 라이브러리가 디자인 시스템이었다. 팀에서 자체적으로 만들어 사용하고 있는 라이브러리인데, 디자인시스템 내부에서 트리 셰이킹을 적용해서 모듈 사이즈를 줄일 필요가 있을 것 같다.

- `lodash` → `lodash-es`
- `date-fns` → `dayjs`
- `pxplus-design-system` 번들 사이즈 감축 필요 → Rollup?

## Lighthouse 재측정 결과

---

1, 2, 3번 적용 후 Lighthouse 측정 지표가 전체적으로 향상된 것을 볼 수 있다.

다이나믹하게 효과가 있지는 않은 것 같지만 페이지 로드 성능을 보여주는 지표인 speedIndex가 꽤 많이 향상되었고, 사용자 입력에 페이지가 응답하지 못하도록 차단된 총 시간인 Total Blocking Time도 절반 가까이 감소하였다. 생각보다 사소한 부분을 수정하여 서비스의 성능을 개선할 수 있다는 사실에 신기하면서도 평소에 신경을 많이 써야겠다는 생각이 들었다. 무엇보다 성능 측정에 영향을 미치는 다른 많은 요소들이 있음에도 불구하고 사소한 거 하나씩 수정할 때 마다 측정 지표 좋아지는 것이 눈에 보여서 재미있게 작업할 수 있었던 것 같다.

!["수정 전 & 수정 후"](/images/posts/performance_improve/3.png)
