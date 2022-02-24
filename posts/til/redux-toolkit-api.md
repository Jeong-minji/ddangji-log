---
title: Redux Toolkit API 정리하기
date: "2022-01-18"
description: "리덕스 툴킷을 사용하는데 있어 공식문서의 API Reference를 정독하고 정리합니다."
tags: ["Redux", "Redux-toolkit", "API", "Reference"]
thumbnail: "redux_logo.png"
---

# 들어가며

---

**Redux Toolkit** 패키지는 다음과 같은 이유를 해결하기 위해 만들어졌습니다.

- 리덕스 **저장소(store) 구성이 너무 복잡**합니다.
- 리덕스에서 유용한 작업을 수행하기 위해 **여러 패키지를 추가해야 합니다.**
- 리덕스는 **많은 [보일러플레이트 코드](https://en.wikipedia.org/wiki/Boilerplate_code)를 요구합니다.**

이를 보면 Redux Toolkit은 **리덕스 사용에 있어 편의를 위해 만들어진 패키지라는 것**을 대략적으로 알 수 있습니다. 그렇기에 리덕스 툴킷은 앞으로의 프로젝트에 있어 유용히 사용할 예정에 있기 때문에 이를 학습할 필요성이 있습니다. 또한, 리덕스 툴킷 공식 문서를 볼 때, 자동 번역 시스템이 존재하고 별도의 번역본이 제공되지 않는 점도 이를 작성하는 이유가 될 수 있을 것 같습니다.

그러한 연유로 [리덕스 툴킷 공식문서](https://redux-toolkit.js.org/introduction/getting-started)의 **API Reference**를 참고하여 **각 API의 사용 이유와 활용법**에 대해 간단히 숙지할 예정입니다.

# API Reference

---

공식문서에서 API Reference는 **크게 저장소 설정 관련, 리듀서 및 액션 관련 그리고 나머지로 구분됩니다.** 해당 포스팅의 순서 또한 이를 따라갈 것이며 **번역과 동시에 요약을 진행합니다.**

## Store Setup(저장소 설정)

---

**초기 저장소(store) 설정**과 관련된 내용으로 **`configureStore`, `getDefaultMiddleware`, Immutability Middleware, Serializability Middleware**의 내용을 포함합니다.

### [`configureStore`](https://redux-toolkit.js.org/api/configureStore)

---

> A friendly abstraction over the standard **Redux `createStore` function** that adds good defaults to the store setup for a better development experience.

리덕스 표준에서 **[`createStore`](https://redux.js.org/api/createstore) 함수**로 익숙한 기능입니다. 보다 좋은 개발 경험을 위해 **저장소 설정에 있어 기본 값을 제공합니다.**

#### Parameters

---

`configureStore` 는 **단일 객체 형태**를 인자로 받으며, 다음 **5개의 필드를 갖습니다.**

- `reducer`: 저장소에 할당할 **리듀서에 대한 인자**입니다.
  - **단일 리듀서 함수**의 경우 이를 **루트 리듀서**로 활용합니다.
  - **슬라이스 리듀서 객체**의 경우 **[`combineReducers`](https://redux.js.org/api/combinereducers) 에 자동으로 전달**하여 루트 리듀서를 생성합니다.
- `middleware`: **리덕스 미들웨어 함수의 선택적 배열 인자**입니다.
  - 인자를 추가하면 **추가하고자 하는 미들웨어 함수를 자동으로 [`applyMiddleware`](https://redux.js.org/api/applymiddleware)로 넘겨서 이를 추가합니다.**
  - 인자가 없으면 **`getDefaultMiddleware` 에서 반환하는 미들웨어 함수를 적용**합니다.
- `devTools`: **Redux Devtools Extension에 대한 내용을 포함하는 인자**이며 기본값은 `true` 입니다.
  - `boolean` 값이 들어올 경우, **Extension에 대한 지원 활성화 여부를 판단**하는데 사용합니다.
  - 객체일 경우 **Extension은 활성화** 되고 **options 객체가 `composeWithDevtools()` 로 전달**됩니다.
- `preloadedState`: `createStore` 함수에 전달되는 **선택적 초기 상태 값**입니다.
- `enhancers`: **[Store Enhancer](https://redux.js.org/understanding/thinking-in-redux/glossary#store-enhancer)와 관련된 내용을 포함하는 인자**입니다.
  - 배열로 할당하면 **[`compose`](https://redux.js.org/api/compose) 함수에 의해 결합**되어 `createStore` 에 전달됩니다.
  - 콜백 함수일 경우, **인자가 기존 Enhancers 배열로 호출되며 새로운 Enhancer 배열을 반환**해야합니다.

#### Example

---

```ts
// Basic

import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./reducers";

const store = configureStore({ reducer: rootReducer });
// The store now has redux-thunk added and the Redux DevTools Extension is turned on
```

### [`getDefaultMiddleware`](https://redux-toolkit.js.org/api/getDefaultMiddleware)

---

> By default, `configureStore` **adds some middleware** to the Redux store setup **automatically.**

**미들웨어의 기본 값 목록**을 반환하는 함수로 **리덕스 저장소 설정에서 일부 미들웨어를 자동으로 추가합니다.**

`configureStore` 에서 `middleware` 필드에 나열된 미들웨어 외에는 추가하지 않기에 모든 `middleware` 를 정의해야합니다. 그런 의미에서 해당 함수는 **기본 미들웨어와 커스텀 미들웨어를 함께 추가하고자 할 때** 유용합니다.

예시를 보시면 이해가 더 쉽습니다.

#### Example

---

```ts
import { configureStore } from "@reduxjs/toolkit";

import logger from "redux-logger";

import rootReducer from "./reducer";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Store has all of the default middleware added, _plus_ the logger middleware
```

`middleware` 필드의 값으로 **`getDefaultMiddleware` 함수를 인자로 받는 콜백 함수**를 할당하고 `getDefaultMiddleware()` 함수를 통해 **기본 미들웨어**를 반환하고 해당 미들웨어 목록에 **`concat` 메소드**를 통해 `logger` 라는 미들웨어를 결합하였습니다. 이렇게 기존 미들웨어와 추가하고자 하는 미들웨어를 결합하여 반환할 수 있습니다.

주의할 점은 결합에 있어 **[`.concat(...)`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) 과 [`.prepend(...)`](https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend) 메서드를 지향**하고 [`spread operator`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax) 방식을 지양하는 것입니다. 이는 상황에 따라 후자는 형식 정보를 잃을 수 있기 때문이라고 합니다.

#### Included Default Middleware

---

그렇다면 위 `getDefaultMiddleware` 가 반환하는 **기본 미들웨어**는 어떤 것인지에 대해 알아봅시다. 이를 위해 잠시 리덕스 툴킷의 목표 중 하나를 간단하게 알아보고 넘어가겠습니다.

리덕스 툴킷은 고정된 **기본 값을 제공하여 일반적인 실수를 방지하고자 하는 것**을 목표 중 하나로 갖고 있습니다. 이를 위해 **개발 모드와 배포 모드를 구분**지어 기본 미들웨어를 다르게 제공합니다. **개발 모드**의 경우 **런타임 검사를 위해 제공되는 추가되는 다음의 일부 미들웨어를 포함한 상태로 반환합니다.**

- [Immutability check middleware](https://redux-toolkit.js.org/api/immutabilityMiddleware)
- [Serializability check middleware](https://redux-toolkit.js.org/api/serializabilityMiddleware)

그러므로 최종적으로 반환되는 기본 미들웨어는 다음과 같습니다.

```ts
// In Development mode
const middleware = [thunk, immutableStateInvariant, serializableStateInvariant];

// In Production mode
const middleware = [thunk];
```

#### Customizing the Included Middleware

---

제공되는 기본 미들웨어를 다음의 **두 가지 방법으로 커스터마이징**을 진행할 수도 있습니다. 해당 방법들은 **`getDefaultMiddleware` 함수의 객체 인자로서 제공**되며 객체 내부 필드에 값을 할당하는 것으로 가능합니다.

- 특정 미들웨어 필드에 **`false` 값을 할당하여 반환 배열에서 제외**할 수 있습니다.
- 특정 미들웨어 필드에 **객체 형태의 옵션 값을 할당하여 커스터마이징 된 옵션을 적용**할 수 있습니다.

위 커스터마이징은 다음과 같이 사용 가능합니다.

```ts
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { myCustomApiService } from "./api";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: myCustomApiService, // option 제공
      },
      serializableCheck: false, // 비활성화
    }),
});
```

### [Immutability Middleware](https://redux-toolkit.js.org/api/immutabilityMiddleware)

---

> A port of the [`redux-immutable-state-invariant`](https://github.com/leoasis/redux-immutable-state-invariant) middleware, customized for use with Redux Toolkit. Any detected mutations will be thrown as errors.

이전 `getDefaultMiddleware` 부분에서 언급된 `default middleware` 와 관련된 내용입니다. **`redux-immutable-state-invariant` 미들웨어의 포트**이며 리덕스 툴킷에서 사용하기 위해 커스터마이징 되었습니다.

> **포트**란 컴퓨터에서 외부의 다른 장비와 접속하기 위한 플러그를 의미한다는데 이러한 맥락에서 **해당 미들웨어를 불러오기 위한 것**이라고 해석했습니다.

위에서 봤듯이 `configureStore` 와 `getDefaultMiddleware` 에 의해 기본 미들웨어로 추가될 수 있고, 다음과 같은 형식의 **옵션**을 통해 **미들웨어의 동작을 커스터마이징** 할 수도 있습니다.

```ts
type IsImmutableFunc = (value: any) => boolean;

interface ImmutableStateInvariantMiddlewareOptions {
  isImmutable?: IsImmutableFunc;

  ignoredPaths?: string[];

  warnAfter?: number;

  ignore?: string[];
}
```

#### Exports

---

`createImmutableStateInvariantMiddleware` 를 통해 **인스턴스를 별도로 생성**하고 옵션을 추가할 수도 있습니다. 이는 대개 `getDefaultMiddleware` 가 이를 진행하기에 불필요할 것입니다.

```ts
// file: exampleSlice.ts
import { createSlice } from "@reduxjs/toolkit";

export const exampleSlice = createSlice({
  name: "example",
  initialState: {
    user: "will track changes",
    ignoredPath: "single level",
    ignoredNested: {
      one: "one",
      two: "two",
    },
  },
  reducers: {},
});

export default exampleSlice.reducer;

// file: store.ts
import {
  configureStore,
  createImmutableStateInvariantMiddleware,
} from "@reduxjs/toolkit";

import exampleSliceReducer from "./exampleSlice";

const immutableInvariantMiddleware = createImmutableStateInvariantMiddleware({
  ignoredPaths: ["ignoredPath", "ignoredNested.one", "ignoredNested.two"],
});

const store = configureStore({
  reducer: exampleSliceReducer,
  // Note that this will replace all default middleware
  middleware: [immutableInvariantMiddleware],
});
```

위 예시를 `getDefaultMiddleware` 를 활용하여 다른 미들웨어를 제거하지 않고 동일하게 진행할 수 있습니다.

```ts
import { configureStore } from "@reduxjs/toolkit";

import exampleSliceReducer from "./exampleSlice";

const store = configureStore({
  reducer: exampleSliceReducer,
  // This replaces the original default middleware with the customized versions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: {
        ignoredPaths: ["ignoredPath", "ignoredNested.one", "ignoredNested.two"],
      },
    }),
});
```

그리고 **특정 값을 변경할 수 없는 가에 대한 기본적인 사항**은 다음과 같습니다.

```ts
return (
  typeof value !== "object" || value === null || typeof value === "undefined"
);
```

이는 **원시 타입**에 대해 `true` 를 반환합니다.

### Serializability Middleware

---

> A custom middleware that detects if any non-serializable values have been included in state or dispatched actions, modeled after `redux-immutable-state-invariant`. Any detected non-serializable values will be logged to the console.

**직렬화 되지 않는 값이 `state` 혹은 `dispatch` 된 `action` 에 포함되어 있는 지에 대한 내용**을 감지하고 `console` 에 기록합니다.

마찬가지로 `default middleware` 중 하나이며, `configureStore` 와 `getDefaultMiddleware` 에 의해 기본 미들웨어로 추가되고 커스터마이징 또한 가능합니다.

```ts
interface SerializableStateInvariantMiddlewareOptions {
  isSerializable?: (value: any) => boolean;

  getEntries?: (value: any) => [string, any][];

  ignoredActions?: string[];

  ignoredActionPaths?: string[];

  ignoredPaths?: string[];

  warnAfter?: number;

  ignoreState?: boolean;
}
```

#### `createSerializableStateInvariantMiddleware​`

---

위와 동일합니다. 해당 미들웨어의 인스턴스를 만들 수 있으며, `getDefaultMiddleware` 에서 이미 호출하고 있기에 직접 호출할 필요는 없습니다.

```ts
import { Iterable } from "immutable";
import {
  configureStore,
  createSerializableStateInvariantMiddleware,
  isPlain,
} from "@reduxjs/toolkit";
import reducer from "./reducer";

// Augment middleware to consider Immutable.JS iterables serializable
const isSerializable = (value: any) =>
  Iterable.isIterable(value) || isPlain(value);

const getEntries = (value: any) =>
  Iterable.isIterable(value) ? value.entries() : Object.entries(value);

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
  getEntries,
});

const store = configureStore({
  reducer,
  middleware: [serializableMiddleware],
});
```

#### `isPlain`

---

주어지는 값이 **`plain value`으로 간주되는 지에 대한 여부**를 판단합니다.

```ts
import isPlainObject from "./isPlainObject";

export function isPlain(val: any) {
  return (
    typeof val === "undefined" ||
    val === null ||
    typeof val === "string" ||
    typeof val === "boolean" ||
    typeof val === "number" ||
    Array.isArray(val) ||
    isPlainObject(val)
  );
}
```

## Reducers and Actions(리듀서와 액션)

---

**`reducer` 및 `action` 과 관련 있는 내용**으로 **`createReducer`, `createAction`, `createSlice`, `createAsyncThunk`, `createEntityAdapter`의 내용**을 포함합니다.

### [`createReducer`](https://redux-toolkit.js.org/api/createReducer)

---

> **A utility that simplifies creating Redux reducer functions.** It uses **Immer** internally to drastically **simplify immutable update logic by writing "mutative" code** in your reducers, and supports directly mapping specific action types to case reducer functions that will update the state when that action is dispatched.

**리듀서 함수를 만드는 것을 간단하게 해주는 유틸리티**입니다. 해당 함수는 내부에 **Immer 라이브러리**를 사용하여 리듀서에 **변화 가능한 코드를 작성하고**, 이를 통해 **변경 불가능한 로직 대폭 단순화 할 수 있습니다.** 또한 **특정 액션들을 상태 업데이트를 위한 리듀서 함수로 매핑**하여 `dispatch` 될 때 이를 실행할 수 있도록 합니다.

대개 리듀서 함수는 다음과 같이 생성할 수 있습니다.

```ts
const initialState = { value: 0 };

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "increment":
      return { ...state, value: state.value + 1 };
    case "decrement":
      return { ...state, value: state.value - 1 };
    case "incrementByAmount":
      return { ...state, value: state.value + action.payload };
    default:
      return state;
  }
}
```

위 예시의 경우 `switch` 문을 활용하여 `counterReducer` 라는 리듀서를 작성하였습니다. 이러한 경우 다음과 같은 문제를 야기할 수 있다고 합니다.

> This approach works well, but is a bit **boilerplate-y and error-prone.** For instance, it is easy to forget the `default` case or setting the initial state.

리덕스 툴킷의 필요 이유와 문맥상 **보일러플레이트 코드 측면에서의 문제와 에러를 발생시키는 경향이 있다**고 이해할 수 있을 것 같습니다. 이에 대한 예시로 **`default` 구문이나 초기값을 명시를 잊는 것**을 말할 수 있습니다.

이러한 문제를 `createReducer` 를 통해 해결할 수 있고, **두 가지(Builder callback notation, Object notation)의 리듀서 정의 방식**을 갖고 있습니다. 이 중 **Builder callback notation**이 선호됩니다.

#### Builder Callback Notation

---

해당 방식은 **`builder` 라는 객체**를 인자로 받아 사용하는데, `builder` 객체는 **리듀서가 처리할 액션의 유형을 정의하기 위한 `addCase` , `addMatcher` , `addDefault` 함수를 포함**합니다. 또한 타입스크립트나 대부분의 IDE에서 효과적인데, 이는 `builder callback` 방식을 지향하는 이유 중 하나입니다.

`builder callback` 방식은 다음의 인자로 구성됩니다.

- **initialState:** **초기값을 설정**할 수 있는 영역으로, **리듀서가 처음 호출될 때 사용되는 값**입니다. 해당 인자는 `State | (() => State)` 형태를 갖는데, 후자의 경우 **초기화 지연 함수**로 사용될 수 있습니다. 해당 방식은 주로 **초기값이 `undefined` 로 할당될 때** 사용되며, `localStorage` 등에서 초기값을 읽어올 때 유용합니다.

> **lazy Initialization:** _which should **return an initial state value when called.**_
>
> - **= 초기화 지연:** 객체 생성, 값 계산, 또는 일부 기타 **비용이 많이 소모되는 과정을 필요 시점까지 지연시키는 방식**을 말합니다.

- **builderCallback:** 리듀서를 정의할 메소드를 포함한 **`builder` 객체**를 받는 함수입니다.

해당 메소드들은 다음과 같습니다.

- `builder.addCase`: **단일 액션 유형을 다루기 위한 리듀서를 추가**합니다. 해당 함수는 `builder.addMatcher` 혹은 `builder.addDefaultCase` 보다 앞에 작성해야합니다. 다음의 인자를 갖습니다.
  - **actionCreator:** 작업 유형을 결정하는 **문자열의 일반 액션 유형** 혹은 **`createAction` 에 의해 생성된 액션**이 할당됩니다.
  - **reduce:** 실제 리듀서 함수
- `builder.addMatcher`: `action.type` 이 일치하는 경우에 실행하는 것 외에 **콜백 함수의 반환 값으로** 리듀서 실행 여부를 결정할 수 있습니다. 여러 `match reducer` 가 일치하면, `case reducer` 가 이미 일치하더라도 **정의된 순서대로 실행됩니다.** `builder.addMatcher` 는 `addCase` 와 `addDefaultCase` 사이에 와야합니다. 또한, 다음의 인자를 갖습니다.
  - **matcher**: 매칭시키는 함수입니다. 타입스크립트에선 [type predicate](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates) function이어야 합니다.
  - **reducer**: 실제 리듀서 함수
- `builder.addDefaultCase`: 말그대로 `default case` 를 정의합니다. 이는 **`switch` 문의 `default`** 와 같이 **어떤 리듀서와도 매칭이 되지 않았을 때, 실행되는 액션을 포함합니다.** 다음의 인자를 갖습니다.
  - **reducer**: `default case` 의 리듀서 함수입니다.

#### Map Object Notation

---

`Map Object` 방식은 **`key` 가 `action.type` 이고 값이 해당 액션 타입을 다루는 리듀서 함수인 객체**를 활용합니다. 해당 방식이 보다 더 간략하지만 **타입스크립트가 아닌 자바스크립트에서만 쓸 수 있다는 점과, IDE와의 통합이 적은 이유**로 `builder callback` 방식을 지향합니다. 그리고 다음의 인자를 갖습니다.

- **initialState:** `builder callback` 방식의 인자와 동일합니다.
- **actionsMap: 액션 타입에서 리듀서 함수로 매핑되어 있는 객체** 형태의 인자입니다. 각 요소는 하나의 액션 타입을 다룹니다.
- **actionMatchers: `{matcher, reducer}` 형태로 정의된 객체 배열** 형태의 인자입니다. 일치하는 모든 리듀서는 일치 여부에 관계없이 독립적으로 순서대로 실행됩니다.
- **defaultCaseReducer: 앞의 두 유형의 리듀서가 실행되지 않은 경우 실행**되는 `default case` 리듀서입니다.

`Map Object` 방식은 다음과 같이 사용 가능합니다.

```ts
const counterReducer = createReducer(0, {
  increment: (state, action) => state + action.payload,
  decrement: (state, action) => state - action.payload,
});

// Alternately, use a "lazy initializer" to provide the initial state
// (works with either form of createReducer)
const initialState = () => 0;
const counterReducer = createReducer(initialState, {
  increment: (state, action) => state + action.payload,
  decrement: (state, action) => state - action.payload,
});
```

`createAction` 을 통해 작성된 액션은 다음과 같은 방법으로 `key` 에 대입할 수 있습니다.

```ts
const increment = createAction("increment");
const decrement = createAction("decrement");

const counterReducer = createReducer(0, {
  [increment]: (state, action) => state + action.payload,
  [decrement.type]: (state, action) => state - action.payload,
});
```

**actionMatchers와 defaultCaseReducer** 를 추가하여 사용하는 방식은 다음과 같습니다.

```ts
const isStringPayloadAction = (action) => typeof action.payload === "string";

const lengthOfAllStringsReducer = createReducer(
  // initial state
  { strLen: 0, nonStringActions: 0 },
  // normal reducers
  {
    /*...*/
  },
  //  array of matcher reducers
  [
    {
      matcher: isStringPayloadAction,
      reducer(state, action) {
        state.strLen += action.payload.length;
      },
    },
  ],
  // default reducer
  (state) => {
    state.nonStringActions++;
  }
);
```

#### Direct State Mutation

---

리덕스는 **함수가 순수해야 하고 상태가 불변해야 한다는 점**이 있습니다. 이는 **보다 더 예측 가능하고 관찰 가능한 상태**를 만드는데 필수지만, 때로는 이러한 요소가 **업데이트 구문을 어색하게 만들기도 합니다.** 아래 예시를 보면서 확인해봅시다.

```ts
const todosReducer = createReducer([] as Todo[], (builder) => {
  builder
    .addCase(addTodo, (state, action) => {
      const todo = action.payload;
      return [...state, todo];
    })
    .addCase(toggleTodo, (state, action) => {
      const index = action.payload;
      const todo = state[index];
      return [
        ...state.slice(0, index),
        { ...todo, completed: !todo.completed },
        ...state.slice(index + 1),
      ];
    });
});
```

자바스크립트 ES6 문법 중 [`spread syntax`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) 를 안다면 `addTodo` 리듀서는 해석하기 쉬울 것 입니다. 하지만 `toggleTodo` 의 경우엔 좀 더 복잡한 구조 때문에 이를 이해하기엔 좀 어려움이 있을 것 같습니다.

이를 보다 편리하게 하기 위해 `createReducer` 는 내부에 [immer](https://github.com/immerjs/immer)라는 라이브러리를 통해 **상태를 직접 변경하는 방식으로 리듀서를 작성할 수 있도록 합니다.** 실제로 리듀서는 **동등한 복사 작업으로 변환하는 프록시 상태를 수신합니다.**

```ts
import { createAction, createReducer } from "@reduxjs/toolkit";

interface Todo {
  text: string;
  completed: boolean;
}

const addTodo = createAction<Todo>("todos/add");
const toggleTodo = createAction<number>("todos/toggle");

const todosReducer = createReducer([] as Todo[], (builder) => {
  builder
    .addCase(addTodo, (state, action) => {
      // This push() operation gets translated into the same
      // extended-array creation as in the previous example.
      const todo = action.payload;
      state.push(todo);
    })
    .addCase(toggleTodo, (state, action) => {
      // The "mutating" version of this case reducer is much
      //  more direct than the explicitly pure one.
      const index = action.payload;
      const todo = state[index];
      todo.completed = !todo.completed;
    });
});
```

위 예시와 같이 **직접 상태값을 변경하는 것**으로 상태 변화를 유도할 수 있습니다. 하지만 Immer의 경우에도 간과하면 안되는 요소가 있습니다. 우리는 상태값을 변경시키거나 새 상태값을 반환 함으로서 변화를 유도할 수 있지만 **이를 동시에 진행하면 안됩니다.** 예를 들어 다음의 경우는 앞의 예외를 반영합니다.

```ts
import { createAction, createReducer } from "@reduxjs/toolkit";

interface Todo {
  text: string;
  completed: boolean;
}

const toggleTodo = createAction<number>("todos/toggle");

const todosReducer = createReducer([] as Todo[], (builder) => {
  builder.addCase(toggleTodo, (state, action) => {
    const index = action.payload;
    const todo = state[index];

    // This case reducer both mutates the passed-in state...
    todo.completed = !todo.completed;

    // ... and returns a new value. This will throw an
    // exception. In this example, the easiest fix is
    // to remove the `return` statement.
    return [...state.slice(0, index), todo, ...state.slice(index + 1)];
  });
});
```

#### Multiple Case Reducer Execution

---

기본적으로 `createReducer` 는 **하나의 액션 타입과 단일 리듀서 케이스를 매칭시키고,** 하나의 리듀서당 하나의 액션만을 실행합니다. 하지만 **action matchers** 를 사용할 경우 **여러 matchers로 하나의 액션을 다룰 수 있습니다.**

이러한 맥락에서 액션이 디스패치 되면 다음과 같이 행동합니다.

- 액션 타입과 **정확히 일치하는게 있다면,** 대응하는 리듀서 케이스가 우선적으로 실행됩니다.
- `true` 를 반환한 **모든 matcher는 정의된 순서대로 실행됩니다.**
- `default` 리듀서 케이스가 우선적으로 제공되고, **여타 케이스 혹은 matcher 리듀서가 실행되지 않으면, 기본 리듀서가 실행됩니다.**
- 케이스 혹은 matcher 리듀서가 실행되지 않으면 **원래 기존 상태 값을 반환합니다.**

다음 예시를 보시면 이해가 더 편합니다.

```ts
import { createReducer } from "@reduxjs/toolkit";

const reducer = createReducer(0, (builder) => {
  builder
    .addCase("increment", (state) => state + 1)
    .addMatcher(
      (action) => action.type.startsWith("i"),
      (state) => state * 5
    )
    .addMatcher(
      (action) => action.type.endsWith("t"),
      (state) => state + 2
    );
});

console.log(reducer(0, { type: "increment" }));
// Returns 7, as the 'increment' case and both matchers all ran in sequence:
// - case 'increment": 0 => 1
// - matcher starts with 'i': 1 => 5
// - matcher ends with 't': 5 => 7
```

#### Logging Draft State Values

---

개발 과정에서 개발자가 `console.log(state)` 를 작성하는 것은 흔한 일입니다. 그러나 브라우저는 **프록시를 어려운 형태로 보여주고,** 이는 **Immer에 기반한 상태를 콘솔을 통해 확인하는 것을 어렵게 합니다.**

이러한 맥락에서 우리가 `createSlice` 혹은 `createReducer` 를 사용할 때, **Immer 라이브러리로부터 다시 내보내기 위해 `current` 를 사용할 수 있습니다.** `current` 는 **현재 Immer 상태 값에 대한 별도 사본을 생성**하고 이를 `console.log` 등을 통해 **기록할 수 있습니다.**

```ts
import { createSlice, current } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "todos",
  initialState: [{ id: 1, title: "Example todo" }],
  reducers: {
    addTodo: (state, action) => {
      console.log("before", current(state));
      state.push(action.payload);
      console.log("after", current(state));
    },
  },
});
```

### [`createAction`](https://redux-toolkit.js.org/api/createAction)

---

> A helper function for **defining a Redux action type and creator.**

리덕스 **액션 타입과 생성자를 정의해주는 함수입니다.**

```ts
function createAction(type, prepareAction?);
```

보통 리덕스에서 액션 정의는 **액션 타입을 정의한 상수와 액션 생성자 함수를 별도로 선언하는 방식**을 갖습니다.

```ts
const INCREMENT = "counter/increment"; // 액션 타입 정의 상수

// 액션 생성자 함수
function increment(amount: number) {
  return {
    type: INCREMENT,
    payload: amount,
  };
}

const action = increment(3);
// { type: 'counter/increment', payload: 3 }
```

`createAction` 함수는 이 두 선언을 결합했으며, **액션 타입을 인자로 받고 액션 생성자를 리턴합니다.** 해당 액션 생성자는 **인자 없이 호출되거나 `payload` 형태로 포함될 수 있습니다.** 또한, **문자열**로 변환될 경우(`toString()` 등에 의해) 이를 **오버라이드 할 수 있습니다.**

```ts
import { createAction } from "@reduxjs/toolkit";

const increment = createAction<number | undefined>("counter/increment");

let action = increment();
// { type: 'counter/increment' }

action = increment(3);
// returns { type: 'counter/increment', payload: 3 }

console.log(increment.toString());
// 'counter/increment'

console.log(`The action type is: ${increment}`);
// 'The action type is: counter/increment'
```

#### Using Prepare Callbacks to Customize Action Contents

---

기본적으로, 생성된 **액션 생성자는 `action.payload` 형태의 단일 인자만을 허용합니다.** 이 경우 `payload` 값을 커스터마이징 하기 위해 **추가적인 로직을 작성할 수 있습니다.** 해당 로직은 `createAction` 의 **두 번째 인자로 `prepare callback` 을 받아** `payload` 값을 구성할 수 있습니다.

```ts
import { createAction, nanoid } from "@reduxjs/toolkit";

const addTodo = createAction("todos/add", function prepare(text: string) {
  return {
    payload: {
      text,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    },
  };
});

console.log(addTodo("Write more docs"));
/**
 * {
 *   type: 'todos/add',
 *   payload: {
 *     text: 'Write more docs',
 *     id: '4AJvwMSWEHCchcWYga3dj',
 *     createdAt: '2019-10-03T07:53:36.581Z'
 *   }
 * }
 **/
```

두 번째 인자가 제공되는 경우, 해당 인자는 **`prepare callback` 으로 전달**되고, 해당 콜백은 **`payload` 필드의 객채 형태를 반환합니다.**(그렇지 않으면, `undefined` 로 정의됩니다.) 또한 해당 객체는 **`meta` 혹은/그리고 `error` 필드를 가질 수 있습니다.** `meta` 필드는 **액션에 대한 추가적인 정보**를
`error` 의 경우엔 **액션 실패에 대한 세부 정보**를 포함할 수 있습니다. 위 세 가지 필드는 [Flux Standard Actions](https://github.com/redux-utilities/flux-standard-action#actions) 기준을 따른다고 합니다.

#### Usage with createReducer()

---

위에서 말했듯이, 액션 생성자는 문자열 형태로 변환할 수 있기 때문에 **`createReducer` 에서 각 리듀서 케이스의 키 값으로 바로 사용할 수 있습니다.**

```ts
import { createAction, createReducer } from "@reduxjs/toolkit";

const increment = createAction<number>("counter/increment");
const decrement = createAction<number>("counter/decrement");

const counterReducer = createReducer(0, (builder) => {
  builder.addCase(increment, (state, action) => state + action.payload);
  builder.addCase(decrement, (state, action) => state - action.payload);
});
```

#### Non-String Action Types

---

원칙적으로 리덕스에선 모든 값 형태(`number` , `symbol` 등)를 액션 타입으로 사용할 수 있습니다.(하지만 최소한 직렬화 함을 권장합니다.)

그러나 리덕스 툴킷의 경우, **문자열 형태의 액션 타입을 사용**한다고 가정합니다. 만약, 다른 형태의 액션 타입을 사용할 경우 다음과 같은 상황이 발생할 수 있습니다.

```ts
const INCREMENT = Symbol("increment");
const increment = createAction(INCREMENT);

increment.toString();
// returns the string 'Symbol(increment)',
// not the INCREMENT symbol itself

increment.toString() === INCREMENT;
// false
```

그렇기에 **문자열 형태가 아닌 액션 생성자**를 `createReducer` 의 리듀서 케이스 키로 사용할 수 없습니다. 그렇기에 리덕스 툴킷에서는 **문자열 액션 타입만 사용하는 것이 좋습니다.**

```ts
const INCREMENT = Symbol("increment");
const increment = createAction(INCREMENT);

const counterReducer = createReducer(0, {
  // The following case reducer will NOT trigger for
  // increment() actions because `increment` will be
  // interpreted as a string, rather than being evaluated
  // to the INCREMENT symbol.
  [increment]: (state, action) => state + action.payload,

  // You would need to use the action type explicitly instead.
  [INCREMENT]: (state, action) => state + action.payload,
});
```

#### actionCreator.match

---

`createAction` 에 의해 생성된 **모든 액션 생성자는 `.match(action)` 메소드를 갖습니다.** 해당 `.match` 메소드는 전달 받은 액션이 액션 생성자가 생성할 작업과 일치하는 타입인지 확인합니다.

**As a TypeScript Type Guard**

---

`match` 메소드는 [TypeScript type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)이며 **액션의 `payload` 의 타입을 식별하는데 사용할 수 있습니다.** 해당 작업은 **미들웨어의 커스텀이 필요할 때** 유용하게 사용할 수 있습니다.

```ts
import { createAction, Action } from "@reduxjs/toolkit";

const increment = createAction<number>("INCREMENT");

function someFunction(action: Action) {
  // accessing action.payload would result in an error here
  if (increment.match(action)) {
    // action.payload can be used as `number` here
  }
}
```

**With redux-observable**

---

또한, `match` 메소드는 **`filter` 메소드로서도 사용될 수 있으며,** redux-observable과 함께 사용할 때 유용합니다.

```ts
import { createAction, Action } from "@reduxjs/toolkit";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";

const increment = createAction<number>("INCREMENT");

export const epic = (actions$: Observable<Action>) =>
  actions$.pipe(
    filter(increment.match),
    map((action) => {
      // action.payload can be safely used as number here (and will also be correctly inferred by TypeScript)
      // ...
    })
  );
```

### [`createSlice`](https://redux-toolkit.js.org/api/createSlice)

---

`createSlice` 는 인자로 **초기값과 리듀서 함수 객체, 슬라이스 명**을 받아 **액션 생성자와 액션 타입에 대응하는 리듀서와 상태값**들을 자동으로 생성합니다.

해당 API는 리덕스 로직 작성에서 가장 **기본적인 접근 방식**이며, 내부적으로 **`createAction` 과 `createReducer`** 를 사용하고 있기에 Immer 라이브러리 또한 활용할 수 있습니다.

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState = { value: 0 } as CounterState;

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment(state) {
      state.value++;
    },
    decrement(state) {
      state.value--;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

#### Parameters

---

`createSlice` 는 다음의 필드를 포함하는 **단일 객체 형태**의 매개변수를 받습니다.

```ts
function createSlice({
    // A name, used in action types
    name: string,
    // The initial state for the reducer
    initialState: any,
    // An object of "case reducers". Key names will be used to generate actions.
    reducers: Object<string, ReducerFunction | ReducerAndPrepareObject>
    // A "builder callback" function used to add more reducers, or
    // an additional object of "case reducers", where the keys should be other
    // action types
    extraReducers?:
    | Object<string, ReducerFunction>
    | ((builder: ActionReducerMapBuilder<State>) => void)
})
```

- `initialState`: 슬라이스의 **초기값**에 해당합니다. **초기화 지연 함수 형태**로도 할당이 가능합니다.
- `name`: 슬라이스의 이름입니다. 해당 이름은 **액션 타입의 접두사**로 활용됩니다.
- `reducers`: 리덕스 케이스 **리듀서 함수들을 포함하는 하나의 객체**입니다. 키는 앞의 `name` 과 합쳐 액션 타입 이름을 정의하는데 사용되고, 해당 타입명과 일치하는 액션이 디스패치 되면 해당하는 리듀서가 실행됩니다.
  - **Customizing Generated Action Creators:** `payload` 값 형태를 변경하고 싶다면 `prepare callback` 을 사용할 수 있습니다. 그렇게 되면 키에 해당하는 값은 객체 형태로 바뀌고 `reducer` 와 `prepare` 필드를 추가해야 합니다. 각 필드 중, `reducer` 필드에는 실행시킬 리듀서 함수를 추가하고, `prepare` 필드에는 변경될 `payload` 의 형식을 반환하는 함수를 할당합니다.

```ts
import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

interface Item {
  id: string;
  text: string;
}

const todosSlice = createSlice({
  name: "todos",
  initialState: [] as Item[],
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<Item>) => {
        state.push(action.payload);
      },
      prepare: (text: string) => {
        const id = nanoid();
        return { payload: { id, text } };
      },
    },
  },
});
```

- `extraReducers`: 리덕스의 핵심 개념 중 하나는 각 슬라이스 리듀서가 상태 슬라이스를 **소유**하고 많은 슬라이스 리듀서가 동일한 작업 유형에 독립적으로 응답할 수 있다는 것입니다. `extraReducers` 는 **생성된 타입만이 아닌 다른 액션 타입들에 응답할 수 있도록** 합니다.
  - 해당 필드에 지정된 리듀서들은 **외부 액션의 참조**를 의미하므로, `slice.action` 에 **액션을 생성하지 않습니다.**
  - `extraReducers` 또한 `createReducer` 로 전달되기 때문에 **안전한 상태 변경이 가능합니다.**
  - 만약 `reducers` 와 `extraReducers` 필드에 같은 액션 유형이 존재하는 경우, `reducers` 필드의 함수가 이를 다룹니다.

`extraReducers` 역시 `createReducer` 에서와 마찬가지로 **Builder callback notation과 Map object notation을 활용합니다.**

#### The `extraReducers` "builder callback" notation

---

`extraReducers` 를 사용하는데 있어 권장되는 방식은 **`ActionReducerMapBuilder` 인스턴스를 받는 콜백을 사용하는 것**입니다. 또한 해당 builder notation은 **matcher 와 default case 리듀서를 추가할 수 있는 유일한 방법**입니다.

리덕스 툴킷에서는 **타입스크립트 지원이 더 우수하다**는 측면에서 해당 API 사용을 권장하고 있습니다. 특히, `createAction` 혹은 `createAsyncThunk` 에 의해 생성된 액션들과 함께 사용할 때 유용합니다.

#### The `extraReducers` "map object" notation

---

마찬가지로 `reducers` 와 `extraReducers` 는 리덕스 리듀서 케이스 함수를 포함하는 객체를 할당할 수 있습니다. 하지만 키는 반드시 리덕스 문자열 액션 타입이어야 하고 `createSlice` 는 해당 파라미터를 포함하는 리듀서를 위한 액션 타입이나 액션 생성자를 자동 생성하지 않습니다.

`createAction` 에 의해 생성된 액션 생성자는 **computed property syntax**를 통해 바로 키로 사용할 수 있습니다.

#### Return Value

---

`createSlice` 는 다음 **객체 형태의 값을 반환합니다.**

```ts
{
    name : string,
    reducer : ReducerFunction,
    actions : Record<string, ActionCreator>,
    caseReducers: Record<string, CaseReducer>.
    getInitialState: () => State
}
```

`reducers` 인자에 정의된 각 함수엔 **해당하는 액션 생성자**가 있는데, 해당 액션 생성자는 `createAction` 에 의해 생성되고 동일한 기능(맥락상 `createAction` 을 의미하는 것 같습니다.)을 사용하여 반환 값의 `actions` 필드에 포함됩니다.

생성된 `reducer` 함수는 슬라이스 리듀서로서 리덕스의 `combineReducers` 에 전달되기에 적합합니다.

더 큰 코드 베이스에서 참조 검색을 쉽게 하기 위해 액션 생성자를 구조 분해 할당하는 것을 고려할 수 있습니다.

#### Exmaples

```ts
import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import { createStore, combineReducers } from "redux";

const incrementBy = createAction<number>("incrementBy");
const decrementBy = createAction<number>("decrementBy");

const counter = createSlice({
  name: "counter",
  initialState: 0 as number,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    multiply: {
      reducer: (state, action: PayloadAction<number>) => state * action.payload,
      prepare: (value?: number) => ({ payload: value || 2 }), // fallback if the payload is a falsy value
    },
  },
  // "builder callback API", recommended for TypeScript users
  extraReducers: (builder) => {
    builder.addCase(incrementBy, (state, action) => {
      return state + action.payload;
    });
    builder.addCase(decrementBy, (state, action) => {
      return state - action.payload;
    });
  },
});

const user = createSlice({
  name: "user",
  initialState: { name: "", age: 20 },
  reducers: {
    setUserName: (state, action) => {
      state.name = action.payload; // mutate the state all you want with immer
    },
  },
  // "map object API"
  extraReducers: {
    // @ts-expect-error in TypeScript, this would need to be [counter.actions.increment.type]
    [counter.actions.increment]: (
      state,
      action /* action will be inferred as "any", as the map notation does not contain type information */
    ) => {
      state.age += 1;
    },
  },
});

const reducer = combineReducers({
  counter: counter.reducer,
  user: user.reducer,
});

const store = createStore(reducer);

store.dispatch(counter.actions.increment());
// -> { counter: 1, user: {name : '', age: 21} }
store.dispatch(counter.actions.increment());
// -> { counter: 2, user: {name: '', age: 22} }
store.dispatch(counter.actions.multiply(3));
// -> { counter: 6, user: {name: '', age: 22} }
store.dispatch(counter.actions.multiply());
// -> { counter: 12, user: {name: '', age: 22} }
console.log(`${counter.actions.decrement}`);
// -> "counter/decrement"
store.dispatch(user.actions.setUserName("eric"));
// -> { counter: 12, user: { name: 'eric', age: 22} }
```

### [`createAsyncThunk`](https://redux-toolkit.js.org/api/createAsyncThunk)

---

해당 함수는 **문자열 형태의 액션 타입과 프로미스를 반환하는 콜백 함수**를 받아서 할당한 **액션 타입 접두사를 기반**으로 **프로미스 라이프 사이클 액션 타입을 생성**하고 **프로미스 콜백을 실행시키고 반환된 프로미스에 기반한 라이프 사이클 액션을 디스패치 할 썽크(thunk) 액션 생성자**를 반환합니다.

> 이렇게 표현하니 너무 어렵네요... 😅 세 줄로 구분지어 봅시다.

- 인자로 **액션 타입(`string`)과 콜백 함수(`promise` 반환)를** 받음
- 앞의 액션 타입을 접두사로 삼아 **프로미스 라이프 사이클(`Pending`, `Fulfilled`, `Rejected`) 액션 타입 생성**
- 이후 **썽크 액션 생성자(프로미스 콜백 실행 및 프로미스 기반 라이프 사이클 액션 반환) 반환**

해당 요약은 비동기 요청 라이프 사이클을 다루는데 권장되는 표준입니다.

어떤 데이터를 가져오는지, 로딩 상태를 추적하는 방법 혹은 반환 데이터의 처리 방식을 모르기 때문에 **리듀서 함수를 생성하지 않습니다.** 당신은 로딩 상태 및 진행 로직이 당신의 앱에 적절함과 동시에 해당 액션들을 다루는 **자체적인 리듀서 로직을 작성해야 합니다.**

```ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "./userAPI";

// First, create the thunk
const fetchUserById = createAsyncThunk(
  "users/fetchByIdStatus",
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId);
    return response.data;
  }
);

// Then, handle actions in your reducers:
const usersSlice = createSlice({
  name: "users",
  initialState: { entities: [], loading: "idle" },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(action.payload);
    });
  },
});

// Later, dispatch the thunk as needed in the app
dispatch(fetchUserById(123));
```

> 💡 **TIP**
>
> 리덕스 툴킷의 [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)는 리덕스 앱을 위한 데이터 요청과 캐싱 솔루션이며, 데이터 요청을 위해 **어떤 썽크나 리듀서를 작성하지 않아도 됩니다.** 리덕스 툴킷은 이것을 사용해볼 것을 권장하며, RTK Query는 당신의 앱에 있는 데이터 요청 관련 코드를 간략하게 만들 것입니다.

#### Parameters

---

`createAsyncThunk` 는 세 가지 인자를 받습니다.

- **`type`(string):** 추가적인 리덕스 액션 타입 상수(비동기 요청의 라이프 사이클을 나타내는)를 만들기 위한 문자열입니다.
  - 예를 들어, `type` 이 `users/requestStatus` 일 경우 액션 타입은 다음과 같이 생성됩니다.
    - `pending`: `users/requestStatus/pending`
    - `fulfilled`: `users/requestStatus/fulfilled`
    - `rejected`: `users/requestStatus/rejected`
- **`payloadCreator`(callback):** 프로미스(비동기 로직의 결과 포함)를 반환하는 콜백입니다.
  - 오류가 있는 경우, `Error` 인스턴스 혹은 오류 메시지와 같은 일반 값을 포함하는 **rejected promise**를 반환하거나 `thunkAPI.rejectWithValue` 함수에서 반환된 `RejectWithValue` 인수를 사용하여 **resolved promise**를 반환합니다.
  - `payloadCreator` 함수엔 적절한 결과 계산을 위해 필요한 모든 로직(표준 AJAX 데이터 요청, 결과가 최종 값으로 결합된 다수의 AJAX 요청, React Native의 `AsyncStroage` 와의 상호 작용)을 포함할 수 있습니다.
  - `payloadCreator` 함수는 다음의 두 가지 인자와 함께 호출됩니다.
    - `arg`: 디스패치 될 때, **썽크 액션 생성자에 처음으로 전달되는 단일 값**입니다. 해당 인자는 **요청 일부로 필요한 아이템 ID와 같은 값**을 전달할 때 유용합니다. 다수의 값을 전달해야 하는 경우, **썽크를 디스패치 할 때 객체 형태(`dispatch(fetchUsers({status: 'active', sortBy: 'name'}))`)로 함께 전달**합니다.
    - `thunkAPI`: 객체 형태의 값으로, 리덕스 함수로 전달되는 모든 일반적인 파라미터를 포함합니다. 파라미터는 다음과 같습니다.
      - `dispatch`: 리덕스 스토어의 `dispatch` 메서드
      - `getState`: 리덕스 스토어의 `getState` 메서드
      - `extra`: 가능하면 설정 시 썽크 미들웨어에 제공되는 추가 인자
      - `requestId`: 요청 시퀀스를 식별하기 위해 자동으로 생성된 고유한 문자열 ID 값
      - `signal`: 앱 로직 내 다른 부분이 해당 비동기 요청을 취소하길 원하는 지에 사용하는 [`AbortController.signal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal) 객체입니다.
      - `rejectWithValue(value, [meta])`: `rejectWithValue` 는 기존에 정의된 페이로드 및 메타와 함께 **거절(rejected)된 응답을 반환하기 위해 `return`(또는 `throw`) 할 수 있는 유틸리티 함수**입니다. 당신이 할당하는 어떤 값이라도 전달하여 거절된 액션의 페이로드로 해당 값을 돌려줍니다. 만약 `meta` 도 전달되면, 기존의 `rejectedAction.meta` 와 병합됩니다.
      - `fulfillWithValue(value, meta)`: `fulfillWithValue` 는 `fulfilledAction.meta` 에 추가할 수 있는 기능을 갖는 값과 함께 `fulfill` 을 `return` 할 수 있는 함수입니다.
- **Options(object):** 추가적인 필드를 포함하는 객체 형식의 인자입니다.
  - `condition(arg, { getState, extra } ): boolean | Promise<boolean>`: 원한다면 페이로드 생성기와 모든 액션 디스패치의 실행을 스킵할 수 있는 콜백입니다. [`condition` 필드에 대한 자세한 내용](https://redux-toolkit.js.org/api/createAsyncThunk#canceling-before-execution)
  - `dispatchConditionRejection`: 만약 `condition()` 함수가 `false` 를 반환하면 기본값은 아무런 액션도 디스패치 되지 않는 것입니다. 해당 필드를 `true` 로 하면 썽크가 취소되었을 때 거부된 작업을 지속적으로 전달되게 할 수 있습니다.
  - `idGenerator(arg): string`: 요청 시퀀스를 위한 `requestId` 를 생성할 때 사용하는 함수입니다. 기본값은 [nanoid](https://redux-toolkit.js.org/api/other-exports/#nanoid)를 사용하는 것이지만, 별도의 아이디 생성 로직을 설정할 수도 있습니다.
  - `serializeError(error: unknown) => any`: 내부의 `miniSerializeError` 로직을 별도의 직렬화 로직으로 변경합니다.
  - `getPendingMeta({ arg, requestId }, { getState, extra }): any`: `pendingAction.meta` 필드로 병합되는 객체를 생성하는 함수입니다.

#### Return Value

---

`CreateAsyncThunk` 리덕스 썽크 액션 생성자의 표준을 반환합니다. 썽크 액션 생성자 함수는 중첩 필드로 포함된 `pending`, `fulfilled` 그리고 `rejected` 케이스를 위한 일반 액션 생성자가 있습니다.

위 예시인 `fetchUserById` 를 사용하면 `CreateAsyncThunk` 는 4가지 함수를 반환합니다.

- `fetchUserById` 작성한 비동기 페이로드 콜백을 시작하는 썽크 액션 생성자
  - `fetchUserById.pending`: `users/fetchByIdStatus/pending` 액션을 디스패치 하는 액션 생성자
  - `fetchUserById.fulfilled`: `users/fetchByIdStatus/fulfilled` 액션을 디스패치 하는 액션 생성자
  - `fetchUserById.rejected`: `users/fetchByIdStatus/rejected` 액션을 디스패치 하는 액션 생성자

디스패치 되면 해당 썽크는:

- `pending` 액션이 디스패치 됩니다.
- 그리고 `payloadCreator` 콜백을 호출하고 반환된 프로미스가 완료될 때 까지 기다립니다.
- 프로미스가 완료되었을 때:
  - **프로미스가 성공적으로 해결되면,** `fulfilled` 액션을 프로미스 값인 `action.payload` 와 함께 디스패치 합니다.
  - **프로미스가 `rejectWithValue(value)` 반환값과 함께 해결되면,** `rejected` 액션을 `action.payload` 로 전달된 값과 거부됨으로 `action.error.message` 를 함께 전달합니다.
  - **프로미스가 실패했고 `rejectWithValue` 로 처리되지 않은 경우,** `rejected` 액션을 `action.error` 로서의 에러 값의 직렬화 된 버전과 함께 반환됩니다.

#### Promise Lifecycle Actions

---

`createAsyncThunk` 은 **세 가지 리덕스 액션 생성자(`pending`, `fulfilled` 그리고 `rejected`)와 함께 생성**되고, 해당 생성자들은 `createAction` 을 사용합니다. 각 라이프 사이클 액션 생성자는 반환된 썽크 액션 생성자에 연결되므로, 리듀서 로직이 액션 타입을 참조하고 디스패치 될 때 해당하는 액션에 응답할 수 있습니다. 각 액션 객체는 `action.meta` 에 있는 현재 고유한 `requestId` 와 `arg` 값을 포함합니다.

해당 액션 생성자는 다음의 시그니처들을 포함합니다.

```ts
interface SerializedError {
  name?: string;
  message?: string;
  code?: string;
  stack?: string;
}

interface PendingAction<ThunkArg> {
  type: string;
  payload: undefined;
  meta: {
    requestId: string;
    arg: ThunkArg;
  };
}

interface FulfilledAction<ThunkArg, PromiseResult> {
  type: string;
  payload: PromiseResult;
  meta: {
    requestId: string;
    arg: ThunkArg;
  };
}

interface RejectedAction<ThunkArg> {
  type: string;
  payload: undefined;
  error: SerializedError | any;
  meta: {
    requestId: string;
    arg: ThunkArg;
    aborted: boolean;
    condition: boolean;
  };
}

interface RejectedWithValueAction<ThunkArg, RejectedValue> {
  type: string;
  payload: RejectedValue;
  error: { message: "Rejected" };
  meta: {
    requestId: string;
    arg: ThunkArg;
    aborted: boolean;
  };
}

type Pending = <ThunkArg>(
  requestId: string,
  arg: ThunkArg
) => PendingAction<ThunkArg>;

type Fulfilled = <ThunkArg, PromiseResult>(
  payload: PromiseResult,
  requestId: string,
  arg: ThunkArg
) => FulfilledAction<ThunkArg, PromiseResult>;

type Rejected = <ThunkArg>(
  requestId: string,
  arg: ThunkArg
) => RejectedAction<ThunkArg>;

type RejectedWithValue = <ThunkArg, RejectedValue>(
  requestId: string,
  arg: ThunkArg
) => RejectedWithValueAction<ThunkArg, RejectedValue>;
```

해당 액션들을 리듀서에서 처리하기 위해 객체 키 표기법 혹은 빌더 콜백 표기법을 사용하는 `createReducer` 나 `createSlice` 에서 액션 생성자를 참조하세요. 만약 **타입스크립트를** 사용한다면, 타입 추론을 더욱 명확히 하기 위해 **빌더 콜백 표기법**을 사용해야합니다.

```ts
const reducer1 = createReducer(initialState, {
  [fetchUserById.fulfilled]: (state, action) => {},
});

const reducer2 = createReducer(initialState, (builder) => {
  builder.addCase(fetchUserById.fulfilled, (state, action) => {});
});

const reducer3 = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchUserById.fulfilled]: (state, action) => {},
  },
});

const reducer4 = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {});
  },
});
```

#### Handling Thunk Results

---

**Unwrapping Result Actions**

썽크는 디스패치 되면 값을 반환할 수 있습니다. 보편적인 사용 방식은 다음과 같습니다.

- 썽크로부터 프로미스 반환
- 썽크를 컴포넌트로부터 디스패치
- 다음 추가 작업을 수행하기 이전에 프로미스가 완료되는 것을 기다리는 것

```ts
const onClick = () => {
  dispatch(fetchUserById(userId)).then(() => {
    // do additional work
  });
};
```

`createAsyncThunk` 에 의해 생성된 썽크는 항상 적절하게 처리된 `fulfilled` 액션 객체 혹은 `rejected` 액션 객체를 포함한 완료된 프로미스를 반환합니다.

요청 로직은 해당 프로미스를 기존의 프로미스인 것처럼 처리할 수 있습니다. 디스패치 된 썽크에 의해 반환된 프로미스는 `unwrap` 속성을 갖습니다. `unwrap` 속성은 `fulfilled` 액션의 `payload` 룰 추출하거나, `error` 혹은 가능하다면 `rejected` 액션의 `rejectWithValue` 를 통해 생성된 `payload` 를 throw 하기 위해 호출할 수 있습니다.

```ts
// in the component

const onClick = () => {
  dispatch(fetchUserById(userId))
    .unwrap()
    .then((originalPromiseResult) => {
      // handle result here
    })
    .catch((rejectedValueOrSerializedError) => {
      // handle error here
    });
};
```

혹은 `async`/`await` 구문과 함께

```ts
// in the component

const onClick = async () => {
  try {
    const originalPromiseResult = await dispatch(
      fetchUserById(userId)
    ).unwrap();
    // handle result here
  } catch (rejectedValueOrSerializedError) {
    // handle error here
  }
};
```

연결되어 있는 `.unwrap()` 을 선호하지만, 리덕스 툴킷은 비슷한 목적으로 사용할 수 있는 `unwrapResult` 함수도 내보냅니다.

```ts
import { unwrapResult } from "@reduxjs/toolkit";

// in the component
const onClick = () => {
  dispatch(fetchUserById(userId))
    .then(unwrapResult)
    .then((originalPromiseResult) => {
      // handle result here
    })
    .catch((rejectedValueOrSerializedError) => {
      // handle result here
    });
};
```

`async`/`await` 구문과 함께 사용하면 다음과 같습니다.

```ts
import { unwrapResult } from "@reduxjs/toolkit";

// in the component
const onClick = async () => {
  try {
    const resultAction = await dispatch(fetchUserById(userId));
    const originalPromiseResult = unwrapResult(resultAction);
    // handle result here
  } catch (rejectedValueOrSerializedError) {
    // handle error here
  }
};
```

---

**Checking Errors After Dispatching**

이것은 **실패한 요청 혹은 썽크 내 에러가 거부된 프로미스를 반환하지 않는다는 것**을 의미합니다. 이 시점에서 모든 실패는 처리되지 않은 오류보다 **처리된 오류**라고 판단됩니다. 이는 디스패치의 결과를 사용하지 않는 사람들을 위해 **처리되지 않은 프로미스 rejections**를 방지하고자 함입니다.

만약 당신의 컴포넌트가 요청 실패를 알게 하고 싶다면, **\*`.unwrap` 혹은 `unwrapResult` 를 사용**하고 **다시 throw 된 오류를 적절하게 처리하세요.**

#### Handling Thunk Errors

---

당신의 `payloadCreator` 가 reject 된 프로미스(`async` 함수에서 반환된 오류 등)를 반환할 때, 썽크는 `action.error` 로 에러의 자동으로 직렬화 된 버전을 포함하는 `rejected` 액션을 전달합니다. 하지만 직렬성을 보장하기 위해 `SerializedError` 인터페이스와 일치하지 않는 모든 항목이 인터페이스에서 제거됩니다.

```ts
export interface SerializedError {
  name?: string;
  message?: string;
  stack?: string;
  code?: string;
}
```

만약 당신이 `rejected` 액션의 내용을 커스터마이징 하고 싶다면, 스스로 에러를 잡아야하고, `thunkAPI.rejectWithValue` 를 사용하는 새로운 값을 반환해야 합니다.

`rejectWithValue` 접근 방식은 **API 응답이 "succeeds" 이지만, 리듀서가 알아야 하는 추가 오류 세부 정보가 포함된 경우**에도 사용됩니다. 이는 특히 필드 수준의 유효성 검사를 예상할 때 일반적입니다.

```ts
const updateUser = createAsyncThunk(
  "users/update",
  async (userData, { rejectWithValue }) => {
    const { id, ...fields } = userData;
    try {
      const response = await userAPI.updateById(id, fields);
      return response.data.user;
    } catch (err) {
      // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(err.response.data);
    }
  }
);
```

#### Cancellation

---

**Canceling Before Execution**

만약 당신이 페이로드 생성자가 호출되기 전에 썽크를 취소하고 싶다면, 옵션으로서 **페이로드 생성자 뒤에 `condition` 콜백을 제공할 수 있습니다.** 해당 콜백은 매개변수로 **썽크 인자와 `{getState, extra}` 를 포함한 객체**를 받습니다. 그리고 이를 계속 지속할 것인지 아닌 지에 대한 결정에 사용합니다.

만약 **실행이 취소되어야 한다면,** `condition` 콜백은 **리터럴 `false` 값** 혹은 **`false` 으로 resolve 되는 프로미스**를 반환해야 합니다. 만약 **프로미스가 반환된다면,** 썽크는 **`pending` 액션이 디스패치 되기 전에 `fulfilled` 될 때까지 프로미스를 기다립니다.** 그렇지 않으면 동기식으로 디스패치가 진행됩니다.

```ts
const fetchUserById = createAsyncThunk(
  "users/fetchByIdStatus",
  async (userId, thunkAPI) => {
    const response = await userAPI.fetchById(userId);
    return response.data;
  },
  {
    condition: (userId, { getState, extra }) => {
      const { users } = getState();
      const fetchStatus = users.requests[userId];
      if (fetchStatus === "fulfilled" || fetchStatus === "loading") {
        // Already fetched or in progress, don't need to re-fetch
        return false;
      }
    },
  }
);
```

만약 `condition()` 이 `false` 를 반환하면, 기본 동작은 **액션이 전혀 전달되지 않는 것**입니다. 만약 썽크가 취소되었을 때 "rejected" 인 액션이 여전히 디스패치 되게 하고 싶다면, `{condition, dispatchConditionRejection: true}` 를 전달하세요.

**Canceling While Running**

만약 당신의 실행 중인 썽크가 마무리되기 전에 취소하고 싶다면, `dispatch(fetchUserById(userId))` 에 의해 반환되는 프로미스의 `abort` 메소드를 사용할 수 있습니다.

실제 예제는 다음과 같습니다.

```ts
import { fetchUserById } from "./slice";
import { useAppDispatch } from "./store";
import React from "react";

function MyComponent(props: { userId: string }) {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    // Dispatching the thunk returns a promise
    const promise = dispatch(fetchUserById(props.userId));
    return () => {
      // `createAsyncThunk` attaches an `abort()` method to the promise
      promise.abort();
    };
  }, [props.userId]);
}
```

이 방식으로 썽크가 취소된 뒤에, `error` 속성에 대한 `AbortError` 와 함께 `"thunkName/rejected"` 액션을 디스패치(그리고 반환)합니다. **썽크는 어떠한 추가 액션도 디스패치 않습니다.**

추가적으로 `payloadCreator` 는 `thunkAPI.signal` 을 통해 전달된 `AbortSignal` 을 사용하여 **비용이 많이 드는 작업을 해당 시점에서 취소할 수 있습니다.**

현대 브라우저의 `fetch` API는 **이미 `AbortSignal` 를 지원합니다.**

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";

const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId: string, thunkAPI) => {
    const response = await fetch(`https://reqres.in/api/users/${userId}`, {
      signal: thunkAPI.signal,
    });
    return await response.json();
  }
);
```

**Checking Cancellation Status**

**Reading the Signal Value**

`signal.aborted` 를 사용하여 **썽크가 중단되었는지 정기적으로 확인**하고 **높은 비용의 작업을 중단**할 수 있습니다.

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";

const readStream = createAsyncThunk(
  "readStream",
  async (stream: ReadableStream, { signal }) => {
    const reader = stream.getReader();

    let done = false;
    let result = "";

    while (!done) {
      if (signal.aborted) {
        throw new Error("stop the work, this has been aborted!");
      }
      const read = await reader.read();
      result += read.value;
      done = read.done;
    }
    return result;
  }
);
```

