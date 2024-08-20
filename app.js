const apiKey = `${key}`; // key값

// 중에 한가지 글자로 시작
const arrStartWord = ["가", "나", "다", "라", "마", "바", "사", "아", "자", "차", "카", "타", "파", "하",];

let suggestedWord = "";     // 현재 재시된 단어
let suggestedEndWord = "";  // 현재 제시된 단어 끝 글자
let inputWord = "";         // 입력된 단어
let appearedWord = [];      // 나온적 있는 단어를 저장, 중복된 단어는 불가하도록
let life = 3;               // 목숨
let currentScore = 0;       // 현재 점수
let bestScore;              // 최고 점수
let canClick = false;       // 입력 가능 여부, 이벤트 중복 방지
let timeInterval;           // 타이머

// show first page
const $title = document.querySelector(".h-title");
const $help = document.querySelector(".help-btn"); // 리셋버튼으로 변경

// pages
const $pages = document.querySelectorAll(".sec-main"); // [시작페이지, 게임페이지, 결과페이지]

// buttons
const $startBtn = document.querySelector(".start-btn");
const $restartBtn = document.querySelector(".restart-btn");

// life
const $lifeCount = document.querySelectorAll(".life-count > *");

// timer
const $lossBar = document.querySelector(".loss-bar");
const $progressCount = document.querySelector(".progress-count");

//scores
const $score = document.querySelector(".score");            // 표기 점수
const $bestScore = document.querySelector(".best-score");   // 최고 점수
const $curScore = document.querySelector(".cur-score");     // 최근 점수

const $word = document.querySelector(".word");              // 제시 단어
const $inputWord = document.querySelector("#input-word");   // 입력 단어
const $inputForm = document.querySelector("#input-form");
const $correctMessage = document.querySelector("#correct-message"); // 정답여부 표시 메시지


/** 첫 페이지 로드 */
const showFirstPage = () => {
    location.reload(true); // 페이지 새로고침
};

/** 게임 페이지 보여주기 */
const showGamePage = () => {
    $pages[0].classList.add("hide");
    $pages[1].classList.remove("hide");
};

/** 결과 페이지 보여주기 */
const showResultPage = () => {
    setSocre();
    setBestScore();

    $pages[1].classList.add("hide");
    $pages[2].classList.remove("hide");
};

/** 단어 설정 */
const setWords = () => {
    suggestedWord = $word.textContent;
    inputWord = $inputWord.value;
};

/** 틀리면 메시지 보여주기 */
const wrongInputValue = () => {
    $correctMessage.textContent = "틀렸습니다!";
    $correctMessage.classList.add("show-wrong-animation");
    setTimeout(() => {
        $correctMessage.textContent = "";
        $correctMessage.classList.remove("show-wrong-animation");
    }, 1000);
};

/** 정답 메시지 보여주기 */
const correctInputValue = () => {
    $correctMessage.textContent = "맞았습니다!";
    $correctMessage.classList.add("show-correct-animation");
    setTimeout(() => {
        $correctMessage.textContent = "";
        $correctMessage.classList.remove("show-correct-animation");
    }, 1000);
};

/** 로컬스토리지에서 최고점수 가져오기 */
const getBestScore = () => {
    bestScore = window.localStorage.getItem('best-score');

    if (!bestScore) {
        window.localStorage.setItem('best-score', 0); // 없으면 생성
        bestScore = window.localStorage.getItem('best-score');
    }
}

/** 현재 점수 화면에 업데이트 */
const setSocre = () => $score.textContent = currentScore;

/** 최고점수 업데이트 */
const setBestScore = () => {
    if (currentScore > bestScore) {
        bestScore = currentScore;
        window.localStorage.setItem('best-score', bestScore);
    }

    $bestScore.textContent = bestScore;
    $curScore.textContent = currentScore;
}

/** 목숨 카운트 및 업데이트 */
const lifeCount = () => {
    life -= 1;
    $lifeCount[life].textContent = "heart_broken";
    $lifeCount[life].style.color = "#35353515";
};

/** 게임 시작 */
const startGameSettig = () => {
    const ranWord = arrStartWord[pickRandomNumber(arrStartWord.length)];

    getBestScore();             // 최고점수 가져오기
    getStartWithChar(ranWord);  // 랜덤 한글 문자로 제시어 업데이트
};

