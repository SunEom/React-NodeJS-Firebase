import "./App.css";
import { authService, fbApp } from "./fbConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);

  // 로그인 버튼을 눌렀을 때 동작
  const onLoginButtonClick = (e) => {
    //구글 로그인을 위한 팝업 생성
    signInWithPopup(authService, provider)
      //로그인 성공
      .then((result) => {
        authService.currentUser
          // 현재 로그인된 유저정보에서 IdToken값을 가져옴
          .getIdToken()
          .then((idToken) => {
            // IdToken을 localStorage에 저장
            window.localStorage.setItem("idToken", idToken);

            // 로그인을 위해 IdToken을 전달
            axios
              .post("http://127.0.0.1:8000/login", { idToken })
              // response.data로 유저정보를 전달받음
              .then((response) => {
                console.log("/login   " + response);
                // 전달받은 유저정보를 state에 저장
                setUser(response.data);
              })
              // 로그인 실패
              .catch((error) => console.error(error));
          })
          //IdToken 가져오기 실패
          .catch(function (error) {
            // Handle error
          });
      })
      // 로그인 실패시 처리과정
      .catch((error) => {
        // Handle Errors here.
      });
  };

  //로그아웃 버튼 클릭시 작동
  const onLogoutButtonClick = () => {
    // firebase에 logout 요청
    signOut(authService);

    // localStorage에 저장된 idToken값 삭제
    window.localStorage.clear();

    // 유저 정보를 가지고 있는 state 초기화
    setUser(null);
  };
  // 최초 사이트 접근 or 새로고침시
  useEffect(() => {
    // localStorage에 idToken이 존재하는지 확인
    let idToken = window.localStorage.getItem("idToken");

    //idToken이 존재하면 서버에 유저정보 요청
    if (idToken) {
      axios
        .post("http://127.0.0.1:8000/getUserData", { idToken })
        .then((response) => {
          // response.data로 유저정보를 전달받음
          console.log("/getUserData   " + response);
          // 전달받은 유저정보를 state에 저장
          setUser(response.data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="App">
      <button onClick={onLoginButtonClick}>Google로 로그인하기</button>
      {user && (
        <>
          <div>Hello {user.nickname}</div>
          <button onClick={onLogoutButtonClick}>Logout</button>
        </>
      )}
      {!user && <div>Hello anonymous</div>}
    </div>
  );
}

export default App;
