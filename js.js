document.addEventListener('DOMContentLoaded', function () {
    const hiddenButton = document.getElementById('hiddenButton');
    const buttonContainer = document.getElementById("button");
    const menuListContainer = document.getElementById("menu-list");
    const menuList = document.getElementById("menu-items");
    const checkMenuButton = document.getElementById('check-menu');

    // 📌 "오늘의 급식은?" 버튼을 클릭하면 날짜 선택 + 메뉴 확인 버튼 표시
    hiddenButton.addEventListener('click', function () {
        if (buttonContainer.style.display === "none" || buttonContainer.style.display === "") {
            buttonContainer.style.display = "block";  // 📌 버튼 보이게 설정
        } else {
            buttonContainer.style.display = "none";  // 📌 다시 누르면 숨김
        }
    });

    // 📌 API 키 및 학교 정보
    const apiKey = "8e7a77dab2f34ff9b3f7d6ead4d6e39f";  // 발급받은 API 키
    const schoolCode = "7011487";  // SD_SCHUL_CODE (학교 코드)
    const officeCode = "B10";  // ATPT_OFCDC_SC_CODE (교육청 코드)

    // 📌 급식 API에서 데이터 가져오기
    async function fetchMenuData(date) {
        const apiURL = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${apiKey}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${date}`;

        try {
            const response = await fetch(apiURL);
            if (!response.ok) {
                throw new Error("❌ 급식 데이터를 불러올 수 없습니다.");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("⚠️ API 오류:", error);
            return null;
        }
    }

    // 📌 "메뉴 확인" 버튼 클릭 시 급식 데이터 가져오기
    checkMenuButton.addEventListener('click', async function () {
        const dateInput = document.getElementById("date-input").value.replace(/-/g, "");

        if (!dateInput) {
            alert("날짜를 선택해주세요.");
            return;
        }

        try {
            const menuData = await fetchMenuData(dateInput);
            if (!menuData || !menuData.mealServiceDietInfo) {
                menuList.innerHTML = "<li>급식 정보 없음</li>";
                return;
            }

            const meals = menuData.mealServiceDietInfo[1].row;
            menuList.innerHTML = "";

            meals.forEach(meal => {
                const mealItem = document.createElement("li");
                mealItem.textContent = meal.DDISH_NM.replace(/\([^\)]*\)/g, "").replace(/<br\/>/g, ", ");
                menuList.appendChild(mealItem);
            });

            menuListContainer.style.display = "block";
        } catch (error) {
            alert("급식 데이터를 가져오는 중 오류가 발생했습니다.");
        }
    });
});
