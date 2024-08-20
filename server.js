const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/dictionary', async (req, res) => {
    const { word, key, q } = req.query;  // 클라이언트로부터 검색어와 API 키를 받음

    let apiUrl;

    if (q === "getStart") {
        apiUrl = `https://stdict.korean.go.kr/api/search.do?certkey_no=${키넘버}&key=${key}&type_search=search&num=100&req_type=json&q=${word}&advanced=y&method=start&letter_s=2&pos=1,2`;
    } else if (q === "getEnd") {
        apiUrl = `https://stdict.korean.go.kr/api/search.do?certkey_no=${키넘버}&key=${key}&type_search=search&num=100&req_type=json&q=${word}&advanced=y&method=end&letter_s=2&pos=1,2`;
    } else if (q === "isExist") {
        apiUrl = `https://stdict.korean.go.kr/api/search.do?certkey_no=${키넘버}&key=${key}&type_search=search&num=100&req_type=json&q=${word}&advanced=y&method=exact&letter_s=2&pos=1,2`;
    }

    try {
        // API에 요청 보내기
        const response = await axios.get(apiUrl);
        // JSON 형식으로 응답 전달
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'API 요청 실패' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
