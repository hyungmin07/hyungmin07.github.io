document.addEventListener('DOMContentLoaded', function () {
    const hiddenButton = document.getElementById('hiddenButton');
    const buttonContainer = document.getElementById("button");
    const menuListContainer = document.getElementById("menu-list");
    const menuList = document.getElementById("menu-items");

    // 📌 "오늘의 급식은?" 버튼을 클릭하면 날짜 선택 + 메뉴 확인 버튼 표시
    hiddenButton.addEventListener('click', function () {
        if (buttonContainer.style.display === "none" || buttonContainer.style.display === "") {
            buttonContainer.style.display = "block";  // 📌 버튼 보이게 설정
        } else {
            buttonContainer.style.display = "none";  // 📌 다시 누르면 숨김
        }
    });

    async function fetchMenuData() {
        const apiURL = `급식식단정보.json`;
        try {
            const response = await fetch(apiURL);
            if (!response.ok) {
                throw new Error("❌ 급식 정보를 가져올 수 없습니다.");
            }
            return await response.json();
        } catch (error) {
            console.error("⚠️ API 오류:", error);
            throw new Error("급식 정보를 가져올 수 없습니다.");
        }
    }

    document.getElementById('check-menu').addEventListener('click', async function () {
        const dateInput = document.getElementById("date-input").value.replace(/-/g, "");

        if (!dateInput) {
            alert("날짜를 선택해주세요.");
            return;
        }

        try {
            const allMenuData = await fetchMenuData();
            const selectedMenuData = allMenuData.find(menu => menu.MLSV_YMD === dateInput);
            const selectedMenu = selectedMenuData ? selectedMenuData.DDISH_NM.split("<br/>") : ["급식 정보 없음"];

            // 📌 기존 메뉴 리스트 비우기
            menuList.innerHTML = "";

            // 📌 새 메뉴 추가
            selectedMenu.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                menuList.appendChild(li);
            });

            // 📌 메뉴 리스트 보이게 설정
            menuListContainer.style.display = "block";

        } catch (error) {
            alert(error.message);
        }
    });
});
