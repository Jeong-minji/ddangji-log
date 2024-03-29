---
title: "📚 프레임워크 없는 프론트엔드 개발 _ \n7. 상태 관리, 8. 적합한 작업을 위한 적합한 도구"
date: "2023-04-15"
description: "프레임워크 없는 프론트엔드 개발 도서 스터디 후 정리한 내용"
tags: ["study", "js", "react", "framework"]
thumbnail: "thumbnail.png"
---

# 7. 상태 관리

여러 요소들을 함께 연결하는 데이터 또는 상태의 관리 방법을 알아야 한다. 프론트엔드 애플리케이션 또는 일반적으로 모든 종류의 클라이언트 애플리케이션(웹, 데스크톱, 모바일)의 효과적인 데이터 관리 방법을 상태 관리(state management)라고 한다.
상태 관리 코드에 적합한 아키텍처의 선택은 애플리케이션을 건강하게 유지 및 관리하는 데에 중요하다.

### TodoMVC 애플리케이션 리뷰

- `Chapter07/00/index.js`
- 상태 관리 코드는 events 객체에 정의되어 있으며, 이 객체는 메서드를 DOM 핸들러에 연결하고자 View 함수에 전달된다.

## 모델-뷰-컨트롤러

---

상태를 컨트롤러에서 유지하는 것은 좋은 방법이 아니므로, 해당 코드를 별도의 파일로 옮겨야 한다.

```jsx
const events = {
  addItem: (text) => {
    model.addItem(text); // state 변경하는 로직 분리
    render(model.getState()); // 변경된 값 불러오기
  },
};
```

- `Chapter07/00/model/model.js`
  - model 객체에서 추출한 값은 불변(immutable)하다. `getState()`가 호출될 때마다 복사본을 생성한 다음 `Object.freeze()`를 사용하여 값을 고정하고 이를 수행한다.
  - 객체를 복제하기 위해 JSON 객체의 `parse` 와 `serialize` 메서드를 사용했다. 상태를 문자열로 직렬화한 다음 JSON 문자열에서 객체를 파싱해 원리 객체의 깊은 복제를 가져온다. 실제 애플리케이션에서는 lodash의 `cloneDeep`을 사용하여 구현한다.
  - 불변 상태를 데이터에 전송하면 이 API 소비자는 상태를 조작할 때 public 메서드를 사용해야 한다. 이러한 방식으로 비즈니스 로직이 Model 객체에 완전히 포함되 있으면(응집되어 있으면) 애플리케이션의 다른 부분에 해당 코드가 흩어지지 않는다.
- MVC 패턴 스키마
  해당 워크플로우는 대부분 프론트엔드 애플리케이션에서 일반적이다.
  렌더링과 사용자 동작 사이의 루프를 렌더링 주기라고 한다.
  ![](/images/posts/frameworkless_frontend_7/1.jpeg)
  ![](/images/posts/frameworkless_frontend_7/2.jpeg)

## 옵저버블 모델

---

어떠한 객체의 상태가 변할 때, 그와 연관된 객체들에게 알람을 보내는 형식의 디자인 패턴으로, 함수로 직접 요청하는 것이 아니라 동작을 감시하다가 해당 동작이 발생하면 사전에 정의한 대로 즉각 수행하는 방식

MVC 기반으로 작성한 상태 관리 코드는 사용자가 동작을 수행할 때 마다 render 메서드를 수동으로 호출하기 때문에 모델과 컨트롤러 간 통합이 완벽하지 않다. 최적의 방법이 아닌 두 가지 이유는 다음과 같고, 다음 문제는 옵저버블 모델에서 해결된다.

1. 상태 변경 후에 렌더링을 수동으로 호출하는 방식은 오류가 발생하기 쉽다.
2. 동작이 상태를 변경하지 않을 때 (빈 항목을 리스트에 추가하는 등)에도 render 메서드가 호출된다.

- `Chapter07/01/model/model.js`
- Model 객체에서 상태를 얻는 유일한 방법은 리스터 콜백 추가라는 것을 알 수 있으며, 이 콜백은 가입할 때와 내부 상태가 변경될 때 마다 호출된다.
- `Chapter07/01/index.js`: 컨트롤러에서 옵저버블 모델 사용
  - render 메서드를 모델에 바인딩 하는 것은 해당 메서드를 리스너로 사용할 수 있다는 것이며, 뷰에 전달하는 이벤트로 사용하고자 모델에서 모든 메서드(addEventListener 제외)를 추출했다.
- 옵저버블 모델은 모델의 public interface를 수정하지 않고 컨트롤러에 새로운 기능을 추가하는데 유용

## 반응형 프로그래밍

---

반응형 패러다임의 구현은 애플리케이션이 모델 변경, HTTP 요청, 사용자 동작, 탐색 등과 같은 이벤트를 방출할 수 있는 옵저버블로 동작하도록 구현하는 것을 의미한다.

