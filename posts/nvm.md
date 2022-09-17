---
title: "Nvm"
date: "2022-07-26"
description: ""
tags: ["node"]
thumbnail: "nvm.png"
---

처음 회사 프로젝트를 클론받고 빌드를 시작했더니 node modules에서 에러가 발생하였다. 원인을 찾아보니 프로젝트가 사용하고 있는 node의 버전이 데스크톱에 설치 되어있는 버전과 맞지 않아 발생한 에러였다.
이렇게 노드 버전 호환 문제가 발생할 때 마다 OS에 필요한 버전을 재설치하는 것은 너무나 번거로울 뿐만 아니라, 추후 다른 프로젝트에서 또 충돌이 발생할 가능성이 높다.
이러한 노드 버전 문제를 해결하기 위해 사용하는 것이 nvm이다.

## NVM 왜 쓰나?

nvm은 Node Version Manager의 줄임말이다.
하나의 컴퓨터에서 여러개의 개발 프로젝트를 진행할 때, 각 프로젝트에서 사용하는 node 버전으로 변경하여 사용할 수 있도록 도와준다.
필요한 node 버전을 여러개 설치하고, 각 프로젝트 실행시 설치한 버전 중 필요한 버전으로 switch해서 사용하는 방식이다.
Nvm은 Node.js를 설치하는 툴이다. 따라서 node를 설치하고 nvm을 설치하는 것이 아니라, nvm을 설치하고 node를 설치하는 것이 맞다.

## Install

우선, 기존에 설치되어 있는 node.js를 제거하고 nvm 설치를 진행해야 한다.
Nvm을 설치하고 환경변수에 대한 세팅이 필요한데, 이러한 내용은 [해당 링크][https://www.youtube.com/watch?v=b26yiuc5zpm]의 영상을 보면 니꼬쌤이 잘 설명해주시니 참고하면 된다. 완료되고 나면 `nvm —v`으로 버전을 확인하여 정상적으로 설치되었는지 확인하면된다.

## Node Version Install

Nvm을 설치했으니, 이제 필요한 node 버전을 설치하면 된다.
버전은 버전의 형태를 띄는 문자열이라면 모두 가능하다.

```
$ nvm install 14
$ nvm install 16.14.0
$ nvm install v8
```

Node 최신버전을 설치하고 싶다면 버전 자리에 `node`, LTS 버전을 설치하고 싶다면 `—LTS`를 입력한다.

## 명령어

```
// 해당 버전 node 사용
$ nvm use <version>

// 설치된 node 리스트
$ nvm ls

// 설치 가능한 모든 node 버전 조회
$ nvm ls-remote

// 현재 사용중인 node 버전 확인
$ nvm current

// 필요 없는 node 버전 삭제
$ nvm uninstall <version>
```

제일 자주 사용하는 명령어는 `nvm use <version>`이다.
Default로 설정되어있는 node의 버전이 16인데 프로젝트에서 14를 사용하고 있다면, 프로젝트를 빌드 또는 실행하기 전에 `nvm use 14` 명령어를 입력하여 버전을 switch 해주어야 한다. 만약 nvm의 default node version을 변경하고 싶다면 `nvm alias default <version>`을 입력하면 된다.

## 매번 nvm use 명령어 입력하기 귀찮을 때

프로젝트를 실행시킬 때 마다 매번 명령어에 버전을 적어줘야하면 정말정말 귀찮다. 한 글자라도 줄이기위해 다음 방법을 사용할 수 있다.
(캡쳐사진)

1. 프로젝트의 디렉토리 root에 `.nvmrc` 파일 생성
2. `.nvmrc` 파일에는 해당 프로젝트에서 사용할 node 버전 작성
3. `.gitignore` 파일에 `.nvmrc` 파일을 추가하여 git에는 업로드 되지 않도록 함

위의 프로세스를 걸치면 실행 전에 `nvm use`만 입력해도 알아서 `.nvmrc`에 명시했던 버전으로 변경된다.

## 참고자료

[nvm gitHub][https://github.com/nvm-sh/nvm]
