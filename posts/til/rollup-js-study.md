---
title: 새로운 번들러, rollup.js를 알아보자
date: "2022-03-21"
description: "번들러 중 하나인 rollup.js를 학습하고, 적용 방법을 학습합니다."
tags: ["rollup.js", "Bundler", "Tree-shaking", "Performance"]
thumbnail: "rollup-js-logo.png"
---

# 들어가며 🏃

---

이전에 **트리 쉐이킹(Tree-shaking)에 대한 내용**을 간단하게 다뤄봤었는데요, 해당 포스팅에서는 **웹팩(Webpack)을 중심으로 트리 쉐이킹을 진행하는 방식**을 배운 바가 있습니다. 해당 포스팅에서 제가 [학습을 위해 참고했던 포스팅](https://ui.toast.com/weekly-pick/ko_20180716)을 보면 다음과 같은 문장이 있었습니다.

> 트리 쉐이킹이라는 용어는 **Rollup**에 의해 인기를 얻게 되었으니,

은연중에 스쳐 지나갔던 키워드였는데, 이번 저희 디자인 시스템 프로젝트에 적용할 예정이 있다고 하여 학습의 필요성을 느끼게 되었습니다. 그렇게 간단하게 리서치를 진행한 결과, 제가 명확히 이해하지 못하고 넘겼던 개념들인 **모듈이나, 번들러에 대한 내용**들이 다수 다뤄지는 주제라 이를 계기로 간단히라도 정리해보고자 합니다.

# 모듈, 번들러가 도대체 뭔데요 📦

---

당장 학습할 [rollup.js의 공식 홈페이지](https://rollupjs.org/guide/en/)를 보면 다음과 같은 문장으로 rollup.js를 설명하고 있습니다.

> Rollup is **a module bundler** for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application.

- **Rollup**은 작은 코드 조각을 라이브러리나 애플리케이션과 같이 더 크고 복잡한 것으로 컴파일하는 **자바스크립트용 모듈 번들러**입니다.

둘 중 하나도 잘 모르는데, 동시에 **모듈 번들러**라는 말이 나오니 당황스럽기 그지없네요. 암튼, 우리가 모듈과 번들러에 대해 학습하기 위해서는 간단하게라도 **등장 배경과 개념**에 대해 알아야 할 필요가 있어 보이네요.

## 모듈 이해 돕기

---

**모듈**은 **개념, 필요성, 모듈 시스템 종류**로 나눠 요약해보겠습니다.

### 개념

---

- **모듈**은 간단하게 **본체에서 분리된 독립된 하위 개체**라고 이해할 수 있습니다.
- 자바스크립트에서는 **모듈 단위의 스코프**를 활용하여 **의존성과 스코프 오염**에 대한 문제를 해결합니다.

### 필요성

---

- 자바스크립트를 효율적으로 관리하기 위해선 **모듈 단위 개발**을 해야 합니다.
  - 자바스크립트 코드를 **단순히 파일로 분리하는 것은 모듈화가 아닙니다.**
    - 단순히 파일을 분리해도, 자바스크립트는 **전역 스코프**를 사용하여 **스코프 오염**을 야기합니다.
  - 각 파일은 **의존성에 맞게 순서대로 로딩되어야 합니다.** 그렇지 않으면, 스크립트가 실행되지 않을 수도 있습니다.

### 모듈 시스템 종류

---

- **AMD(Asynchronous Module Definition)**
  - **비동기 방식**으로 **`define`** 함수를 통해 모듈의 API와 의존성 관계를 정의합니다.
  - **브라우저에서 바로 사용 가능**하며, **동적 로딩**을 지원합니다.
- **CommonJS**
  - **동기 방식**으로 **`require`** 함수를 통해 의존성 모듈을 가져오고 **`module.exports`** 객체로 모듈 API를 정의합니다.
  - **브라우저에서 바로 사용 불가능**합니다.
  - 번들러로 변환 과정을 거쳐야하지만, **Node는 CommonJS를 사용하기 때문에** Node 기반 개발에서는 CommonJS를 바로 사용할 수 있습니다.
- **ES6 모듈**
  - 모듈 정의를 위해 **`import`** 와 **`export`** 를 사용합니다.
  - 가장 익숙한 모듈 시스템입니다.
  - **동적으로 `import` 내지 `export` 를 할 수 없습니다.**
    - 실행 시점에서 `import` 및 `export` 할 대상을 변경할 수 없기에, **구문 분석을 진행하여 사용하지 않는 코드를 제외하는 최적화(트리 쉐이킹)를 할 수 있습니다.**

[`npm` 을 통한 외부 패키지 의존성 관리](https://ui.toast.com/fe-guide/ko_DEPENDENCY-MANAGE#npm%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%99%B8%EB%B6%80-%ED%8C%A8%ED%82%A4%EC%A7%80-%EC%9D%98%EC%A1%B4%EC%84%B1-%EA%B4%80%EB%A6%AC)에 대한 내용은 다음에 다뤄보도록 하겠습니다.

## 번들러 이해 돕기

---

**번들러**는 간단히 **개념**만 익혀보도록 하겠습니다.

### 개념

---

- **소스 코드를 모듈별로 작성**하고 **모듈간 또는 외부 라이브러리간의 의존성 관리**를 돕는 도구입니다.
  - 모듈의 중요성이 증대되고 **기능 단위 모듈화와 관리의 필요성**이 생기면서 **번들러**가 중요해졌습니다.
  - 앞의 AMD를 제외하고 브라우저 환경에서는 모듈 시스템을 바로 실행할 수 없으므로, **모듈 코드의 분석과 모듈 스펙에 따른 새 코드로의 가공**이 필요합니다.
    - 한마디로, **브라우저에서 모듈 코드가 잘 실행되도록 해주는 도구**입니다.
  - 대표적인 번들러로 **RequireJS, Browserify, Rollup, Parcel** 등이 있습니다.

해당 포스팅에선 [웹팩에 대한 내용](https://ui.toast.com/fe-guide/ko_BUNDLER#webpack-%EC%86%8C%EA%B0%9C)을 좀 더 자세히 다루고 있습니다. 자세한 내용이 궁금하신 분들은 앞의 링크에서 참조하시면 될 것 같습니다.

이렇게 정리하니 **모듈 번들러**라는 것은 **모듈 단위의 개발을 진행하고, 이를 브라우저에서 잘 실행되도록 도와주는 도구**라고 정의할 수 있을 것 같습니다.

# 그렇다면 왜 rollup.js인가 📜

---

**앱은 웹팩으로, 라이브러리는 rollup.js**로 라는 말이 있지만 왜 그런지 명확히 이해되지 않아 어려웠던 부분이었습니다. 이에 대해 가장 이해하기 쉬웠던 대답은 **rollup.js는 ES6 모듈 형태로 변화시킨다는 점**이었던 것 같습니다.

[구글의 Tooling.Report](https://bundlers.tooling.report/output-module-formats/es-modules/)에서 **ECMAScript 모듈 번들이 생성되는지에 대한 여부를 테스트한 결과**가 있는데, 내용을 훑으면 rollup.js의 경우 이에 대해 통과한 결과를 보여줍니다. ES6 모듈 시스템의 대표적인 특징은 **부분적으로 `import` 할 수 있다는 점**인데요, 그렇게 되면 **트리 쉐이킹** 기법을 활용할 수 있다는 장점이 있습니다. 아마 이런 부분 때문에 rollup.js를 사용한다고 생각할 수 있겠네요.

추가적으로 [rollup.js의 공식 홈페이지의 소개](https://rollupjs.org/guide/en/#the-why)를 참고하면, 왜 rollup.js를 사용하는 가에 대한 내용이 기재되어 있습니다.

> This finally changed with the ES6 revision of JavaScript, which includes a syntax for importing and exporting functions and data so they can be shared between separate scripts. The specification is now fixed, but it is only implemented in modern browsers and not finalised in Node.js. **Rollup allows you to write your code using the new module system, and will then compile it back down to existing supported formats such as CommonJS modules, AMD modules, and IIFE-style scripts.** This means that you get to write future-proof code, and you also get the tremendous benefits of…

간단하게 요약하자면, ES6 개정판으로 변경 됨에 따라 사양은 수정되었지만, 이는(ES6 Module system) 최신 브라우저에서만 구현되며 Node.js에서 마무리되지 않기 때문에, rollup을 통해 **최신 모듈 시스템으로 코드를 작성한 뒤 구버전인 기존 지원 형식에 따라 다시 컴파일 할 수 있다고 합니다.**

이어지는 소개글에는 [트리 쉐이킹](https://rollupjs.org/guide/en/#tree-shaking)에 대한 내용도 간단히 소개되고 있으니 필요하신 분들은 참고하시길 바랍니다.

# 그렇다면 적용해보자! 👨‍💻

---

> 적용 파트부터는 [해당 블로그](https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html)를 많이 참고하여 요약했습니다. 블로그와 마찬가지로 `yarn` 을 활용했으며 **적용을 위한 개인적인 이해의 선에서 요약을 진행합니다.**

우선 설치부터 진행해봅시다.

```sh
# 전역 설치
yarn global add rollup

# 프로젝트 의존성으로 설치
yarn add -D rollup
```

그리고 `package.json` 파일로 넘어가면 다음의 두 가지 명령어를 수정하여 작성합니다.

```json
// package.json

{
  // ...
  "scripts": {
    "build": "rollup -c",
    "watch": "rollup -cw"
  }
}
```

- **`c`(config):** 프로젝트 루트 디렉토리에 **별도 설정 파일(`rollup-config.js`)을 사용**하겠다는 뜻입니다.
- **`w`(watch):** **변경 사항을 감지**하여 **자동 빌드를 수행**합니다.

부끄럽지만 개발 단계에서 활용할 수 있는 `watch` 개념을 이제 알게되었습니다. 앞으로 잘 활용해야겠습니다.

이어서 루트 디렉토리에 `rollup.config.js` 파일을 생성하고 해당 파일에서 **rollup과 관련된 설정**을 관리합니다.

```js
// rollup.config.js

export default {
  input: "./src/index.js", // 진입 경로
  output: {
    file: "./dist/bundle.js", // 출력 경로
    format: "es", // 출력 형식
    sourcemap: true, // 소스 맵을 켜놔서 디버깅을 쉽게 만들자
  },
};
```

### 참고

---

- [TOAST UI : 의존성 관리](https://ui.toast.com/fe-guide/ko_DEPENDENCY-MANAGE)
- [TOAST UI : 번들러](https://ui.toast.com/fe-guide/ko_BUNDLER)
- [Medium : Rollup vs. Parcel vs. webpack: Which Is the Best Bundler?](https://betterprogramming.pub/the-battle-of-bundlers-6333a4e3eda9)
- [rollup.js : Introduction - The why](https://rollupjs.org/guide/en/#the-why)
- [Tooling.Report : ECMAScript Modules](https://bundlers.tooling.report/output-module-formats/es-modules/)
- [wormwlrm's blog : Rollup 기반 라이브러리 개발 환경 구성하기](https://wormwlrm.github.io/2021/11/07/Rollup-React-TypeScript.html)