**Listening for Abort Events**

또한 `signal.addEventListener('abort', callback)` 를 호출하여 `promise.abort()` 가 호출될 때 썽크 내부 로직이 알림을 받을 수 있도록 할 수 있습니다. 예를 들어, axios의 `CancelToken` 과 함께 결합하여 사용될 수 있습니다.

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId, { signal }) => {
    const source = axios.CancelToken.source();
    signal.addEventListener("abort", () => {
      source.cancel();
    });
    const response = await axios.get(`https://reqres.in/api/users/${userId}`, {
      cancelToken: source.token,
    });
    return response.data;
  }
);
```

#### Examples

- 한 번에 하나의 요청으로, ID를 통한 유저와 로딩 상태를 함께 요청합니다.

```ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "./userAPI";

const fetchUserById = createAsyncThunk(
  "users/fetchByIdStatus",
  async (userId, { getState, requestId }) => {
    const { currentRequestId, loading } = getState().users;
    if (loading !== "pending" || requestId !== currentRequestId) {
      return;
    }
    const response = await userAPI.fetchById(userId);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    entities: [],
    loading: "idle",
    currentRequestId: undefined,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.entities.push(action.payload);
          state.currentRequestId = undefined;
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.error = action.error;
          state.currentRequestId = undefined;
        }
      });
  },
});

