// --------------------盤面作り-----------------------------------------------------------
var color = "black";
function init() {
        var b = document.getElementById("board");
        for (var i = 0; i < 21; i++) {
                var tr = document.createElement("tr");
                for (var j = 0; j < 21; j++) {
                        var td = document.createElement("td");
                        td.className = "cell";
                        td.id = i * 21 + j;
                        td.checked = "white";

                        if (i < 6 && j < 6) {
                                td.style.backgroundColor = "black";
                        }

                        if (i == 5) {
                                td.style.borderBottomStyle = "solid";
                                td.style.borderBottomWidth = "thick";
                        }

                        if ((i - 6) % 5 == 4 && i > 6) {
                                td.style.borderBottomStyle = "solid";
                                td.style.borderBottomWidth = "thin";
                        }

                        if (j == 5) {
                                td.style.borderRightStyle = "solid";
                                td.style.borderRightWidth = "thick";
                        }

                        if ((j - 6) % 5 == 4 && j > 6) {
                                td.style.borderRightStyle = "solid";
                                td.style.borderRightWidth = "thin";
                        }

                        if (i > 5 && j > 5) {
                                td.onclick = clicked;
                                td.onmouseover = focuslight;
                                td.onmouseleave = backWhite;
                        }
                        tr.appendChild(td);
                }
                b.appendChild(tr);
        }
        getCSV();

        // 表の全てのtdを配列化
        TARGETCELLS = document.getElementsByTagName("td");
}

function clicked(evt) {
        if (evt.target.checked == "white") {
                black();
                evt.target.checked = "black";
        } else if (evt.target.checked == "black") {
                gray();
                evt.target.checked = "gray";
        } else if (evt.target.checked == "gray") {
                white();
                evt.target.checked = "white";
        }
        evt.target.style.backgroundColor = color;
}

function black() { color = "black"; }
function gray() { color = "gray"; }
function white() { color = "white"; }

function focuslight(evt) {
        var standardVartiNum = evt.target.id % 21;

        for (var i = 0; i < 126; ++i) {
                if (i % 21 == standardVartiNum) {
                        var targetVartiCell = TARGETCELLS[i];
                        targetVartiCell.style.backgroundColor = "yellow";
                }
        }

        var standardHoliNum = Math.floor(evt.target.id / 21);
        for (var i = 0; i < 6; ++i) {
                var targetHoliNum = TARGETCELLS[standardHoliNum * 21 + i];
                targetHoliNum.style.backgroundColor = "yellow";
        }
}

function backWhite(evt) {
        var standardVartiNum = evt.target.id % 21;

        for (var i = 0; i < 126; ++i) {
                if (i % 21 == standardVartiNum) {
                        var targetVartiCell = TARGETCELLS[i];
                        targetVartiCell.style.backgroundColor = "white";
                }
        }

        var standardHoliNum = Math.floor(evt.target.id / 21);
        for (var i = 0; i < 6; ++i) {
                var targetHoliNum = TARGETCELLS[standardHoliNum * 21 + i];
                targetHoliNum.style.backgroundColor = "white";
        }
}
// --------------------盤面作り-ここまで----------------------------------------------------------
// --------------------ファイル読込・盤面記入-----------------------------------------------------
var quiz = "default.csv";
var result = [];

function getCSV() {
        var req = new XMLHttpRequest();
        req.open("get", quiz, true);
        req.send(null);

        req.onload = function () {
                convertCSVtoArray(req.responseText);
        }
}

function convertCSVtoArray(str) {

        var tmp = str.split("\n");

        for (var i = 0; i < tmp.length; ++i) {
                result[i] = tmp[i].split(",");
        }

        if (result.length > 1) {
                insert(result);
        }
}

