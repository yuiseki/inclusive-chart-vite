# バブル可視化の練習

## 前提

[README.md](/README.md) で書かれているセットアップができていて http://localhost:3000/inclusive-chart-vite/ でインクルーシブチャートが見れること。

http://localhost:3000/ で `practice` を選択して下さい。  
または http://localhost:3000/inclusive-chart-vite/#practice を開いて下さい。

## 練習用データの場所

- `src/data/practice.json`
- `src/data/practiceDims.json`

## `src/data/practice.json` をいじる

### バブルを追加してみる

`src/data/practice.json` に一行追加して、以下のように変更してみましょう。

```
[
  {"sizeValue":"12544000","colorValue":"foo","xValue":"bottom","yValue":"right", "name": "日本人口"},
  {"sizeValue":"2049630","colorValue":"baz","xValue":"middle","yValue":"middle", "name": "生活保護実人員"},
  {"sizeValue":"1","colorValue":"bar","xValue":"top","yValue":"left", "name": "あなた"}
]
```

データを変更すればバブルに即座に反映されるはずです。  
自動で更新されない場合は、画面をリロードしてみてください。

同じように、他の統計データも追加してみましょう。

```
[
  {"sizeValue":"12544000","colorValue":"foo","xValue":"bottom","yValue":"right", "name": "日本人口"},
  {"sizeValue":"2049630","colorValue":"baz","xValue":"middle","yValue":"middle", "name": "生活保護実人員"},
  {"sizeValue":"1230000","colorValue":"piyo","xValue":"middle","yValue":"middle", "name": "母子世帯"},
  {"sizeValue":"180000","colorValue":"hoge","xValue":"middle","yValue":"middle", "name": "父子世帯"},
  {"sizeValue":"1","colorValue":"bar","xValue":"top","yValue":"left", "name": "あなた"}
]
```

最も基本となるバブルの追加方法については、以上です。  
まずはここまでやってみましょう。

## `src/data/practiceDims.json` をいじる

### x 軸と y 軸を連続的にする

TBW

### より複雑なデータ構造の扱い

TBW
