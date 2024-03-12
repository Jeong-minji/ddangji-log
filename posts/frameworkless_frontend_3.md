---
title: "📚 프레임워크 없는 프론트엔드 개발 _ \n3. DOM 이벤트 관리"
date: "2023-03-22"
description: "프레임워크 없는 프론트엔드 개발 도서 스터디 후 정리한 내용"
tags: ["study", "js", "react", "framework"]
thumbnail: "thumbnail.png"
---

## YAGNI 원칙

---

You aren’t gonna need it, 당신이 필요하다고 예측할 때가 아니라, **실제로 필요할 때 구현하라.**

현재 필요 없는 기능은 나중에도 필요 없을 수도 있다. 이는 개발 및 유지보수 비용을 야기하며, 불필요하게 개발하는 작업이 다른 기능에 영향을 미칠 수도 있다.

단, 미래의 **확장성**은 고려하여 코드를 구현하여야 한다.

## DOM 이벤트 API

---

### 이벤트란?

[이벤트 타입](https://developer.mozilla.org/en-US/docs/Web/Events)

프로그래밍하는 시스템에서 일어나는 사건(action) 혹은 발생(occurrence).
웹 페이지에서 자바스크립트는 발생한 이벤트에 반응하여 특정한 동작을 수행할 수 있다.

이벤트에 반응하기 위해서는 이벤트를 발생시킨 DOM 요소에 콜백으로 연결해야 한다.
뷰 / 시스템 이벤트의 경우 window 객체에 이벤트 핸들러를 연결한다.

### 속성에 핸들러 연결

- DOM 객체의 속성인 `onClick`, `onFocus` 등 `on~` 에 직접 이벤트 리스너를 지정할 수도 있지만
  권장하지 않음
  - 속성에 이벤트 리스너 지정시 한 번에 하나의 핸들러만 연결할 수 있기 때문
  - `onClick` 핸들러를 덮어쓰는 코드가 존재하면 지정했던 핸들러는 손실됨
- `addEventListener`
  - 이벤트를 처리하는 모든 DOM 노드는 `EventTarget` 인터페이스를 가지고 있으며,
    이 인터페이스는 `addEventListener` 메서드를 갖고 있음
  - DOM에 요소가 존재하지 않을 때는 `removeEventListener` 를 사용해 이벤트 리스너를 삭제해 주어야 함 → 메모리 누수 방지

### 이벤트 객체

![](/images/posts/frameworkless_frontend_3/event_node.png)

이벤트 핸들러 함수는 매개 변수로 Event 객체를 제공하며, Event 객체는 Event 인터페이스를 구현한다.
그리고, 이벤트 종류에 따라 더 구체적인 인터페이스를 확장하여 가지고 있다.

### DOM 이벤트 라이프사이클

```jsx
button.addEventListener("click", handler, false);
```

```html
<body>
  <div>
    This is a container
    <button>Click Here!</button>
  </div>
</body>
```

```jsx
const button = document.querySelector("button");
const div = document.querySelector("div");

div.addEventListener(
  "click",
  () => {
    alert("Div Clicked");
  },
  false
);

button.addEventListener(
  "click",
  () => {
    alert("Div Clicked");
  },
  false
);
```

- div, button 두 요소에 모두 이벤트 리스너가 걸려있고, button을 클릭하면 이벤트 버블링 현상으로 인해 button 이벤트를 실행한 후, 부모인 div 이벤트를 실행한다.
- 부모 노드의 이벤트 실행을 방지하기 위해서 `e.stopPropagation()` 사용
  - `useCapture` (세번째 인자값), 기본값 false
  - useCatprue값이 true인 경우, 핸들러의 실행 순서를 반대로 바꾸어 줌
- **이벤트 버블링 vs 이벤트 캡처링**
  HTML에서 이벤트 발생시 캡쳐링 → 이벤트 타켓 → 버블링의 순서로 이벤트가 전파된다.
  `useCapture` 값에 따라 어느 단계에 이벤트를 적용시킬지 결정할 수 있으며, true인 경우 버블 단계 대신 캡쳐 단계에서 이벤트 핸들러를 추가한다는 것을 의미한다.
  ![](/images/posts/frameworkless_frontend_3/event_loop.png)

### 사용자 정의 이벤트 사용

`new CustomEvent('이벤트명', 객체)`

- 두 번째 인자값으로 detail 프로퍼티를 추가하여 이벤트 관련 정보를 명시하고 이벤트에 전달 가능
- `new Event()`로 이벤트를 생성하는 것 과의 차이는 detail 값을 추가로 전달할 수 있나 없나의 차이

```jsx
const EVENT_NAME = "FiveCharInputValue";
const input = document.querySelector("input");

input.addEventListener("input", () => {
  const { length } = input.value;
  console.log("input length", length);

  if (length === 5) {
    const time = new Date().getTime();
    const event = new CustomEvent(EVENT_NAME, {
      detail: { time },
    });
    input.dispatchEvent(event);
  }
});

input.addEventListener(EVENT_NAME, (e) => {
  console.log("Handling custom event...", e.detail);
});
```

## TodoMVC에 이벤트 추가

---

`todo.js`에서 DOM 요소를 문자열로 생성하여 렌더링하고 있으나, 이러한 경우 이벤트 핸들러를 추가할 수 없음

### DOM 노드 생성

1. `document.createElement`

   ```jsx
   const newDiv = document.createElement("div");
   if (!condition) {
     newDiv.classList.add("disabled");
   }

   const newSpan = document.createElement("span");
   newSpan.textContent = "Hello World";

   newDiv.appendChild(newSpan);
   ```

2. `<template></template>`

   innerHTML로 넣을 경우, DOM을 재탐색해서 찾아서 등록을 해야되는데 비효율적인 작업이다.

   `<template>`은 렌더링 트리에 실제로 반영되지는 않고, 해당 태그 안에 있는 내용들을 string 작성 없이 가져다 사용할 수 있으므로, 동적인 태그를 작성하기에 더 편리하다.

### 기본 이벤트 처리 아키텍처

새로운 state마다 새로운 DOM 트리를 생성하여 가상 DOM 알고리즘을 적용하고 루프에 이벤트 핸들러를 삽입하며, 이 과정은 모든 프레임워크에서 적용된다.

![KakaoTalk_Photo_2023-02-06-19-45-41.jpeg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e5695e38-46f3-431c-a0e9-981239fdaab5/KakaoTalk_Photo_2023-02-06-19-45-41.jpeg)

세번째 매개변수에 상태를 수정하고 새로운 렌더링을 수동으로 호출하는 event 함수가 추가되었다.

```jsx
const events = {
  deleteItem: (index) => {
    state.todos.splice(index, 1);
    render();
  },
  addItem: (text) => {
    state.todos.push({
      text,
      completed: false,
    });
    render();
  },
};

const render = () => {
  window.requestAnimationFrame(() => {
    const main = document.querySelector(".todoapp");
    const newMain = registry.renderRoot(main, state, events);
    applyDiff(document.body, main, newMain);
  });
};
```

## 이벤트 위임 ⭐️

---

요쇼마다 각각 이벤트 핸들러를 할당하지 않고 공통된 부모 컴포넌트에 이벤트 핸들러를 할당하여 이벤트를 관리하는 방식이다.

```html
<div id="Menu">
  <button data-action="save">저장하기</button>
  <button data-action="reset">초기화 하기</button>
  <button data-action="load">불러오기</button>
</div>
```

```jsx
const Menu = document.getElementById("Menu");

const ActionFunctions = {
  save: () => alert("저장하기"),
  reset: () => alert("초기화하기"),
  load: () => alert("불러오기"),
};

Menu.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  if (action) ActionFunctions[action]();
});
```

- 더이상 필요로 하지 않는 DOM에 대한 이벤트 핸들러는 함께 삭제해주어야 메모리 누수가 적어짐
- 그러나 동적으로 추가 / 삭제되는 엘리먼트에 매번 이벤트 리스너를 추가 / 삭제하는 것은 비효율적
- 이벤트 버블링을 이용하여 하나의 부모에 이벤트를 등록하면 이벤트 핸들러는 부모에 한번만 할당하고, 각 자식 노드들에 대한 알맞은 동작을 실행시킬 수 있음

```jsx
// html
<button data-click-id='1' data-click-group='orderList'>주문목록</button>
<button data-click-id='10' data-click-group='orderList'>주문상세</button>

//js
const sendLog = (clickId, clickGroup) => {
	// 로그 전송 코드
	console.log(clickId)
}

window.addEventListener('click', (e) => {
	if(e.target.matches('[data-click-id]')) {
		const { clickId, clickGroup } = e.target.dataset
		sendLog(clickId, clickGroup)
	}
})
```
