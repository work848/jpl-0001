# 日语动词形容词助手

一个帮助中国日语学习者掌握日语动词和形容词变形规则的学习工具，支持变形查询、词库管理和卡片复习。

## 功能特性

### 1. 动词变形查询
- 支持一类动词（五段）、二类动词（一段）、三类动词（不规则）
- 可查询11种变形：
  - 基本型过去式
  - 基本型的否定
  - 基本型的过去否定
  - 动词て形
  - 动词基本型的连用形
  - 动词的被动形式
  - 动词的使役形式
  - 动词的命令形
  - 动词的可能性
  - 动词的意志性
  - 动词ます形
- 支持多选变形类型，默认选中「基本型过去式」和「基本型的否定」
- 查询结果可一键加入词库

### 2. 形容词变形查询
- 支持1类形容词（い形容词）和2类形容词（な形容词）
- 自动输出3种变形：
  - 形容词的过去式
  - 形容词ば形
  - 形容词的名词化
- 查询结果可一键加入词库

### 3. 词库卡片练习
- 所有查询过的动词和形容词自动保存到词库
- 卡片式复习，点击翻转查看答案
- 支持上一个/下一个导航
- 支持「不再出现」功能标记已掌握词汇
- 可设置每次复习的单词数量
- 可选择练习内容：全部/仅动词/仅形容词

## 技术栈

- **前端**: React 18 + TypeScript + Vite + TailwindCSS 3 + React Router + Zustand
- **后端**: Node.js + Express 4 + TypeScript
- **数据持久化**: JSON 文件存储
- **HTTP 客户端**: Axios
- **图标库**: Lucide React

## 项目结构

```
test1/
├── api/                    # 后端代码
│   ├── controllers/        # 控制器
│   ├── routes/             # 路由
│   ├── services/           # 业务逻辑
│   │   ├── verbConjugation.ts      # 动词变形引擎
│   │   ├── adjectiveConjugation.ts # 形容词变形引擎
│   │   └── dataStore.ts           # 数据存储服务
│   ├── data/               # JSON 数据文件
│   │   ├── verbs.json
│   │   ├── adjectives.json
│   │   └── settings.json
│   ├── app.ts              # Express 应用配置
│   └── server.ts           # 服务器入口
├── shared/                 # 共享类型定义
│   └── types.ts
├── src/                    # 前端代码
│   ├── components/         # 公共组件
│   │   ├── Navbar.tsx
│   │   ├── MultiSelect.tsx
│   │   ├── ResultCard.tsx
│   │   ├── FlashCard.tsx
│   │   └── ErrorMessage.tsx
│   ├── pages/              # 页面组件
│   │   ├── VerbPage.tsx
│   │   ├── AdjectivePage.tsx
│   │   └── PracticePage.tsx
│   ├── services/           # API 服务
│   │   └── api.ts
│   ├── store/              # 状态管理
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.x
- npm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

项目使用 `concurrently` 同时启动前端和后端：

```bash
npm run dev
```

启动后：
- 前端应用运行在: http://localhost:5173
- 后端 API 运行在: http://localhost:3001
- Vite 会自动代理 `/api` 请求到后端

### 单独启动

如果需要分别启动：

```bash
# 只启动前端
npm run client:dev

# 只启动后端
npm run server:dev
```

### 构建生产版本

```bash
npm run build
```

## API 接口

### 动词相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/verb/conjugate | 动词变形查询 |
| GET | /api/verb | 获取所有动词词库 |
| POST | /api/verb | 新增动词到词库 |
| DELETE | /api/verb/:id | 删除动词 |
| PATCH | /api/verb/:id/hide | 标记动词不再出现 |

### 形容词相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/adjective/conjugate | 形容词变形查询 |
| GET | /api/adjective | 获取所有形容词词库 |
| POST | /api/adjective | 新增形容词到词库 |
| DELETE | /api/adjective/:id | 删除形容词 |
| PATCH | /api/adjective/:id/hide | 标记形容词不再出现 |

### 设置相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/settings | 获取设置 |
| PUT | /api/settings | 更新设置 |

## 使用指南

### 动词变形查询

1. 在「动词变形」页面输入日语动词原型（如：食べる、飲む、する）
2. 选择动词类别：一类动词/二类动词/三类动词
3. 在变形类型下拉框中选择需要的变形（可多选）
4. 点击「查询变形」按钮查看结果
5. 点击「加入词库」可保存该动词用于后续复习

### 形容词变形查询

1. 在「形容词变形」页面输入日语形容词原型（如：高い、賑やか、きれい）
2. 选择形容词类别：1类形容词/2类形容词
3. 点击「查询变形」按钮查看结果
4. 点击「加入词库」可保存该形容词用于后续复习

### 词库练习

1. 在「词库练习」页面查看词库统计
2. 选择练习内容：全部/仅动词/仅形容词
3. 点击「设置」可调整每次复习的单词数量（默认10个）
4. 点击「开始练习」进入复习模式
5. 点击卡片翻转查看答案
6. 使用「上一个」「下一个」按钮切换卡片
7. 点击「不再出现」可标记已掌握词汇，后续不再出现在练习中

## 验证方法

### 1. 验证后端 API

启动服务器后，使用 curl 或 Postman 测试：

```bash
# 测试健康检查
curl http://localhost:3001/api/health

# 测试动词变形
curl -X POST http://localhost:3001/api/verb/conjugate \
  -H "Content-Type: application/json" \
  -d '{"word":"食べる","type":"ichidan","forms":["past","negative","masuForm"]}'

# 测试形容词变形
curl -X POST http://localhost:3001/api/adjective/conjugate \
  -H "Content-Type: application/json" \
  -d '{"word":"高い","type":"i"}'

# 测试获取设置
curl http://localhost:3001/api/settings
```

### 2. 验证前端功能

1. 打开浏览器访问 http://localhost:5173
2. **动词测试**:
   - 输入「食べる」，选择「二类动词」
   - 选择「基本型过去式」「基本型的否定」
   - 点击查询，应看到：食べた、食べない
3. **形容词测试**:
   - 切换到形容词页面
   - 输入「高い」，选择「1类形容词」
   - 点击查询，应看到：高かった、高ければ、高さ
4. **词库测试**:
   - 点击「加入词库」保存几个单词
   - 切换到「词库练习」页面
   - 确认统计数字正确
   - 点击「开始练习」验证卡片功能

### 3. 运行类型检查

```bash
npm run check
```

### 4. 运行代码检查

```bash
npm run lint
```

## 数据存储

所有数据存储在 `api/data/` 目录下的 JSON 文件中：

- `verbs.json` - 动词词库
- `adjectives.json` - 形容词词库  
- `settings.json` - 用户设置

默认设置：
```json
{
  "reviewCount": 10,
  "defaultVerbForms": ["past", "negative"]
}
```

## 变形规则说明

### 动词变形规则

**一类动词（五段动词）**：
- 词尾在う段上，变形时切换到相应段
- て形有特殊音变规则（促音变、イ音变、拨音变）
- 特例：行く → 行って（促音变）

**二类动词（一段动词）**：
- 词尾是「る」，前一个假名在い段或え段上
- 变形时直接去掉「る」加上相应后缀

**三类动词（不规则）**：
- カ变：来る（くる）- 变形完全不规则
- サ变：する - 变形特殊；名词+する 也属于此类

### 形容词变形规则

**1类形容词（い形容词）**：
- 词尾是「い」
- 过去式：~かった
- ば形：~ければ
- 名词化：~さ

**2类形容词（な形容词）**：
- 词干后接「な」修饰名词
- 过去式：~だった
- ば形：~なら
- 名词化：~さ