자신의 코드에서 여러 옵저버블을 사용하고 있다면, 이미 반응형 패러다임으로 작업하고 있는 것이다.

### 반응형 모델

- `Chapter07/02/model/model.js`: observableFactory를 기반으로 하는 새로운 모델 객체 예제
- Model 객체의 프록시를 생성하면, 여기서 원본 모델의 모든 메서드는 원본 메서드를 래핑하고 리스너를 호출하는 동일한 이름의 새 메서드를 생성한다.
- 프록시로 상태를 전달하고자 getter 함수르르 사용하여 모델에서 변경이 수행될 때 마다 현재 상태를 get

### 네이티브 프록시

자바스크립트는 Proxy 객체를 통해 프록시를 생성할 수 있도록 하며, 이를 이용하면 객체의 디폴트 동작을 사용자 정의 코드로 쉽게 래핑할 수 있다.

기본 객체를 래핑하는 프록시를 생성하려면 트랩(trap) 집합으로 구성된 핸들러가 필요하며, 트랩은 기본 객체의 기본 작업을 래핑하는 방법이다.

> 📒 Proxy 객체로 작업할 때는 속성을 수정하는 대신 속성을 교체해라.

![](/images/posts/frameworkless_frontend_7/3.jpeg)

### 이벤트 버스

이벤트 버스는 이벤트 주도 아키텍처(Event-Driven-Architecture)를 구현하는 하나의 방법으로, 모든 상태 변경은 시스템에서 전달된 이벤트로 나타난다. 이벤트는 발생한 상황을 식별하는 이름과, 이벤트 처리를 위해 의미 있는 정보를 담고 잇는 페이로드로 정의된다.

```jsx
const event = {
  type: "ITEM_ADDED",
  payload: "Buy Milk",
};
```

![](/images/posts/frameworkless_frontend_7/4.jpeg)
![](/images/posts/frameworkless_frontend_7/5.jpeg)

이벤트 버스 패턴의 기본 개념은 애프리케이션을 구성하는 ‘노드’들을 연결하는 단일 객체가 모든 이벤트를 처리한다는 것이고, 이벤트가 처리되면 결과가 연결된 모든 노드로 전송된다.
이 패턴에서는 모델에서 구독자(subscriber)로 전달되는 상태는 단일 객체라는 점에 유의해야 한다.

![](/images/posts/frameworkless_frontend_7/6.jpeg)

- 프레임워크 없는 예제
  - 모델은 입력으로 이전 상태와 이벤트를 받아 새로운 상태를 반환하는 ‘순수 함수’이다.
  - 이벤트 버스로 작업할 때는 코드를 쉽게 읽을 수 있도록 모델을 서브 모델로 분할한다.
  - 이전 버전과의 가장 큰 차이는 렌더링 함수에 이벤트를 제공하지 않고 dispatch 메서드를 사용하는 것으로, 뷰는 시스템에서 이벤트를 보낼 수 있다.
- Redux 기반 예제
  - 이벤트버스 ⇒ 스토어, 이벤트 ⇒ 액션, 모델 ⇒ 리듀서

## 상태 관리 전략 비교

---

![](/images/posts/frameworkless_frontend_7/7.jpeg)

### MVC

MVC는 구현하기 간단하며 도메인 비즈니스 로직에 대한 테스트 가능성과 관심사의 분리가 있다. 하지만 엄격한 패턴이 아니라서 컴포넌트의 정의와 그 사이의 관계가 불분명하여 “뷰와 컨트롤러의 차이점이 무엇인가?”에 대한 다양한 답변이 가능하다. 따라서 프레임워크 마다 약간씩 다른 버전의 MVC가 구현된다. (회색 영역의 간극)

### 반응형 프로그래밍

반응형 프로그래밍은 애플리케이션이 옵저버블 하다는 것이 기본이고, 동일한 타입의 객체로 작업하기 때문에 뛰어난 일관성을 보장해준다.

쉬운 아키텍처의 구현이 단순한 아키텍처의 구현과 동일한 의미는 아니다. 우리는 가장 쉬운 아키텍처 구현이 아닌, 요구 사항을 충족하는 가장 단순한 아키텍처를 구현해야 한다.

추상화로 작업하면 애플리케이션이 leak 되기 때문에 애플리케이션이 커지면 문제가 될 수 있는데, 이는 반응형 프로그래밍만의 문제는 아니고 중앙 추상화를 기반으로 하는 모든 패턴에서 발생한다.

“어떤 사소한 추상화라도 어느 정도 leak 된다” 애플리케이션이 커질수록 추상화에 적합하지 않은 부분이 생겨 확장성에 문제가 발생할 수도 있다.

### 이벤트 버스

