# 🕹 끝말잇기 게임

<p align="center">
  <img src="https://github.com/user-attachments/assets/c3bb5e4b-7795-4cec-94de-ec6210c98f1c"  height="400"/>
  <img src="https://github.com/user-attachments/assets/bb80349a-f43f-429b-b5fc-7da647f0f8f2"  height="400"/>
  <img src="https://github.com/user-attachments/assets/260bb065-e8bd-4631-b586-358d776511d3"  height="400"/>
</p>

## 설정
- node.js, "dependencies": { "axios": "^1.7.3", "express": "^4.19.2" }

- [국립국어원 표준국어대사전 오픈 API](https://stdict.korean.go.kr/openapi/openApiInfo.do) 키 발급 필요

  `app.js`에 발급받은 키 값 넣기
  ```javascript
  const apiKey = `${key}`; // key값
  ```
  `server.js`에 키 넘버 넣기
  ```javascript
  apiUrl = `https://stdict.korean.go.kr/api/search.do?certkey_no=${키넘버}&key=${key}...`;
  ```