const UsersComponent = () => {
  const { entities, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const fetchOneUser = async (userId) => {
    try {
      const user = await dispatch(fetchUserById(userId)).unwrap();
      showToast("success", `Fetched ${user.name}`);
    } catch (err) {
      showToast("error", `Fetch failed: ${err.message}`);
    }
  };

  // render UI here
};
```

- `rejectWithValue` 를 사용하여 컴포넌트 내에서 커스텀한 `rejected payload` 접근
  - 이것은 `userAPI` 가 오직 에러만을 반환한다는 극단적인 예시입니다.

```ts
// file: user/slice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userAPI } from "./userAPI";
import { AxiosError } from "axios";

// Sample types that will be used
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

interface UpdateUserResponse {
  user: User;
  success: boolean;
}

export const updateUser = createAsyncThunk<
  User,
  { id: string } & Partial<User>,
  {
    rejectValue: ValidationErrors;
  }
>("users/update", async (userData, { rejectWithValue }) => {
  try {
    const { id, ...fields } = userData;
    const response = await userAPI.updateById<UpdateUserResponse>(id, fields);
    return response.data.user;
  } catch (err) {
    let error: AxiosError<ValidationErrors> = err; // cast the error for access
    if (!error.response) {
      throw err;
    }
    // We got validation errors, let's return those so we can reference in our component and set form errors
    return rejectWithValue(error.response.data);
  }
});

interface UsersState {
  error: string | null | undefined;
  entities: Record<string, User>;
}

const initialState = {
  entities: {},
  error: null,
} as UsersState;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // The `builder` callback form is used here because it provides correctly typed reducers from the action creators
    builder.addCase(updateUser.fulfilled, (state, { payload }) => {
      state.entities[payload.id] = payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      if (action.payload) {
        // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, the payload will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error.message;
      }
    });
  },
});

export default usersSlice.reducer;

// file: user/UsersComponent.ts
import React from "react";
import { useAppDispatch, RootState } from "../store";
import { useSelector } from "react-redux";
import { User, updateUser } from "./slice";
import { FormikHelpers } from "formik";
import { showToast } from "some-toast-library";

interface FormValues extends Omit<User, "id"> {}

const UsersComponent = (props: { id: string }) => {
  const { entities, error } = useSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();

  // This is an example of an onSubmit handler using Formik meant to demonstrate accessing the payload of the rejected action
  const handleUpdateUser = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const resultAction = await dispatch(
      updateUser({ id: props.id, ...values })
    );
    if (updateUser.fulfilled.match(resultAction)) {
      // user will have a type signature of User as we passed that as the Returned parameter in createAsyncThunk
      const user = resultAction.payload;
      showToast("success", `Updated ${user.first_name} ${user.last_name}`);
    } else {
      if (resultAction.payload) {
        // Being that we passed in ValidationErrors to rejectType in `createAsyncThunk`, those types will be available here.
        formikHelpers.setErrors(resultAction.payload.field_errors);
      } else {
        showToast("error", `Update failed: ${resultAction.error}`);
      }
    }
  };

  // render UI here
};
```
