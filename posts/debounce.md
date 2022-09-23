---
title: "React에서 lodash debounce가  정상적으로 작동하지 않을 때"
date: "2022-07-26"
description: ""
tags: ["js"]
thumbnail: "thumbnail.png"
---

서치 모듈을 만들면서 lodash debounce를 사용하게 되었다. 검색어를 입력하면 그에 따른 추천 키워드를 서버에서 받아와 실시간으로 띄워주는 기능이었는데, 사용자가 텍스트를 적을 때마다 매번 api 요청을 보내면 안되기 때문에 debounce를 사용하게 되었다.

## Debounce

순차적으로 발생한 이벤트를 그룹화해서, 지정한 시간이 지난 후에 해당 이벤트가 한 번만 일어나도록 하는 것.
즉, 연달아 호출 되는 함수 중 제일 마지막 함수만 호출되도록 하는 것이다.

Debounce를 사용하는 방법은 다음과 같다.

```js
const sendQuery = (newValue: string) => {
  setSearchValue(newValue);
};

const delayQueryCall = debounce((newValue) => sendQuery(newValue), 300);
```

첫번째 인자로는 일정 시간 후에 실행할 콜백 함수가 들어가고, 두번째 인자로는 시간이 들어간다.
나는 debounce 콜백 함수로 searchValue라는 state값을 set해주는 함수를 넣었고, searchValue 값이 변경되면 연관 태그를 불러오는 api를 호출하여
값을 받아오는 방식으로 로직을 작성하였다.
그러면 sendQuery 함수가 debounce 되어, 연속적으로 발생하던 텍스트 입력 이벤트가 멈추었을 때 일정 시간이 지나면 setSearchValue를 할 것이므로
api 요청도 매번 하지 않아도 될 것이라고 생각하였다.

그러나 아무리 코드를 이래저래 고쳐보아도 debounce가 먹히지 않고 매번 api 요청을 보냈다.
이유를 찾기 위해 거의 1시간을 구글링한 결과 어떤 외국인 개발자님이 쓴 블로그를 보고 이유를 알게 되었다.

## Debounce가 작동하지 않은 이유

우선 해당 문제가 발생한 이유는 함수형 컴포넌트였기 때문이다.
함수 내부에서 선언된 변수들은 해당 함수의 실행이 끝나면 만료된다. 이것은 함수가 매번 실행될 때마다 내부 로컬 변수들이 초기화 된다는 뜻이다.
Debounce는 내부적으로 setTimeout 함수를 통해 작동되는데, 함수형 컴포넌트에서 debounce를 사용한다는 것은 **함수가 실행될 때마다 setTimeout 함수가 계속
새로 생성**되고 있다는 뜻이다.
이러한 문제를 막으려면 debounce 된 콜백에 대한 참조를 저장해야 한다(useState 처럼).

## 해결 방법

다음의 방법들을 썼더니 디바운스가 정상 작동 되었다.
적절한 상황 또는 개인 취향에 따라 알맞은 방법을 선택하면 되겠지만, `useCallback`을 사용하는 것이 더 직관적이고 깔끔한 코드인 것 같아 두 번째 방법을 선택하였다.

### 1. useRef

useRef가 반환한 값은 함수가 렌더링 되어도 재생성되지 않기 때문에 debounce를 useRef로 감싸는 방법이 있다.
한가지 단점은 값을 가져오기 위해서 `.current`를 뒤에 계속 붙여줘야 하기 때문에 상당히 번거롭다는 점이다.

```js
const delayQueryCall = useRef(
  debounce((newValue) => sendQuery(newValue), 300)
)?.current;
```

### 2. useCallback

```js
const delayQueryCall = useCallback(
  debounce((newValue) => sendQuery(newValue), 300),
  []
);
```
