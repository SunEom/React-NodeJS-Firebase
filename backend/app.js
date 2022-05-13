var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const Randomstring = require("randomstring");
const auth = require("./firebase");
const db = require("./database");

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//로그인 요청 라우터
app.post("/login", (req, res, next) => {
  auth
    //client로 부터 전달받은 idToken을 firebase에 검증함
    .verifyIdToken(req.body.idToken)
    .then((decodedToken) => {
      //firebase로부터 검증된 token(decode된 Token, client에서 전달받은 idToken과는 다름)을 통해 uid 접근
      const uid = decodedToken.uid;

      //DB에서 해당 uid를 가지고 있는 유저정보 확인
      db.query(`SELECT * FROM user WHERE uid = ?;`, [uid], (err, results) => {
        if (err) {
          next(err);
        }

        // 해당 uid와 일치하는 유저정보가 있는 경우 유저정보 응답
        if (results[0]) {
          res.status(200).json(results[0]);
        }

        // 해당 uid와 일치하는 유저정보가 없는 경우 DB에 유저정보 새로 추가
        else {
          db.query(
            `INSERT INTO USER(UID,PROVIDER,NICKNAME) VALUES(?, 'google', ?)`,
            [uid, Randomstring.generate(10)],
            (err, createdUser) => {
              if (err) {
                next(err);
              } else {
                // 새로 추가한 유저정보 응답
                res.status(200).json(createdUser[0]);
              }
            }
          );
        }
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: "login error" });
    });
});

// 사이트에 처음 접근시 (새로고침시) 유저의 정보를 가져오는 라우터
app.post("/getUserData", (req, res, next) => {
  auth
    //client로 부터 전달받은 idToken을 firebase에 검증함
    .verifyIdToken(req.body.idToken)
    .then((decodedToken) => {
      //firebase로부터 검증된 token(decode된 Token, client에서 전달받은 idToken과는 다름)을 통해 uid 접근
      const uid = decodedToken.uid;

      //DB에서 해당 uid를 가지고 있는 유저정보 확인
      db.query(`SELECT * FROM user WHERE uid = ?;`, [uid], (err, results) => {
        if (err) {
          next(err);
        }
        // 해당 uid와 일치하는 유저정보가 있는 경우 유저정보 응답
        if (results[0]) {
          res.status(200).json(results[0]);
        }

        // 해당 uid와 일치하는 유저정보가 없는 경우 null값 응답
        else {
          res.status(400).json(null);
        }
      });
    })
    .catch((error) => {
      // Handle error
      console.error(error);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  console.error(err);
});

app.listen(8000, () => {
  console.log("Express listen in 8000 port");
});
