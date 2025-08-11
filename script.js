document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 게임 상태 관리 ---
    const gameState = {
        puzzlesSolved: {
            chair: false,
            candle: false,
            book: false,
        },
        collectedHints: [],
        finalPassword: "2025"
    };

    // --- 2. DOM 요소 가져오기 ---
    const puzzleModal = document.getElementById('puzzle-modal');
    const escapeModal = document.getElementById('escape-modal');
    const puzzleContent = document.getElementById('puzzle-content');
    const hintsCollectedEl = document.getElementById('hints-collected');
    const closeButton = document.querySelector('.close-button');

    // --- 3. 이벤트 리스너 설정 ---
    document.getElementById('object-chair').addEventListener('click', () => showPuzzle('chair'));
    document.getElementById('object-candle').addEventListener('click', () => showPuzzle('candle'));
    document.getElementById('object-book').addEventListener('click', () => showPuzzle('book'));
    document.getElementById('object-door').addEventListener('click', openEscapeDoor);
    // 클릭 시 하이라이트 효과 함수
    function highlightObject(objectId) {
        document.querySelectorAll('.clickable-object').forEach(el => el.classList.remove('active'));
        document.getElementById(objectId).classList.add('active');
        setTimeout(() => {
            document.getElementById(objectId).classList.remove('active');
        }, 500);
    }

    // 각 오브젝트 클릭 시 하이라이트 적용
    document.getElementById('object-chair').addEventListener('click', () => highlightObject('object-chair'));
    document.getElementById('object-candle').addEventListener('click', () => highlightObject('object-candle'));
    document.getElementById('object-book').addEventListener('click', () => highlightObject('object-book'));
    document.getElementById('object-door').addEventListener('click', () => highlightObject('object-door'));

    closeButton.addEventListener('click', () => puzzleModal.style.display = 'none');
    document.getElementById('escape-button').addEventListener('click', checkFinalPassword);

    // 모달 바깥 클릭 시 닫기
    window.addEventListener('click', (event) => {
        if (event.target === puzzleModal) puzzleModal.style.display = 'none';
        if (event.target === escapeModal) escapeModal.style.display = 'none';
    });

    // --- 4. 핵심 함수들 ---

    /** 퍼즐 모달을 열고, 종류에 맞는 퍼즐을 표시하는 함수 */
    function showPuzzle(type) {
        if (gameState.puzzlesSolved[type]) {
            alert('이미 해결한 문제입니다.');
            return;
        }

        puzzleModal.style.display = 'block';
        let content = '';

                        if (type === 'chair') {
                                content = `
                                        <h2>의자 위의 쪽지</h2>
                                        <p>물에 들어가기 전에 가장 먼저 해야 할 일은 무엇일까요?</p>
                                        <form id="puzzle-form">
                                            <label><input type="radio" name="puzzle-answer" value="A"> A. 수영복 입기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="B"> B. 물속에 바로 뛰어들기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="C"> C. 준비운동 하기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="D"> D. 물총 싸움 시작하기</label>
                                        </form>
                                        <button onclick="submitAnswer('chair', 'C')">제출</button>
                                `;
                        } else if (type === 'candle') {
                                content = `
                                        <h2>오래된 도서관의 경고문</h2>
                                        <p>다음 중 물놀이할 때 해서는 안 되는 행동은 무엇일까요?</p>
                                        <form id="puzzle-form">
                                            <label><input type="radio" name="puzzle-answer" value="A"> A. 친구랑 물속에서 장난치기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="B"> B. 구명조끼 입기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="C"> C. 어른과 함께 놀기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="D"> D. 햇볕이 강할 때 모자 쓰기</label>
                                        </form>
                                        <button onclick="submitAnswer('candle', 'A')">제출</button>
                                `;
                        } else if (type === 'book') {
                                content = `
                                        <h2>책 속의 안전 상식</h2>
                                        <p>물이 갑자기 깊어졌을 때, 어떻게 해야 할까요?</p>
                                        <form id="puzzle-form">
                                            <label><input type="radio" name="puzzle-answer" value="A"> A. 계속 수영해서 멀리 가기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="B"> B. 당황해서 소리 지르기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="C"> C. 조용히 물에 떠서 도움을 요청하기</label><br>
                                            <label><input type="radio" name="puzzle-answer" value="D"> D. 눈을 감고 그냥 가만히 있기</label>
                                        </form>
                                        <button onclick="submitAnswer('book', 'C')">제출</button>
                                `;
        }
        puzzleContent.innerHTML = content;
    }

    /** 전역에서 접근 가능하도록 window 객체에 함수 할당 */
    window.submitAnswer = (type, correctAnswer) => {
        const answerEl = document.querySelector('input[name="puzzle-answer"]:checked');
        if (!answerEl) {
            alert('정답을 선택해 주세요.');
            return;
        }
        const userAnswer = answerEl.value;
        if (userAnswer === correctAnswer) {
            // 힌트 문장 매핑
            const hintTexts = {
                '2': '1. 첫 번째와 세 번째 숫자는 2야.',
                '0': '2. 두 번째 숫자는 0이야.',
                '25': '3. 세 번째 숫자와 네 번째 숫자를 합하면 7이야.'
            };
            const hintMsg = hintTexts[getHintForType(type)];
            alert(`정답입니다!\n${hintMsg}`);
            gameState.puzzlesSolved[type] = true;
            addHint(getHintForType(type));
            puzzleModal.style.display = 'none';
        } else {
            alert('틀렸습니다. 다시 생각해 보세요.');
        }
    };

    // 오브젝트별 힌트 반환 함수
    function getHintForType(type) {
        if (type === 'chair') return '2';
        if (type === 'candle') return '0';
        if (type === 'book') return '25';
        return '';
    };
    
    /** 힌트 획득 시 화면에 표시를 업데이트하는 함수 */
    function addHint(hint) {
        if (!gameState.collectedHints.includes(hint)) {
            gameState.collectedHints.push(hint);
            // 힌트를 논리적인 순서대로 정렬
            const order = ['2', '0', '25'];
            const sortedHints = gameState.collectedHints.slice().sort((a,b) => order.indexOf(a) - order.indexOf(b));
            // 힌트 문장 매핑
            const hintTexts = {
                '2': '1. 첫 번째와 세 번째 숫자는 2야.',
                '0': '2. 두 번째 숫자는 0이야.',
                '25': '3. 세 번째 숫자와 네 번째 숫자를 합하면 7이야.'
            };
            // 획득한 힌트만 표시
            hintsCollectedEl.innerHTML = sortedHints.map(h => hintTexts[h]).join('<br>');
        }
    }

    /** 문을 클릭했을 때 최종 비밀번호 모달을 여는 함수 */
    function openEscapeDoor() {
        // 모든 퍼즐을 풀었는지 확인
        if (Object.values(gameState.puzzlesSolved).every(solved => solved)) {
            escapeModal.style.display = 'block';
        } else {
            alert('방 안의 모든 단서를 먼저 확인해야 합니다.');
        }
    }
    
    /** 최종 비밀번호를 확인하는 함수 */
    function checkFinalPassword() {
        const userInput = document.getElementById('final-password').value;
        if (userInput === gameState.finalPassword) {
            alert("정답입니다! 축하합니다, 안전 수칙을 모두 배우고 방을 탈출했습니다!");
            escapeModal.style.display = 'none';
            // 여기서 게임이 끝났음을 알리는 다른 동작을 추가할 수 있습니다.
        } else {
            alert("비밀번호가 틀렸습니다. 획득한 힌트를 다시 조합해 보세요.");
        }
    }
});