/** 타이머 관련 */
const startTimer = () => {
    let countSec = 10;

    if (life === 0) { // 목숨이 0일 때 게임 종료
        showResultPage();
        return;
    }

    canClick = true; // 타이머가 동작하는 시간 동안은 제출버튼 클릭 가능
    $progressCount.textContent = `10초`;
    $lossBar.classList.add("timer-animation"); // 감소 에니메이션 시작

    timeInterval = setInterval(() => { // 1초 10번 반복
        countSec -= 1; // -1초
        $progressCount.textContent = `${countSec}초`;

        if (countSec === 0) { // 시간 초과 시
            $word.textContent = "불러오는 중...";
            $progressCount.textContent = `10초`;
            $lossBar.classList.remove("timer-animation");

            currentScore -= 20; // <-- 시간 초과 시 -20점 -->
            wrongInputValue();  // 메시지 출력
            lifeCount();        // 목숨 하나 제거
            setSocre();         // 점수 업데이트

            if (life === 0) {   // 시간 초과 및 목숨이 0일 때 게임 종료
                showResultPage();
                return;
            } else {
                startGameSettig();          //  다시 랜덤한 문자로 제시어 업데이트
                clearInterval(timeInterval);// 타이머 중지
                canClick = false;           // 다시 제출 버튼 막기
            }
        }
    }, 1000);
};

/** 랜덤으로 0~n 숫자 하나 고름 */
const pickRandomNumber = (n) => Math.floor(Math.random() * (n - 1));

/** 한글 단어 체크 */
const isCheckKorean = (word) => /^[가-힣]+$/.test(word);

/** 단어가 1글자 이상인지 체크 */
const isLengthOverOne = (word) => word.length > 1;

/** 단어 첫 글자가 제시된 끝 글자와 같은지 체크 */
const isSameFirstAndLastChar = (word, dueum) => {
    return dueum ? dueum[dueum.length - 1] === word[0] : suggestedEndWord === word[0];
}

/** 두음법칙 */
const setWordDueum = (word) => {
    const dueumRules = {
        라: "나", 락: "낙", 란: "난", 랄: "날", 람: "남", 랍: "납",
        랑: "낭", 래: "내", 랭: "냉", 냑: "약", 략: "약", 냥: "양",
        량: "양", 녀: "여", 려: "여", 녁: "역", 력: "역", 년: "연",
        련: "연", 녈: "열", 렬: "열", 념: "염", 렴: "염", 렵: "엽",
        녕: "영", 령: "영", 녜: "예", 례: "예", 로: "노", 록: "녹",
        론: "논", 롱: "농", 뢰: "뇌", 뇨: "요", 료: "요", 룡: "용",
        루: "누", 뉴: "유", 류: "유", 뉵: "육", 륙: "육", 륜: "윤",
        률: "율", 륭: "융", 륵: "늑", 름: "늠", 릉: "능", 니: "이",
        리: "이", 린: "인", 림: "임", 립: "입",
    };

    const lastChar = word[word.length - 1];

    // word 마지막 글자를 두음법칙에 맞게 바꿔서 리턴
    return dueumRules[lastChar]
        ? word.slice(0, word.length - 1) + dueumRules[lastChar]
        : word;
};

