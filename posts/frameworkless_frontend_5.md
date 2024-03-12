---
title: "📚 프레임워크 없는 프론트엔드 개발 _ \n5. HTTP 요청, 6. 라우팅"
date: "2023-04-02"
description: "프레임워크 없는 프론트엔드 개발 도서 스터디 후 정리한 내용"
tags: ["study", "js", "react", "framework"]
thumbnail: "thumbnail.png"
---

# 5. HTTP 요청

## AJAX의 탄생

---

1999년 이전에는 서버에서 데이터를 가져와서 변경된 페이지를 보여주기 위해 전체 페이지를 다시 로드하는 방식을 사용했다. 이후 아웃룩, 지메일, 구글 등에서 페이지를 완전히 재로드하지 않고 **최초 페이지 로드 후, 필요한 데이터만 서버에서 로드하는** 새로운 기술을 사용했다. 이 기술을 AJAX(Asynchronous Javascript and XML)로 명명했다.

### AJAX의 핵심

- `XMLHttpRequest` 객체가 핵심
- 웹 애플리케이션은 서버 데이터를 XML 형식으로 수신, 현재는 JSON 형식 사용
  ![](/images/posts/frameworkless_frontend_5/1.jpeg)

## REST

---

REST는 웹 서비스를 디자인하고 개발하는 방법으로, REST API의 추상화는 **리소스**에 있다.
리소스는 **도메인 기준**으로 분리되며, 각 리소스는 특정 URI로 접근하면 읽거나 수정할 수 있다.

### PUT과 PATCH의 차이

PUT은 HTTP 요청 본문에 새로운 사용자의 모든 데이터를 전달하고, PATCH는 이전 상태와의 차이만 포함

(ex) POST로 새로운 데이터를 생성하고, 이후 수정 작업에서 PUT을 사용하면 POST로 생성된
모든 데이터를 새로 교체하는 것이고 PATCH를 사용하면 전송한 데이터만 수정됨

## 코드 예제

---

- HTTP 클라이언트를 직접 사용하는 대신, HTTP 요청을 `todos` 모델 객체에 래핑 (캡슐화)
- 이러한 방식은 컨트롤러를 독립적으로 테스트할 수 있으며, 모델 객체를 사용함으로써 가독성이 좋아짐

```jsx
// HTTP client application HTML
<html>
  <body>
    <button data-add>Add Todo</button>
    <button data-update>Update Todo</button>
  </body>
</html>
```

```jsx
// HTTP client application 메인 컨트롤러
import todos from './todos.js'

const NEW_TODO_TEXT = 'A simple todo Element'

const onAddClick = async () => {
	const result = await todos.create(NEW_TODO_TEXT)
	printResult('add todos', result)
}

const onUpdateClick = async() => {
	const list = await todos.list()
	const { id } = list[0]
	const new Todo = {
		id,
		completed: true
	}

	const result = await todos.update(newTodo)
	printResult('update todo', result)
}

...
```

```jsx
// todos 모델 객체
import http from "./http.js";

const HEADERS = {
  "Content-Type": "application/json",
};

const BASE_URL = "/api/todos";
const list = () => http.get(BASE_URL);

const create = (text) => {
  const todo = {
    text,
    completed: false,
  };
  return http.post(BASE_URL, todo, HEADERS);
};

const update = (newTodo) => {
  const url = `${BASE_URL}/${newTodo.id}`;
  return http.patch(url, newTodo, HEADERS);
};

export default { list, create, update };
```

### XMLHttpRequest

- W3C에서 처음으로 정의한 비동기 HTTP 요청의 표준 방법
- HTTP 클라이언트의 핵심은 `request()` 메서드
- `XMLHttpRequest` 는 완료된 요청에 대한 `onload()`, 오류로 끝나는 HTTP에 대한 `onerror()` , 타임아웃된 요청에 대한 `ontimeout()` 콜백이 있음
- HTTP 클라이언트의 API는 promise를 기반으로 하므로, `request` 메서드는 표준 XMLHttpRequest 요청을 새로운 Promise 객체로 묶는다.
  ![](/images/posts/frameworkless_frontend_5/2.jpeg)
  예제: Chapter5/00/http.js

### Fetch

Request나 Response 같은 많은 네트워크 객체에 대한 표준 정의를 제공하는 것이 주 목적으로, ServiceWorker나 Cache와 같은 다른 API와 인터렉션 가능

- 예제 코드: `Chapter05/01/http.js`
- XMLHttpRequest와 동일한 public API를 가지고 있으며, `window.fetch`가 Promise 객체를 반환
- 반환된 response 객체의 데이터 형식에 따라 text(), blob(), json() 같은 메서드를 사용함

### Axios

Axios와 다른 방식 과의 가장 큰 차이는 **브라우저와 Node.js에서 바로 사용할 수 있다는 것**이다.
Axios 또한 Promise 기반으로 하고 있어 Fetch와 유사하다.

- 예제 코드: `Chapter05/02/http.js`

### 아키텍처 검토

자바스크립트는 동적인 타입의 언어이지만, 모든 클라이언트는 HTTP 클라이언트 인터페이스를 기반으로 함

> 📒 구현이 아닌 인터페이스로 프로그래밍하라. - GOF의 디자인 패턴

![](/images/posts/frameworkless_frontend_5/3.jpeg)

라이브러리를 사용할 때는 항상 이에 대한 인터페이스를 생성하라. 필요시 새로운 라이브러리로 쉽게 변경하라 수 있다.

## 적합한 HTTP API 선택하는 방법

---