function insert(result) {
        // 挿入開始位置の固定
        const SIDESTART = 111;
        const VARTICALSTART = 131;

        // csvファイルから縦横列読み出し
        var sideLine = result[0][0];
        var varticalLine = result[0][1];

        // 横列の数字挿入
        for (var i = 0; i < sideLine; ++i) {
                var sideLineNo = SIDESTART + i;
                for (var j = 0; j < result[i + 1].length; ++j) {
                        var sideCellNo = sideLineNo - j * 21;
                        var targetSideCell = TARGETCELLS[sideCellNo];
                        targetSideCell.innerHTML = result[i + 1][j];
                }
        }

        // 縦列の数字挿入
        for (var i = 0; i < varticalLine; ++i) {
                var varticalLineNo = VARTICALSTART + i * 21;
                for (var j = 0; j < result[i + Number(sideLine) + 1].length; ++j) {
                        var vartiCellNo = varticalLineNo - j;
                        var targetVartiCell = TARGETCELLS[vartiCellNo];
                        targetVartiCell.innerHTML = result[i + 1 + Number(sideLine)][j];
                }
        }
}

function clearNum() {
        for (var i = 0; i < 126; ++i) {
                var clearSideCell = TARGETCELLS[i];
                clearSideCell.innerHTML = "";
        }

        var vartiClearStart = 126;
        for (var j = 0; j < 15; ++j) {
                for (var i = 0; i < 6; ++i) {
                        var clearVartiCell = TARGETCELLS[vartiClearStart + j * 21 + i];
                        clearVartiCell.innerHTML = "";
                }
        }
}

function setNum(evt) {
        var quizName = evt.id;
        switch (quizName) {
                case "usagi":
                        quiz = "Usagi.csv";
                        break;
                case "fish":
                        quiz = "Fish.csv";
                        break;
        }
        getCSV();
}


// --------------------ファイル読込・盤面記入-ここまで----------------------------------------------------
// ---------------------答え合わせ----------------------------------------------------------------------
function match() {
        var resultText = document.getElementById("resulttext");
        clearFlag = true;
        console.log("start");
        matchX();
        if (clearFlag == false) {
                resultText.textContent = "不正解";
                return;
        }
        matchY();
        if (clearFlag == false) {
                resultText.textContent = "不正解";
        } else {
                resultText.textContent = "正解";
        }
}

function matchX() {
        for (var i = 1; i < 16; ++i) {
                var index = 0;
                var num = 0;
                for (var j = 15; j > 0; --j) {
                        var targetCell = document.getElementById(String(j * 21 + 110 + i));
                        var targetColor = window.getComputedStyle(targetCell, '').backgroundColor;

                        if (j == 1 && Object.is(targetColor, "rgb(0, 0, 0)")) {
                                ++num;
                                if (num != Number(result[i][index])) {
                                        clearFlag = false;
                                        return;
                                }
                        } else if (Object.is(targetColor, "rgb(0, 0, 0)")) {
                                ++num;
                        } else if (Object.is(targetColor, "rgb(128, 128, 128)") ||
                                Object.is(targetColor, "rgb(255, 255, 255)")) {
                                if (num != 0 && Number(result[i][index]) != 0) {
                                        console.log(Number(result[i][index]));
                                        console.log(num);

                                        if (num != Number(result[i][index])) {
                                                clearFlag = false;
                                                return;
                                        }
                                        ++index;
                                }
                                num = 0;
                        }
                }
        }
        return;
}

function matchY() {
        var Ynum = Number(result[0][0]);

        for (var i = 0; i < 15; ++i) {
                var index = 0;
                var num = 0;
                for (var j = 0; j < 15; ++j) {
                        var targetCell = document.getElementById(String((i + 6) * 21 + 20 - j));
                        var targetColor = window.getComputedStyle(targetCell, '').backgroundColor;

                        if (j == 14 && Object.is(targetColor, "rgb(0, 0, 0)")) {
                                ++num;
                                if (num != Number(result[Ynum + 1 + i][index])) {
                                        clearFlag = false;
                                        return;
                                }
                        } else if (Object.is(targetColor, "rgb(0, 0, 0)")) {
                                ++num;
                        } else if (Object.is(targetColor, "rgb(128, 128, 128)") ||
                                Object.is(targetColor, "rgb(255, 255, 255)")) {
                                if (num != 0 && Number(result[Ynum + 1 + i][index]) != 0) {
                                        if (num != Number(result[Ynum + 1 + i][index])) {
                                                clearFlag = false;
                                                return;
                                        }
                                        ++index;
                                }
                                num = 0;
                        }
                }
        }
        return;
}
// ---------------------答え合わせ-ここまで---------------------------------------------------------------------