/** 입력된 단어가 사전에 있는 단어인지 확인 */
const isExistWord = async (word) => {
    const url = `http://localhost:3000/api/dictionary?q=isExist&word=${word}&key=${apiKey}`;

    try {
        $word.textContent = "불러오는 중...";
        $progressCount.textContent = `10초`;

        const response = await fetch(url);
        const datas = await response.json();
        const arrData = datas.channel.item; // word와 일치하는 단어 배열
        let pickedWord = arrData[0].word;   // 배열 중 가장 첫번째 단어 가져옴
        // const pickedCode = arrData[0].target_code; // 단어 코드

        if (appearedWord.includes(pickedWord)) { // 중복된 단어라면
            $lossBar.classList.remove("timer-animation");
            clearInterval(timeInterval);

            canClick = false;

            currentScore -= 10; // <-- 중복단어 -10점 -->
            wrongInputValue();  // 메시지 출력
            lifeCount();        // 목숨 하나 제거
            setSocre();         // 점수 업데이트

            startTimer(); // 타이머 다시 시작
            $word.textContent = suggestedWord; // 다시 기존 제시어로 표시
        } else {
            appearedWord.push(pickedWord);

            currentScore += 40; // <-- 정답! +40점 -->
            correctInputValue();// 메시지 출력
            setSocre();         // 점수 업데이트

            suggestedEndWord = pickedWord[pickedWord.length - 1];   // 입력한 단어로 끝 글자 설정
            getStartWithChar(suggestedEndWord);                     // 설정한 끝 글자로 제시어 업데이트
        }
    } catch (error) {
        currentScore -= 30; // <-- 단어가 없는 경우 -30점 -->
        wrongInputValue();  // 메시지 출력
        lifeCount();        // 목숨 하나 제거
        setSocre();         // 점수 업데이트

        startTimer(); // 타이머 다시 시작
        $word.textContent = suggestedWord; // 다시 기존 제시어로 표시
    }
};

/** 특정 글자로 시작하는 단어 찾아서 재시어 수정 */
const getStartWithChar = async (char) => {
    const url = `http://localhost:3000/api/dictionary?q=getStart&word=${char}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const datas = await response.json();
        const arrData = datas.channel.item; // 받아온 데이터 배열
        const ranNum = pickRandomNumber(arrData.length); // 배열의 길이 안에서 랜덤 숫자
        let pickedWord = arrData[ranNum].word; // 배열에서 랜덤으로 가져온 단어
        // const pickedCode = arrData[ranNum].target_code; // 단어 코드

        if (appearedWord.includes(pickedWord)) {    // 중복된 단어라면
            getStartWithChar(char);                 // 다시 검색 
        } else {
            appearedWord.push(pickedWord);

            suggestedEndWord = pickedWord[pickedWord.length - 1];   // 가져온 단어로 끝 글자 업데이트
            $word.textContent = pickedWord;                         // 가져온 단어로 업데이트
            startTimer();                                           // 타이머 다시 시작
        }
    } catch (error) { // 없을때(보통 두음법칙이 적용되는 단어들)
        let dueumChar = setWordDueum(char);

        if (dueumChar === char) {   //  사전에서 단어를 찾을 수 없는 경우
            currentScore += 40;     // <-- +40점 -->
            correctInputValue();    // 메시지 출력
            setSocre();             // 점수 업데이트
            startGameSettig();      // 다시 랜덤한 문자로 제시어 업데이트
        } else {
            getStartWithChar(dueumChar);
        }
    }
};

// 다시하기 버튼 클릭 이벤트, 첫 화면으로 돌아감
$help.addEventListener("click", () => {
    showFirstPage();
});
// 재시작 버튼 클릭 이벤트, 첫 화면으로 돌아감
$restartBtn.addEventListener("click", () => {
    showFirstPage();
});
// 상단 타이틀 클릭 이벤트, 첫 화면으로 돌아감
$title.addEventListener("click", () => {
    showFirstPage();
});

// 게임시작 버튼 클릭 이벤트
$startBtn.addEventListener("click", () => {
    showGamePage();
    startGameSettig();
});

// 단어 입력 이벤트
$inputForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (canClick) { // 중복 클릭 방지
        setWords();

        $lossBar.classList.remove("timer-animation");
        clearInterval(timeInterval);

        canClick = false;

        if (isCheckKorean(inputWord) && isLengthOverOne(inputWord) && isSameFirstAndLastChar(inputWord)) {
            isExistWord(inputWord);
        } else if (isCheckKorean(inputWord) && isLengthOverOne(inputWord)) {
            let dueum = setWordDueum(suggestedWord); // 제시어에 두음법칙 적용

            // 두음법칙 적용 시
            if (isSameFirstAndLastChar(inputWord, dueum)) isExistWord(inputWord);

        } else {
            currentScore -= 30; // <-- 틀린 단어 입력 -30점 -->
            wrongInputValue();  // 메시지 출력
            lifeCount();        // 목숨 하나 제거
            setSocre();         // 점수 업데이트

            startTimer();
        }

        $inputWord.value = "";
    }
});