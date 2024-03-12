---
title: "📚 프레임워크 없는 프론트엔드 개발 _ \n4. 웹 구성 요소"
date: "2023-03-25"
description: "프레임워크 없는 프론트엔드 개발 도서 스터디 후 정리한 내용"
tags: ["study", "js", "react", "framework"]
thumbnail: "thumbnail.png"
---

## API

---

### 웹 컴포넌트

- HTML 템플릿
  `<template>` 태그를 이용하여 콘텐츠를 렌더링 하지는 않지만 js에서 동적으로 콘텐츠 생성 가능
- 사용자 정의 요소
  개발자가 DOM 요소를 직접 작성할 수 있음
- [Shadow DOM](https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_shadow_DOM)
  원래의 DOM 트리에서 분리되어 고유의 요소와 스타일을 가진 DOM 트리
  ![Shadow DOM 예시](/images/posts/frameworkless_frontend_4/1.png)

### 사용자 정의 요소

사용자 정의 태그 작성시 대시로 구분된 두 단어 이상의 태그를 사용해야 하며, HTML 요소를 확장하는 자바스크립트 클래스이다.

1. `connectedCallback`
   사용자 정의 요소 라이프사이클 메서드 중 하나로, 구성 요소가 DOM에 연결될 때 호출

   ```jsx
   export default class HelloWorld extends HTMLElement {
     connectedCallback() {
       window.requestAnimationFrame(() => {
         this.innerHTML = "<div>Hello World</div>";
       });
     }
   }
   ```

2. `define`
   생성한 구성요소를 사용하기 위해서는 레지스트리에 추가해야함

   ```jsx
   import HelloWorld from "./components/HelloWorld.js";

   window.customElements.define("hello-world", HelloWorld);
   ```

3. `<hello-world/>`로 태그 사용

### 속성 관리

웹 구성요소의 가장 중요한 기능은 개발자가 어떤 프레임워크와도 호환되는 새로운 구성 요소를 만들 수 있다는 것이다. 따라서 사용자 정의 요소에 속성을 추가 하려면 다른 속성들을 관리하는 것과 동일한 방식으로 관리 가능해야 한다.

1. HTML 마크업에 속성 직접 추가: `<input type="text" value="Frameworkless">`
2. setter: `input.value = 'Frameworkless'`
3. setAttribute: `input.setAttribute('value', 'Frameworkless')`

W3C에서 표준 구성 요소를 정의하는 방법과 동일하며, 다른 개발자가 구성요소를 쉽게 수정할 수 있다.

```jsx
const DEFAULT_COLOR = 'black'

export default class HelloWorld extends HTMLElement {
	get color(){
		return this.getAttribute('color') || DEFAULT_COLOR
	}

	set color(value){
		this.setAttribute('color', value)
	}

	connectedCallback(){...}
}
```

### attributeChangedCallback

이벤트 핸들러를 통해 속성값을 변경해도, DOM에 변화가 일어나지 않아 화면에 반영되지 않는다.
DOM 조작을 추가하기 위해서는 `attributeChangedCallback`을 사용하며, 속성이 변경될 때 마다 호출되는 함수이다.

```jsx
const DEFAULT_COLOR = 'black'

export default class HelloWorld extends HTMLElement {
	static get observedAttributes(){
		// 모든 속성이 attributeChangedCallback을 트리거하지 않으며,
		// 해당 배열에 추가된 속성만 트리거 함
		return ['color']
	}

	get color(){
		return this.getAttribute('color') || DEFAULT_COLOR
	}

	set color(value){
		this.setAttribute('color', value)
	}

	attributeChangedCallback(name, oldValue, newValue){
		if(!this.div) return
		if(name === 'color') this.div.style.color = newValue
	}

	connectedCallback(){...}
}
```

### 가상 DOM 통합

```jsx
attributeChangedCallback(name, oldValue, newValue){
	if(!this.hasChildNodes()) return
	applyDiff(
		this,
		this.firstElementChild,
		createDomElement(newValue)
	)
}
```

### 사용자 정의 이벤트

사용자 정의 이벤트를 이용하여 구성요소가 외부 HTTP와 통신한 결과에 반응하는 코드를 작성한다.
브라우저와 사용자 간 인터랙션이 아닌, 도메인에 국한된 DOM 이벤트를 생성할 수 있다.

## 웹 구성 요소와 렌더링 함수

---

### 코드 스타일

웹 구성 요소를 작성하기 위해서는 HTML 요소 확장을 위해 클래스 작업이 필요하므로, 함수형 프로그래밍에 익숙한 개발자에게는 익숙하지 않을 수 있다.
대신, 렌더링 함수를 가져와서 웹 구성 요소로 래핑하면 시나리오 흐름에 맞게 코드를 작성할 수 있다.
하지만, 함수형과 클래스형은 필요에 따라 함께 쓰일수도 있다.

### 테스트 가능 여부

Jest와 같은 JSDOM과 통합테스트 러너가 있으면 렌더링 함수를 쉽게 테스트 할 수 있다. 단, JSDOM은 사용자 정의 요소를 지원하지 않아 테스트 코드를 작성하기에 어려움이 있을 수 있다.

### 휴대성? 호환성?

다른 애플리케이션 간에 동일한 구성요소를 사용하는 경우를 고려하여 portable 해야함

### 커뮤니티

구성 요소 클래스는 대부분의 프레임워크에서 DOM 요소를 작성하는 표준 방식이므로, 사람들에게 익숙한 코드
