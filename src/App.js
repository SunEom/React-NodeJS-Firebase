import "./App.css";
import { authService } from "./fbConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faMask } from "@fortawesome/free-solid-svg-icons";

function App() {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState(null);

  // 로그인 버튼을 눌렀을 때 동작
  const onLoginButtonClick = (e) => {
    //구글 로그인을 위한 팝업 생성
    signInWithPopup(authService, provider)
      //로그인 성공
      .then((result) => {
        let idToken = result._tokenResponse.idToken;

        // IdToken을 localStorage에 저장
        window.localStorage.setItem("idToken", idToken);
        // 로그인을 위해 IdToken을 서버에 전달
        axios
          .post("http://127.0.0.1:8000/login", { idToken })
          .then((response) => {
            // response.data로 유저정보를 전달받음
            // 전달받은 유저정보를 state에 저장
            setUser(response.data);
          })
          // 로그인 실패
          .catch((error) => console.error(error));
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
          // 전달받은 유저정보를 state에 저장
          setUser(response.data);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  return (
    <div className="App">
      {
        // 로그인 성공시 보이는 화면
        user && (
          <>
            <div style={{ marginBottom: 20 }}>Hello {user.nickname}</div>
            <button style={{ width: 170, height: 50 }} onClick={onLogoutButtonClick}>
              <b>Logout</b>
            </button>
          </>
        )
      }
      {
        // 로그인 하지 않은 상태에서 보이는 화면
        !user && (
          <>
            <button onClick={onLoginButtonClick} style={{ height: 50, width: 170 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                <FontAwesomeIcon icon={faGoogle} size="2xl" />
                <div>
                  <b>Google로 로그인하기</b>
                </div>
              </div>
            </button>

            <div style={{ marginTop: 20 }}>
              Hello anonymous
              <FontAwesomeIcon icon={faMask} style={{ marginLeft: 5 }} size="lg" />
            </div>
          </>
        )
      }
    </div>
  );
}

export default App;
