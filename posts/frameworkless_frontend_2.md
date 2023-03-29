---
title: "📚 프레임워크 없는 프론트엔드 개발 _ 렌더링"
date: "2023-03-15"
description: "프레임워크 없는 프론트엔드 개발 도서 스터디 후 정리한 내용"
tags: ["study", "js", "react", "framework"]
thumbnail: "thumbnail.png"
---

## DOM

---

DOM이란 웹 페이지에 대한 인터페이스로, 여러 프로그램들이 페이지의 내용, 구조, 스타일을 읽고 조작할 수 있는 API를 제공한다. 아래의 Critical Rendering Path를 통해 알 수 있듯이, HTML 페이지는 트리로 구성되며 각 노드의 속성을 변경하기 위해서는 `선택자(selector)`를 사용한다.

### Critical Rendering Path

브라우저가 페이지 초기 출력을 위해 HTML 데이터를 화면에 렌더링 하기 까지의 과정을 의미한다.

1. HTML 데이터를 파싱하여 DOM 트리 생성
2. 스타일 시트를 파싱하여 CSSOM 생성
3. 독립된 객체인 DOM과 CSSOM을 병합하여 렌더 트리 구축
4. Layout: 각 요소에 대한 위치와 크기를 계산하여 화면의 레이아웃 구성 (Reflow)
5. Paint(Repaint)

## 렌더링 성능 모니터링

---

웹용 렌더링 엔진을 설계할 때는 가독성, 유지 관리성, 성능을 중요하게 생각해야 한다.
대표적인 웹 성능 측정 방법으로 초 당 프레임 수(FPS)를 확인하는 방법이 있다.

!["초 당 프레임 수"](/images/posts/frameworkless_frontend_2/fps.png)

FPS는 GPU에서 사용하는 메모리의 양을 확인할 수 있으며, 애니메이션이나 마우스 움직임이 끊임업싱 부드럽게 동작하는가를 나타내는 지표가 된다. 보통 60fps 이상이면 무난히 동작한다고 판단하며, 크롬 개발자 도구 또는 `stats.js` 라이브러리 등을 사용하여 확인 가능하다.

## 렌더링 함수

---

순수 함수로 요소를 렌더링 한다는 것은 DOM 요소가 어플리케이션의 상태에만 의존한다는 것이다.

```js
// 어떠한 state 값을 함수에 넣었을 때 같은 뷰가 반환된다
view = 𝑓(state);
```

순수 함수 렌더링 과정을 예제와 함께 살펴보았다.

1. `view.js` :
   기본으로 사용되는 타겟 DOM 요소와 state를 인자값으로 받음 -> 타겟 DOM을 복제하여 state를 활용하여 업데이트 -> 변경시 새 노드 반환

2. `index.js` :
   모든 DOM 조작 또는 애니메이션은 `requestAnimationFrame`을 기반으로 한다. 메인 스레드를 차단하지 않고, 이벤트 루프에서 스케줄링 되기 직전에 repaint가 실행된다.

   !["렌더링 프로세스"](/images/posts/frameworkless_frontend_2/rendering.png)

## 동적 데이터 렌더링

---

새로운 데이터가 있을때마다 `root element 생성 -> element 생성 -> 새로 생성된 요소로 변경` 작업을 거치면, 어플리케이션의 크기가 클수록 더 많은 성능 저하가 발생할 것이다.

### 가상 DOM

선언적 렌더링 엔진의 성능을 개선시키는 방식이다.
UI가 메모리에 저장되고, 실제 화면에 렌더링되어 있는 DOM과 동기화되어 있다가 `diff` 알고리즘을 사용하여 다른 점만 찾아내어 **실제 DOM을 새로운 DOM으로 교체하는 가장 빠른 방법**을 찾아낸다.

자세한 내용은 React 공식 문서의 [reconcilation에](https://ko.reactjs.org/docs/reconciliation.html) 대한 설명을 참고

### 가상 DOM 구현

```js
const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector(".todoapp");
    const newMain = registry.renderRoot(main, state);
    applyDiff(document.body, main, newMain);
  });
};
```

`applyDiff(현재DOM, 실제DOM, 가상DOM)`

- 새 노드가 없음 -> 실제 노드를 삭제
- 실제 노드가 정의되지 않았지만 가상 노드가 존재 -> 부모 노드에 추가
- 두 노드 모두 정의 -> 두 노드의 차이 확인
  - 속성의 수가 다른가?
  - 하나 이상의 속성이 변경되었는가?
  - 노드에는 자식이 없으며, textContent가 다른가?

### Component Functions

1. 선언적 방식을 사용하여 어떤 컴포넌트를 렌더링 할 것인지 자동으로 결정하도록 설계해야 함

- 데이터 속성
  - HTML은 데이터에 대한 확장 가능성을 염두에 두고 설계되었기 때문에 `data-*` 형태로 추가적인 DOM 속성을 저장할 수 있게함
  - 접근 방식: `document.getElementById(’electric’).dataset.속성`
  - 예제에서는 `data-component='컴포넌트명'` 으로 지정하여 사용함
- 레지스트리
  - 어플리케이션에서 사용할 수 있는 모든 **컴포넌트의 인덱스**
  - 예제에서는 data-component 값과 인덱스의 값을 일치시켜 호출함
  ```js
  const registry = {
    todos: todosView,
    counter: counterView,
    filters: filtersView,
  };
  ```

2. 이 모든 방식은 root 컨테이너 포함 모든 컴포넌트에 적용되어야 하며, 다른 컴포넌트 내부에서도 동일한 로직 사용 가능 (재사용성)

3. 순수 함수를 상속받을 수 있도록 컴포넌트를 래핑하는 고차 함수 생성

- 기존의 컴포넌트를 가져와 동일한 새로운 컴포넌트를 반환함
- [ data-component 속성을 가진 모든 DOM 요소 탐색 → 발견 → 자식 컴포넌트 호출 → 자식 컴포넌트는 동일한 함수로 래핑 ] → 재귀하여 마지막 컴포넌트까지 모두 탐색
- 참고자료: [일급 객체](https://ko.wikipedia.org/wiki%EC%9D%BC%EA%B8%89_%EA%B0%9D%EC%B2%B4), [커링](https://ko.javascript.info/currying-partials), [HOF](https://ko.wikipedia.org/wiki/%EA%B3%A0%EC%B0%A8_%ED%95%A8%EC%88%98)

```js
// 레지스트리 접근자 메서드
const add = (name, component) => {
  registry[name] = renderWrapper(component);
};
```

4. 최초 DOM 요소에서의 렌더링 시작을 위해 루트를 렌더링 하는 메서드 `renderRoot` 추가

   ```jsx
   const renderRoot = (root, state) => {
     const cloneComponent = (root) => {
       return root.cloneNode(true);
     };
     return renderWrapper(cloneComponent)(root, state);
   };
   ```

5. 컨트롤러에서 모든 컴포넌트 혼합하여 렌더링

   ```jsx
   registry.add("todos", todosView);
   registry.add("counter", countersView);
   registry.add("filters", filtersView);

   const state = {
     todos: getTodos(),
     currentFilter: "All",
   };

   window.requestAnimationFrame(() => {
     const main = document.querySelector(".todoapp");
     const newMain = registry.renderRoot(main, state);
     main.replaceWith(newMain);
   });
   ```
