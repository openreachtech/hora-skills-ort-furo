# スキル

*[English](./skills.md)*

このパッケージに収録された全 46 スキルのカタログです。各スキルに 1〜2 行の概要を添えています。

各スキルは `kit/skills/frontend/<name>/` に、ドメインディレクトリの直下 1 階層で置かれます。そのフォルダ名がスキルの `name:` であり、インストール後のフォルダ名でもあります。したがって下表の **スキル** だけで足ります。`/name` として呼び出す名前、インストール後に `.claude/skills/` に現れる名前、ソースの置き場所が、すべて同じ 1 つの文字列です。先頭 3 文字はドメインを表します。配置と命名の規則は [flatten ビルド規約](https://github.com/openreachtech/hora-skills-ort-furo/blob/main/.claude/skills/flatten/SKILL.md) を参照してください。各スキルの詳細は、それぞれの `SKILL.md` と、必要なものだけがその隣に持つ `references/` にあります。1 枚で足りるスキルは `references/` を持ちません。参照を持つスキルでは、どの参照が何を定めるかを `SKILL.md` が示します。 以下は領域ごとにまとめています。領域はこのカタログの見出しであり、スキル名の一部ではありません。

### フレームワーク

| スキル | 概要 |
| :-- | :-- |
| `hof-nuxt` | Nuxt/Furo フロントエンドを OpenReach 流に構築します。pages、components、composables、`useState` ストア、AppShare サービス(`$furo`)、middleware、plugins、layouts、型宣言。 |
| `hof-furo-context-patterns` | Furo の Context クラスの使い方。`BaseAppContext` のジェネリクス、`create()`/`setupComponent()` のライフサイクル、setup からの DI、watcher、`*PageContext`/`*Context` の分類。 |
| `hof-furo-env` | Furo の環境変数(`.furo-env` ファイル)を設定します。変数の追加・変更、エンドポイントやキーの配線。 |
| `hof-modules` | 再利用する汎用ロジックはユーティリティ関数や composable ではなくクラスに置きます。Furo は OOP 構成を採るためです。 |
| `hof-prohibits` | Vue コンポーネントの禁止事項。`.vue` の `<template>` 内に JavaScript のロジックを書かず、Context のメンバーへ移します。 |

### コンポーネント

| スキル | 概要 |
| :-- | :-- |
| `hof-cp-button` | クリックで動作するアクショントリガー(送信・プライマリ・アイコン・ローディングボタン)。`FuroButton` へ振り分けます。 |
| `hof-cp-text-field` | 1 行のテキスト入力(メール、パスワード、数値、ファイルアップロード)。`FuroTextField`・`FuroEmailField`・`FuroPasswordField`・`FuroNumberField`・`FuroFileField` へ振り分けます。 |
| `hof-cp-textarea` | 複数行のテキスト入力(コメント欄、説明文フィールド)。`FuroTextarea` へ振り分けます。 |
| `hof-cp-select` | リストから 1 つ以上の値を選ぶ(検索付きドロップダウン、タイプアヘッド、複数選択)。`FuroSelect`・`FuroAutocompleteField` へ振り分けます。 |
| `hof-cp-checkbox-toggle` | 真偽値のコントロール(チェックボックス、オン/オフスイッチ、ツールバーのトグルボタン)。`FuroCheckbox`・`FuroToggle` へ振り分けます。 |
| `hof-cp-toggle-group` | セグメンテッドなトグルコントロール、またはボタン・トグル・区切りをまとめてキーボード操作できるコンテナ。`FuroToggleGroup`・`FuroToolBar` へ振り分けます。 |
| `hof-cp-date-time` | 日付・時刻の選択コントロール。`FuroDatePicker`・`FuroTimeField`・`FuroDateTimePicker` へ振り分けます。 |
| `hof-cp-editor` | リッチテキストの編集領域(WYSIWYG、書式付きコメント、メンション付きチャット入力)。`FuroEditor` へ振り分けます。 |
| `hof-cp-editable-field` | クリックしてその場で編集する値の表示。`FuroEditableField` へ振り分けます。 |
| `hof-cp-control-block` | フォームフィールドをラベル・ヒント・必須マーク・エラーメッセージで包みます。`FuroControlBlock` へ振り分けます。 |
| `hof-cp-table` | 行選択・ソートを伴う表形式データと、そのページ送り。`FuroTable`・`FuroPagination` へ振り分けます。 |
| `hof-cp-tabs` | タブで切り替える領域とセグメンテッドコントロール的なナビゲーション。`FuroTabs` へ振り分けます。 |
| `hof-cp-stepper` | 複数ステップのフロー表示(ウィザードの進捗、多段フォーム、購入ステップ)。`FuroStepper` へ振り分けます。 |
| `hof-cp-collapsible` | 表示/非表示を切り替える領域、または開閉できるセクションの集合(アコーディオン、FAQ リスト)。`FuroCollapsible`・`FuroAccordion` へ振り分けます。 |
| `hof-cp-dialog` | モーダル、確認/破壊的操作のプロンプト、サイドパネル。`FuroDialog`・`FuroAlertDialog`・`FuroDrawer` へ振り分けます。 |
| `hof-cp-popover` | トリガーに紐づくフローティングパネル、またはホバー/フォーカス時のヒント。`FuroPopover`・`FuroTooltip` へ振り分けます。 |
| `hof-cp-dropdown-menu` | ボタンやアイコンから開くアクションメニュー(ケバブ、コンテキスト、三点メニュー)。`FuroDropdownMenu` へ振り分けます。 |
| `hof-cp-toast` | 一時的な通知(成功/失敗のスナックバー、操作後のメッセージ)。`FuroToast`・`FuroToaster` へ振り分けます。 |
| `hof-cp-empty-state` | レコードがない領域のプレースホルダー、または読み込みに失敗して再試行できる領域の表示。`FuroEmptyState`・`FuroErrorState` へ振り分けます。 |
| `hof-cp-splitter` | サイズ変更できる左右のペイン、装飾付きスクロール領域、区切り線。`FuroSplitter`・`FuroScrollArea`・`FuroSeparator` へ振り分けます。 |

### スタイル

| スキル | 概要 |
| :-- | :-- |
| `hof-css` | Furo/Nuxt アプリの CSS アーキテクチャとスタイリング規約。ユニットセレクタの命名、デザイントークン、グローバルスタイルシートのレイヤリング。 |
| `hof-css-layers` | CSS カスケードレイヤー(`@layer`)の規約。レイヤーの順序と各レイヤーの役割。 |
| `hof-css-units` | CSS の単位に関する規約の入口。基準単位や値の粒度などのルールをトピック別にまとめます。 |
| `hof-css-props-naming` | カスタムプロパティの命名規約。値の種類を示すトッププレフィックスのルールと、palette / color の 2 層ルール。 |
| `hof-css-props-prohibits` | カスタムプロパティ定義の禁止事項。相対サイズは huge / large / medium / small / tiny の 5 段階に限定し、過度に細かい段階や `x-` 系のラベルを禁止します。 |
| `hof-css-prohibits` | 禁止する CSS の記法(アンチパターン)を集めた規約。 |
| `hof-css-coding-styles` | CSS のコーディングスタイル(整形と記法)の規約。 |
| `hof-css-line-height` | 既定値は `--value-golden-ratio`(黄金比 1.618)で、単位なしで保持します。個別に別の値が必要な場合のみ上書きします。 |
| `hof-css-z-index` | `z-index` の規約。3 つのレイヤー基準値と `calc()` 記法。 |
| `hof-layout-margin` | Flex / Grid の余白はコンテナの責務で、レイアウトアイテムは margin を持ちません。均等な余白は `gap`、例外的な余白は親から子セレクタで指定します。 |
| `hof-selector-props-sort` | CSS プロパティの並び順(Outer-to-Inner Order)。プロパティが何に作用するかで分類し、外側から内側へ並べ、グループ内はアルファベット順にします。 |
| `hof-animation` | UI アニメーションの規約。そもそも動かすべきか、`--transition-timing-*` トークンからのイージング選択、入場・ポップオーバー・ツールチップ・ブラーの手法。 |

### API クライアント

| スキル | 概要 |
| :-- | :-- |
| `hof-graphql` | Furo アプリの GraphQL。生成されたスキーマ型(`types/graphql-schema.d.ts`)と、`app/graphql/client` 配下の操作クライアント。 |
| `hof-restful` | `app/restfulapi/renchan/` の REST クライアント。GraphQL と同じ Launcher/Payload/Capsule の 3 点構成、`BASE_URL`、`/v1` プレフィックス、アクセストークンヘッダー。 |

### 認証

| スキル | 概要 |
| :-- | :-- |
| `hof-cookie-authentication` | Furo/Nuxt アプリの Cookie 認証。メモリ上のセッション層(トークンストア、再取得、401/205 の自己修復、ルートゲートウェイ、サインアウト)、認証用 GraphQL クライアント、リフレッシュ Cookie をファーストパーティに保つための same-origin 配信。 |

### エラーハンドリング

| スキル | 概要 |
| :-- | :-- |
| `hof-error-handling` | バックエンドのドット区切りエラーコードを `app/constants-error.js` と i18n ロケールパス経由でユーザー向け文言に対応づけ、`errorMessageHashReactive` と `error.vue` で表示します。 |

### UI・UX

| スキル | 概要 |
| :-- | :-- |
| `hof-uiux-context` | `hof-uiux-forge`(生成)と `hof-uiux-audit`(レビュー)が共通で読む `uiux-context.md` を作成・記入します。アプリ種別、ユーザー、スコープ、技術スタック、トークンの場所、アクセシビリティ目標、ブランド。 |
| `hof-uiux-forge` | 本番品質のフロントエンド UI(既定は React/Tailwind)を、最初から正しい状態で生成します。WCAG AA、デザイントークン、インタラクション状態、レスポンシブレイアウト、同意と法務要件。 |
| `hof-uiux-audit` | 既存のフロントエンド成果物(コード、スクリーンショット、モックアップ、公開 URL、Figma)を監査し、UX/UI・インタラクション・アクセシビリティ・法務/同意の問題を重大度順のレポートにします。新規実装はしません。 |

### 検収

| スキル | 概要 |
| :-- | :-- |
| `hof-acceptance-review` | 実装後にアプリ全体を受入観点でレビューします。バックエンドの全操作が UI から到達可能か、エンティティごとの CRUD が揃っているか、操作要素が実際に機能するか、失敗と待ちを正直に伝えているか。 |
| `hof-e2e-test-specification` | E2E テスト仕様書の作成と保守。API の面から導いた「プロダクトが満たすべきこと」をフローごとに列挙した永続的なリストで、操作手順(how)は書きません。 |
---

## 導入

```sh
npm install -D @openreachtech/hora-skills-ort-furo
npx --no hora-skills-ort-furo install
```

`postinstall` フックの宣言、複数ドメインを同じ `.claude/skills/` に入れる方法、配置を最新に保つ方法は [README](https://github.com/openreachtech/hora-skills-ort-furo/blob/main/README.ja.md) にあります。

