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
| themes | HTMLの共通部分パーツ：MTの共通部用などに利用 |
| gulp | gulp用の設定ファイル |
| html | 出力コード：触るな危険 |

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
