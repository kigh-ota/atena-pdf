# atena-pdf

## これは何か

家庭でのハガキ宛名印刷に使えるPDFファイルを生成する。

- 宛名や住所などを縦書きで出力できる
- データ：他ソフトウェアで作成したものをCSV形式などで渡す
    - ある程度の表記ゆれ（例：アラビア数字/漢数字の混在、郵便番号のハイフン有無）は吸収できる

### やらないこと

- 印刷（各種ビューアなどで行う想定）
- 住所録データの作成/編集
- 横書きでの出力
- はがき以外の用紙への対応
- 通信面への対応
- フォントの提供
- 業務用途向けの機能

## 使い方

```bash
  Usage: index [options]


  Options:

    --to <toCsvPath>                 宛先データ(CSV) [必須]
    --from <fromJsonPath>            差出人データ(JSON) [必須]
    --columnMap <columnMapJsonPath>  CSVのカラム名
    -h, --help                       output usage information
```

### サンプルデータを使って実行

```bash
$ node src/index.js --to sample/to.csv --from sample/from.json --columnMap sample/columnMap.json
```