호환성(IE 지원 여부 등), Portable(실행 환경에 따라 ex.Node), 보안(axios의 경우 cross-site request 및 XSRF 보호 시스템 내장) 등을 고려

# 6. 라우팅

## 단일 페이지 애플리케이션 (SPA)

---

다중 페이지 애플리케이션의 경우, 페이지를 이동할 때 마다 모든 리소스를 다시 불러와야 한다.

단일 페이지 애플리케이션은 하나의 HTML 페이지로 실행되는 웹 애플리케이션으로, 사용자가 다른 뷰로 이동할 때 뷰를 동적으로 다시 그려 표준 웹 탐색 효과를 제공한다. 이러한 접근 방식은 다중 페이지 애플리케이션에서 페이지 간 탐색 시 사용자가 경험하는 지연을 제거하여 일반적으로 더 나은 사용자 경험을 제공한다.

![SPA는 서버와의 인터렉션을 위해 AJAX를 사용한다.](/images/posts/frameworkless_frontend_5/4.jpeg)

SPA는 서버와의 인터렉션을 위해 AJAX를 사용한다.

프레임워크는 라우팅 시스템을 통해 path를 정의하라 수 있는 시스템을 기본으로 제공한다.

아키텍처 관점에서 모든 라우팅 시스템은 다음 두가지 핵심 요소를 가진다.

1. 애플리케이션의 경로 목록을 수집하는 레지스트리
   가장 간단한 형태는 URL을 DOM 구성 요소에 매칭하는 객체
2. 현재 URL의 리스너
   URL이 변경되면 라우터는 본문(or 메인 컨테이너)의 내용을 현재 URL과 일치하는 경로에 바인딩 된
   컴포넌트로 교체

![KakaoTalk_Photo_2023-03-05-13-48-58 002.jpeg](/images/posts/frameworkless_frontend_5/6.jpeg)

## 프래그먼트 식별자를 이용한 Router 구현

---

### 프래그먼트 식별자

모든 URL은 프래그먼트 식별자라고 불리는 해시(#)로 시작하는 선택적 부분을 포함할 수 있다. 프래그먼트 식별자의 목적은 웹 페이지의 특정 섹션을 식별하는 것이다.

`[www.domain.org/foo.html#bar](http://www.domain.org/foo.html#bar)` 에서 bar가 프래그먼트 식별자이며, `id='bar'`로 HTML 요소 식별

프래그먼트 식별자가 포함된 URL을 탐색할 때 브라우저는 프래그먼트로 식별된 요소가 viewport의 맨 위에 오도록 페이지를 스크롤한다.

### 첫 번째 예제

- 헤더 앵커를 이용하면 URL이 `http://localhost:8080#/`에서 `http://localhost:8080#/list` 로 변경됨
- URL이 변경될 때 메인 컨테이너 내부에 현재 컴포넌트를 넣는 방식
- `Chapter06/00/index.js` 에서 라우터는 세가지 public 메서드(addRoute, setNotFound, start)로 이루어져 있으며, start 메서드는 라우터를 초기화 하고 URL의 변경을 listening 하기 시작함
- `Chapter06/00/router.js`
  - 현재 프래그먼트 식별자는 location 객체의 hash 속성에 저장되며, 현재 프래그먼트가 변경될 때 마다 알림을 받는 데 사용 가능한 `hasChange` 이벤트를 가지고 있음.
  - `checkRoutes` 메서드는 라우터 핵심 메서드로, 현재 프래그먼트와 일치하는 경로를 찾아서 경로가 발견되면 해당 컴포넌트로 메인 컨테이너를 대체하고, 없으면 notFound 함수를 호출함.
    ![KakaoTalk_Photo_2023-03-05-14-05-18.jpeg](/images/posts/frameworkless_frontend_5/7.jpeg)

### 프로그래밍 방식으로 탐색

헤더의 링크를 버튼으로 바꿔 애플리케이션 변경

- `Chapter06/00.1`
- 프로그래밍 방식으로 다른 뷰로 이동하도록 라우터에 새로운 메서드를 생성, 해당 메서드는 새 프래그먼트를 가져와 location 객체에서 replace 함
  ```jsx
  router.navigate = (fragment) => {
    window.location.hash = fragment;
  };
  ```
- Path Parameter 읽기 기능 추가 (정규식 사용)

## History API

---

[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)를 사용하여 개발자는 사용자 탐색 히스토리를 컨트롤 할 수 있다. 라우팅을 위해 History API를 사용하는 경우, 프래그먼트 식별자를 기반으로 경로를 지정할 필요 없이 실제 URL을 활용한다.
(ex. `http://localhost:8080/list/1/2`)

- `Chapter06/01`
- `pushState()` 는 히스토리 API에서 유일한 메서드로, 새 URL로 이동
- 프래그먼트 식별자를 사용한 router.js와 historyAPI를 사용한 router.js의 가장 큰 차이점은 URL이 변경될 때 알림을 받을 수 있는 DOM 이벤트가 없다는 것이므로, 비슷한 결과를 얻고자 `setInterval()`을 사용하여 경로 이름이 변경되었는지 정기적으로 확인
- 라우터 인터셉트는 이벤트 위임을 사용하여 모든 내부 탐색 앵커를 클릭

## Navigo

---

오픈 소스 라이브러리 이용, 생략

## 올바른 라우터 선택하는 방법

---

라우팅은 SPA에 있어서 신경계와 같은 역할을 한다. URL을 사용자가 보고 있는 화면과 매칭시킨다. 프레임워크로 작업할 때 이 점을 명심하자.

> 📒 프레임워크를 사용할 때는 라우팅을 위해 별도의 계층을 유지하는 것이 좋다. (관심사 분리!)
