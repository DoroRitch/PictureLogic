# PictureLogic
JavaScriptで「ピクチャーロジック」が遊べるページを作りました。

```
x, y     // x,yはマスの列数、行数
x_a, x_b // 各マスに入れる数字の指定
x_a
...
y_a, y_b
y_a
...
```

上記の形式でcsvファイルを作成することで、問題を追加することができます。
PicLog.htmlに

```
<button id = "mondai" onclick="setNum(this)">問題名</button>
```

PicLog.js#setNum(evt)に

```
sqitch(quizName) {
  ...
  case "mondai":
    quiz = "Mondai.csv";
    break;
}
```

を記入することでボタンをクリックすることで、正しく指定されていれば問題が表にセットされます。
