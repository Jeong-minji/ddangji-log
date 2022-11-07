---
title: "삽질 기록 _ NextAuth"
date: "2022-11-06"
description: "코드 짜면서 마주친 에러와 삽질하며 해결한 기록을 쓴 글"
tags: ["react", "NextAuth"]
thumbnail: "thumbnail.png"
---

NextAuth를 이용해서 구글, 카카오, 트위터 세 종류의 소셜 로그인을 구현하였다. 처음부터 NextAuth를 사용해서 구현하려 했던 것은 아니지만,
트위터의 OAuth를 이용하는 것이 굉장히 까다로워서 NextAuth를 이용하게 되었다.

몇 개월 동안 계속 로컬 환경에서만 테스트를 진행했고, 데브 서버에 올려둔 코드도 production 모드가 아닌 development 모드로 실행되고 있었기 때문에 별 다른 문제가 나타나지 않았다.
배포 2주 전 쯤부터 데브 서버를 production 모드로 실행시키기 시작했는데, 예상치 못한 에러들이 종종 발생했다.
production 모드에서 발생한 에러가 로컬 환경에서 동일하게 나타나지 않아서 에러를 재연하는 것만 해도 꽤 오랜 시간이 걸려 쉽지 않았다.

## Session Undefined

우선 production 모드에서 소셜 로그인 버튼을 누르면 계속 Session 값이 undefined라는 에러가 발생하였다.
소셜 로그인 버튼을 누르면 next-auth로부터 session 값을 받아오고, redirect 페이지에서 서버에 회원가입 또는 로그인 요청을 보낼 때 session 값을 활용하는 방식으로 구현 되어 있었다.

Redirect 컴포넌트 안에는 순서대로 `signIn(useCallback)` 함수와 `useEffect` 두 개가 있었는데, signIn 함수의 callback dependency 안에 있는 session.user에 optional을 추가하지 않아서 발생한 것이었다. 내용을 수정해서 배포했더니 에러가 발생하지 않았다. Session이 undefined라고 하니까 처음에는 NextAuth config 문제인 줄 알고 모든 설정이란 설정은 다 만져봤는데, 그러면서 겸사겸사 config를 더 정확하게 설정하는 방법도 알게 되었다.

useEffect가 제일 먼저 실행되고, 그 안에서 조건에 따라 분기해서 로그인 조건이면 그 위에 선언되어 있던 signIn 함수를 호출하는 로직이었는데 콘솔을 찍어보면 useEffect가 실행되기도 전에
undefined 에러가 찍혔다. useEffect가 제일 먼저 실행된다고 생각해서 useEffect에만 문제가 있을 것이라고 생각했지, signIn 함수에 문제가 있을거라고는 미처 생각하지 못하였다.

하지만 가끔 에러가 너무너무 해결되지 않을 때에는 React 근본적인 것을 몰랐던 적이 종종 있어서 리액트에서 함수 실행 순서에 대한 블로그 글들을 찾아 보았다.
아니나 다를까 실행 순서에 문제가 있었다.

**순서는 코드를 위에서 아래로 읽고, 선언된 변수들을 다 읽고, 엘리먼트들 렌더링한 후, 그 다음에 useEffect를 실행하는 것이다.**
그래서 useCallback으로 감싼 signIn 함수에 대한 선언을 먼저 읽게 되는데, 그 dependency를 읽을 때 session이 undefined일 가능성이 있기 때문에 (그리고 실제로 초기에는 undefined가 맞기 때문에)undefined 에러가 났던 것이다. 이번 에러를 좀 더 찾기 어려웠던 이유는 보통 dependency에서 undefined 에러가 발생하면 브라우저에서 에러를 보여줄 때 해당 dependency를
직접적으로 가르켜서 바로바로 수정 가능했었는데, 이번에는 그렇지 않아 그랬던 것 같다.

## Header Overflow

Dev 서버를 production 모드로 실행시키고 나서부터 카카오, 구글은 잘 로그인 되나 트위터만 다음 에러가 발생하였다.

