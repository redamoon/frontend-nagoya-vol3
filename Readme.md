## 利用アーキテクチャ・バージョン

| アーキテクチャ | バージョン  |
|---|---|
| jQuery | v3.2.1 |
| node.js | v8.6.0 |
| yarn | 1.1.0 |

## ディレクトリ説明

| ディレクトリ | 内容  |
|---|---|
| _resource | 開発用コード：基本ここに書く |
| _resource/common/css | scss格納ディレクトリ |
| mtml | MTのテーマ格納（サーバは別途：）MT本体はVirtualBoxなど仮想ツールで管理 |
| html | 出力コード |

## コーディングガイドライン

* .editorconfig の指定に従うこと

## 環境構築

git でプロジェクトダウンロード後、下記コマンドで node パッケージインストール  
パッケージ管理は yarn で行う

```
$ yarn install
```

### 静的HTML構築環境サーバー起動

```
$ yarn start
```

### ビルドのみ（CSS・JSも圧縮されます）

```
$ yarn run build
```

## Nunjucks Config and Component

* _resource/_layouts/_partial/config.html
* _resource/_layouts/_partial/component.html

## Movable Type Config and Component

* mtml/mt-theme-starterket_website/templates/template_config.mtml
* mtml/mt-theme-starterket_website/templates/template_component.mtml