모든 상태 변경은 이벤트에 의해 생성된다라는 엄격한 규칙을 기반으로 하므로 복잡성을 애플리케이션 크기에 비례하게 유지할 수 있지만, 다른 아키텍처에서는 애플리케이션이 커질수록 복잡성이 증가한다.

Micro service Architecture를 구현하기 위해 Event Driven Architecture를 사용하며, MSA는 느슨한 결합(의존성을 낮추고 응집성을 높히는)을 구현한다.

# 8. 적합한 작업을 위한 적합한 도구

## 자바스크립트 피로

---

자바스크립트 피로는 최신 라이브러리나 프레임워크를 따라가지 못하는 좌절감을 나타낸다.

자바스크립트 생태계의 지속적인 변화에는 몇 가지 이유가 있는데, 가장 중요한 것은 자바스크립트가 모든 곳에서 실행된다는 것이다. 가장 기본적인 브라우저, 서버, 모바일 앱, 블록체인, iOT 등 다양한 환경에서 실행되고 있어 다음과 같은 말도 있다.

> 📒 자바스크립트로 작성하라 수 있는 애플리케이션이라면 결국에는 모두 자바스크립트로 작성될 것이다. - Jeff Atwood

## 적합한 프레임워크

---

프레임워크를 선택할 때 항상 프레임워크 없는 옵션을 염두에 두자. 프레임워크가 항상 모든 시나리오에서 이점을 제공하지 않는다는 사실을 기억하자.
프레임워크가 충분히 좋아 보인다면 더이상 프레임워크를 찾는데 시간을 낭비할 필요가 없다. 완벽한 프레임워크를 찾고자 많은 시간과 비용이 소요될 수 있다.
애자일 선언문의 “프로세스와 도구에 대한 개별적 및 상호작용” 즉, 결정을 내리는 팀과 그들이 서로 상호작용 하는 방식에 집중할 것.

## Anti-Pattern

---

1. 노후화에 대한 두려움

   프로젝트 라이프사이클에서 새로운 비즈니스 요구를 수용하지 못하게 될 때 소프트웨어가 ‘레거시’가 된다고 생각한다(작가). 이럴 때 stangleApplication패턴을 사용하여 리팩토링하는 방법이 있다. 점차 프레임워크 없는 애플리케이션으로 대체하는 방식이다.

2. 하이프 곡선 따르기

3. 일반적인 방식

   회사의 개발자들이 실패를 두려워하여 익숙한 도구만 사용하려 하며, 이러한 의사 결정 접근 방식은 콘웨이 법칙의 결과중 하나이다.
   실패를 설계하는 조직은 이들 조직의 커뮤니케이션 구조의 복사본으로 설계를 하려는 경향이 있다.

4. 전문가

   회사의 거버넌스 모델에서 파생된 안티패턴은 전문가에 의존하는 것이다. 이 사람이 중요한 결정을 내리는데 필요한 모든 정보를 갖고 있지 않을 수 있으므로, 여러 사람과 협력으로 진행되어야 한다.
   자신이 아키텍처라면 프레임워크 관련 결정을 내릴 때 엔지니어와 협력해라. 반대로 엔지니어라면 아키텍처에게 협력을 요청하라.

5. 분노 주도 결정

   프로젝트가 실패했다면 사후 회의를 통해 실패의 이유를 이해하도록 노력하라. 일반적으로 프레임워크에는 아무런 잘못이 없다.

## 프레임워크 없는 운동 선언문

---

1. 소프트웨어의 가치는 코드 자체가 아닌 왜 코드가 존재하는지에 대한 이유다.

   기술 결정은 BMC에서 얻은 정보를 기반으로 해야하며, 회사에 프로젝트의 BMC가 없다면 작성하라.

2. 모든 결정은 콘텍스트를 고려해 내려야 한다.

   특정 콘텍스트에서 결정한 좋은 선택이 다른 콘텍스트에서는 나쁜 선택이 될 수도 있다.
   콘텍스트를 정의하는 가장 효과적인 방법은 비기능적 요구사항(NFR) 리스트를 사용하는 것이다. 기능적 요구사항이 동일하더라도 NFR이 다르다면 다른 기술이 필요할 수 있다.

3. 프레임워크의 선택은 기술적인 것이며, 비즈니스 요구를 고려해 기술 담당자가 결정해야 한다.

   TTM(Time To Market)을 줄이는데 필요한 속도와 품질 사이에서 타협접을 찾아야 한다.

4. 프레임워크를 선택하게 한 의사 결정 기준을 팀의 모든 구성원에게 알려야 한다.

   팀의 구성원 모두가 특정 결정을 내리게 된 기준을 알아야 유지 보수 시 문제가 없다. 이러한 의미 있는 결정을 추적할 수 있는 LADR을 사용하자.