!["502_Error"](/images/posts/error_log1/502_error.png)

처음에는 프론트로부터 받는 세션의 양보다 헤더의 크기가 적어서 발생한 일이라고 판단하여 백엔드 측에서 헤더의 크기를 늘려서 해결된 듯 했다.
하지만 배포를 완료하고 난 뒤 CS로 들어온 에러 중 소셜 로그인 에러가 꽤나 있었고, 그 중 대부분은 트위터로 로그인을 시도하면 로그인이 되지 않고
그 후 다른 소셜 로그인을 시도해도 제대로 작동하지 않는다는 것이었다. 트위터 로그인 시도를 하지 않으면 나머지 소셜 로그인은 잘 동작했다.

그래서 헤더 크기를 늘려서 해결했던 문제를 이어서 찾아보기 시작했는데, 프론트에서 NextAuth를 통해 세션을 호출했을 때 받아오는 유저의 정보가 트위터가 압도적으로 많았다.
백엔드에서 필요한 데이터는 액세스토큰, 유저ID 정도밖에 없는데 너무 많은 정보를 받아오다 보니 헤더에서 받지 못하고 그런 에러가 발생했던 것이다.

세션으로 어떤 정보들을 받아올지 정하려면 `[...nextauth]`에서 callbacks 리턴값을 필요한 데이터만 지정하면 된다.
나는 userId, userName, userEmail, provider, access_token 다섯개의 데이터만 리턴값으로 추가해주었다.

```js
export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_KEY,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_CONSUMER_SECRET
    })
  ],
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.user = {
          ...user,
          ...account,
          ...profile
        }
      }

      return {
        ...token,
        user: {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          provider: token.user.provider,
          access_token: token.user.access_token
        }
      }
    }
  }
  ...
})
```

타입스크립트를 사용하는 경우, 처음에는 `token.user`의 타입을 읽지 못하였다. 왜냐하면 기본적으로 NextAuth에서 token의 타입은 아래처럼 지정되어 있기 때문이다.

```ts
export interface session: (params: { session: Session; user: User; token: JWT }) => Awaitable<Session>;

export interface JWT extends Record<string, unknown>, DefaultJWT {}

interface DefaultJWT extends Record<string, unknown> {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  sub?: string;
}
```

따라서 그 외의 값을 받아올 때 타입 에러가 안나게 하기 위해서는 다음처럼 `types.d.ts` 파일에 글로벌로 JWT의 타입을 지정 해주어야 한다.

```ts
declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
      provider: string;
      access_token?: string;
    };
  }
}
```

세션으로 받아오는 유저의 정보를 확 줄였더니 더 이상 소셜 로그인에서 에러가 발생하지 않았다.

## SignOut()

네트워크 탭을 보면 로그아웃을 해도 session 요청 response로 그 전 로그인 했었던 소셜 정보가 그대로 남아있는 문제가 있었다.
로그아웃을 해도 세션 정보가 남아있어서 로그아웃 후 다른 계정으로 로그인을 시도할 때 가끔 전에 남아있던 정보를 읽는 경우가 있어서 이 문제도 해결하였다.

NextAuth의 JWT까지 활용하는 것이 아니라 세션에서 액세스 토큰과 유저ID 정도만 받아오고, 백엔드에서 액세스 토큰을 바탕으로 정보를 가공해서 JWT를 다시 생성해서 보내주면
그 JWT를 브라우저 쿠키에 저장하는 방식이었기 때문에, 로그아웃을 할 때 `Cookies.remove("jwt")`를 통해 쿠키를 삭제시켜주기만 하고 별도의 처리는 없었다.

그런데 로그인을 할 때 NextAuth 내장 함수인 `signIn()`을 써서 세션 정보를 받아왔기 때문에, 로그아웃을 할 때도 `signOut()`을 써야 로그아웃 한 뒤에는 호출했던 세션 정보가
남아있지 않고 clear 된다.
