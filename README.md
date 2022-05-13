# React-NodeJS 기반 Firebase 인증 Sample app

### React와 NodeJS를 이용하여 간단한 Firebase 인증을 구현하는 예제 어플리케이션입니다.

**실제 구현 방법과는 차이가 있을 수 있습니다**

---

## 최초 인증 과정

<br>

1. 클라이언트가 Firebase에 Google 로그인을 요청합니다.
2. 정상적으로 Google 로그인이 완료되었으면 클라이언트는 Firebase로부터 ID Token을 전달받습니다.
3. 클라이언트는 전달받은 ID Token을 LocalStorage에 저장합니다.
4. 서버에 해당 ID Token을 전달합니다.
5. 서버에서 클라이언트로부터 전달받은 ID Token을 Firebase에 검증 요청합니다.
6. 정상적인 토큰으로 검증되면 Firebase로부터 decode된 ID Token을 전달받습니다.
7. 서버는 Decode된 ID Token으로 부터 얻은 uid를 DB에 저장합니다.
8. 서버는 새로 추가된 사용자 정보를 클라이언트에 응답합니다.
9. 클라이언트는 서버로부터 응답받은 사용자 정보를 저장합니다.

   <br>

---

## 이후 인증 과정

<br>

1. 클라이언트는 LocalStorage에 가지고 있는 ID Token 값과 함께 서버에 데이터를 요청합니다.
2. 서버에서 클라이언트로부터 전달받은 ID Token을 Firebase에 검증 요청합니다.
3. 정상적인 토큰으로 검증되면 Firebase로부터 decode된 ID Token을 전달받습니다.
4. 서버는 Decode된 ID Token으로 부터 얻은 uid를 통해 DB에서 클라이언트가 원하는 정보를 찾아 응답합니다.
5. 클라이언트는 서버로부터 온 정보를 처리합니다.

   <br>
