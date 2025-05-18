# 📄 User Management 模块接口文档（正式版）
---

## 公共信息
+ **接口前缀**：`/api/users`
+ **数据格式**：请求（Request）和响应（Response）都使用 `application/json`
+ **认证方式**：需要携带认证 Token（JWT 或 Session Cookie，根据你们项目设置）
+ **权限控制**：仅管理员角色（Admin）可以访问

---

## 1. 获取用户列表
### 接口
```plain
http


复制编辑
GET /api/users
```

### 描述
查询用户列表，支持分页、关键词搜索和按角色筛选。

### 请求参数（Query）
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `page` | int | 否 | 页码，默认 1 |
| `limit` | int | 否 | 每页数量，默认 10 |
| `search` | string | 否 | 按用户名或邮箱模糊搜索 |
| `role` | string | 否 | 按角色筛选（可选：`Admin`<br/>、`User`<br/>） |


### 响应示例
```plain
json


复制编辑
{
  "users": [
    {
      "id": "1",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "Admin",
      "status": "Enabled",
      "createdAt": "2025-04-26T08:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

---

## 2. 获取用户详情
### 接口
```plain
http


复制编辑
GET /api/users/{id}
```

### 描述
根据用户ID查询单个用户的详细信息。

### 路径参数
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 用户ID |


### 响应示例
```plain
json


复制编辑
{
  "id": "1",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "Admin",
  "status": "Enabled",
  "createdAt": "2025-04-26T08:30:00Z"
}
```

---

## 3. 创建新用户
### 接口
```plain
http


复制编辑
POST /api/users
```

### 描述
新增一个用户账号。

### 请求体（Body）
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 是 | 用户名 |
| `email` | string | 是 | 邮箱 |
| `password` | string | 是 | 密码（前端加密或后端加密） |
| `role` | string | 是 | 角色（`Admin`<br/>或`User`<br/>） |


### 请求示例
```plain
json


复制编辑
{
  "username": "new_user",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "User"
}
```

### 响应示例
```plain
json


复制编辑
{
  "message": "User created successfully",
  "userId": "2"
}
```

---

## 4. 更新用户信息
### 接口
```plain
http


复制编辑
PUT /api/users/{id}
```

### 描述
更新指定用户的基本信息。

### 路径参数
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 用户ID |


### 请求体（Body）
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `username` | string | 否 | 用户名 |
| `email` | string | 否 | 邮箱 |
| `role` | string | 否 | 角色 |


### 请求示例
```plain
json


复制编辑
{
  "username": "updated_name",
  "email": "updated@example.com",
  "role": "Admin"
}
```

### 响应示例
```plain
json


复制编辑
{
  "message": "User updated successfully"
}
```

---

## 5. 修改用户状态（启用/禁用）
### 接口
```plain
http


复制编辑
PATCH /api/users/{id}/status
```

### 描述
切换用户启用/禁用状态。

### 请求体（Body）
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `status` | string | 是 | 取值：`Enabled`<br/> 或 `Disabled` |


### 请求示例
```plain
json


复制编辑
{
  "status": "Disabled"
}
```

### 响应示例
```plain
json


复制编辑
{
  "message": "User status updated successfully"
}
```

---

## 6. 删除用户
### 接口
```plain
http


复制编辑
DELETE /api/users/{id}
```

### 描述
根据用户ID删除指定用户。

### 路径参数
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 用户ID |


### 响应示例
```plain
json


复制编辑
{
  "message": "User deleted successfully"
}
```

---

# 🛢️ User 数据库表设计（User Table）
表名：`users`

| 字段名 | 类型 | 约束 | 描述 |
| --- | --- | --- | --- |
| `id` | BIGINT / UUID | 主键，自增 / UUID | 用户唯一ID |
| `username` | VARCHAR(50) | 唯一，不为空 | 用户名 |
| `email` | VARCHAR(100) | 唯一，不为空 | 邮箱地址 |
| `password` | VARCHAR(255) | 不为空 | 加密后的密码 |
| `role` | ENUM('Admin', 'User') | 默认 'User' | 角色 |
| `status` | ENUM('Enabled', 'Disabled') | 默认 'Enabled' | 启用状态 |
| `created_at` | DATETIME | 默认当前时间 | 创建时间 |
| `updated_at` | DATETIME | 自动更新 | 最后更新时间 |


---

**字段说明补充：**

+ `id`：可以用整数自增，也可以用UUID。
+ `username` 和 `email` 需要加**唯一索引（Unique Index）**。
+ `password`：存储哈希加密过的密码（比如 bcrypt 加密）。
+ `role`：决定是否能访问管理功能。
+ `status`：方便禁用用户而不直接删除。
+ `created_at` 和 `updated_at`：方便做日志追踪、排序等。

---

# 小总结 ✅
这样一套接口 + 表设计，  
可以满足你们"校园告示板"后台系统的 **用户管理需求**，而且结构非常标准化，将来要对接 Next.js 前端或者后端写权限控制都很方便。



# 📄 Dashboard, Content Management, Schedule Management API Documentation

---

## Dashboard APIs

### 1. 获取统计信息
```http
GET /api/dashboard/stats
```
**描述**：获取平台总内容数、总计划数、总用户数、待审核内容数等统计数据。

**响应示例**：
```json
{
  "totalContents": 128,
  "totalSchedules": 42,
  "totalUsers": 15,
  "pendingAudits": 3,
  "approvedContents": 120,
  "rejectedContents": 5
}
```

---

## Content Management APIs

### 1. 获取内容列表
```http
GET /api/contents?page=1&limit=10&search=xxx&type=video
```
**描述**：分页获取内容列表，支持按名称、类型搜索。

**响应示例**：
```json
{
  "contents": [
    {
      "id": "1",
      "name": "Promo Video",
      "mediaType": "video",
      "url": "https://www.example.com/video1.mp4",
      "uploadTime": "2024-06-01T10:00:00Z",
      "auditStatus": "pending",
      "violationType": "none"
    }
  ],
  "totalPages": 2
}
```

### 2. 获取内容详情
```http
GET /api/contents/{id}
```
**描述**：根据内容ID获取详细信息。

**响应示例**：
```json
{
  "id": "1",
  "name": "Promo Video",
  "mediaType": "video",
  "url": "https://www.example.com/video1.mp4",
  "uploadTime": "2024-06-01T10:00:00Z",
  "auditStatus": "pending",
  "violationType": "none"
}
```

### 3. 新建内容
```http
POST /api/contents
Content-Type: application/json
{
  "name": "Event Poster",
  "mediaType": "image",
  "url": "https://www.example.com/image1.jpg"
}
```
**响应示例**：
```json
{
  "message": "Content created successfully",
  "contentId": "2"
}
```

### 4. 更新内容
```http
PUT /api/contents/{id}
Content-Type: application/json
{
  "name": "Updated Poster",
  "mediaType": "image",
  "url": "https://www.example.com/image1.jpg"
}
```
**响应示例**：
```json
{
  "message": "Content updated successfully"
}
```

### 5. 删除内容
```http
DELETE /api/contents/{id}
```
**响应示例**：
```json
{
  "message": "Content deleted successfully"
}
```

---

## Schedule Management APIs

### 1. 获取计划列表
```http
GET /api/schedules?page=1&limit=10&search=xxx&date=2024-06-01&status=Scheduled
```
**描述**：分页获取计划列表，支持按名称、文件名、日期、状态搜索。
- `search`：按名称或媒体类型模糊搜索
- `date`：筛选开始时间为指定日期的计划（格式：YYYY-MM-DD）
- `status`：筛选计划状态（Scheduled/Pending/Completed）

**响应示例**：
```json
{
  "schedules": [
    {
      "id": 1,
      "name": "Morning Promotion",
      "mediaType": "video",
      "startTime": "2024-06-10T08:00",
      "endTime": "2024-06-10T10:00",
      "status": "Scheduled"
    },
    {
      "id": 2,
      "name": "Event Poster",
      "mediaType": "image",
      "startTime": "2024-06-11T09:00",
      "endTime": "2024-06-11T18:00",
      "status": "Completed"
    }
  ],
  "totalPages": 1
}
```

### 2. 获取计划详情
```http
GET /api/schedules/{id}
```
**描述**：根据计划ID获取详细信息。

**响应示例**：
```json
{
  "id": 1,
  "name": "Morning Promotion",
  "mediaType": "video",
  "startTime": "2024-06-10T08:00",
  "endTime": "2024-06-10T10:00",
  "status": "Scheduled"
}
```

### 3. 新建计划
```http
POST /api/schedules
Content-Type: application/json
{
  "name": "Lunch Break Video",
  "mediaType": "video",
  "startTime": "2024-06-12T12:00",
  "endTime": "2024-06-12T13:00",
  "status": "Scheduled"
}
```
**响应示例**：
```json
{
  "message": "Schedule created successfully",
  "scheduleId": 3
}
```

### 4. 更新计划
```http
PUT /api/schedules/{id}
Content-Type: application/json
{
  "name": "Updated Lunch Video",
  "startTime": "2024-06-12T12:30",
  "endTime": "2024-06-12T13:30",
  "status": "Completed"
}
```
**响应示例**：
```json
{
  "message": "Schedule updated successfully"
}
```

### 5. 删除计划
```http
DELETE /api/schedules/{id}
```
**响应示例**：
```json
{
  "message": "Schedule deleted successfully"
}
```

---

# 📄 `/api/schedules?current=true` 接口文档（专门给 Home 页使用）
---

## 接口
```plain
http


复制编辑
GET /api/schedules?current=true
```

## 描述
查询**当前时刻**应该播放的内容，返回正在播放的媒体（视频或图片）。

可以增加灵活的容错时间，比如提前/延迟几分钟，防止因设备时间误差导致漏播放。

---

## 请求参数（Query）
| 参数 | 类型 | 是否必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `current` | boolean | 是 | - | 固定传 `true`<br/>，启用当前播放过滤 |
| `offsetBefore` | int | 否 | `0` | 开始时间**提前**多少分钟（防止播放设备慢） |
| `offsetAfter` | int | 否 | `0` | 结束时间**延后**多少分钟（防止播放设备快） |


---

## 逻辑说明
+ 当前时间：设备端 `new Date()`
+ 返回条件：

```plain
复制编辑
(startTime - offsetBefore分钟) <= 当前时间 <= (endTime + offsetAfter分钟)
```

+ 比如：
    - `offsetBefore = 5`，`offsetAfter = 5`
    - 那么：设备会提前5分钟开始播放，结束后5分钟之内也还算有效播放窗口。
    - 这样可以防止因为设备时钟差异出现"空白播放"的情况。

---

## 请求示例
```plain
http


复制编辑
GET /api/schedules?current=true&offsetBefore=5&offsetAfter=5
```

---

## 响应示例
如果有正在播放的内容，返回数组：

```plain
json


复制编辑
[
  {
    "id": "301",
    "name": "Morning Assembly",
    "mediaType": "video",
    "fileUrl": "https://example.com/videos/assembly.mp4",
    "startTime": "2025-04-28T08:00:00Z",
    "endTime": "2025-04-28T08:30:00Z",
    "status": "Scheduled"
  }
]
```

如果没有任何播放内容，返回空数组：

```plain
json


复制编辑
[]
```

# 📄 Authentication 接口文档（登录 & 注册）

---

## 🔐 注册用户（Register）

### 接口说明

* **URL**：`POST /api/auth/register`
* **内容类型**：`application/json`
* **认证**：不需要 Token

### 请求参数

| 字段名           | 类型     | 必填 | 描述       |
| ------------- | ------ | -- | -------- |
| `username`    | string | 是  | 登录用户名，唯一 |
| `email`       | string | 是  | 用户邮箱，唯一  |
| `password`    | string | 是  | 用户密码（明文） |
| `contactName` | string | 否  | 联系人姓名    |
| `phone`       | string | 否  | 联系电话     |
| `companyName` | string | 否  | 公司名称     |
| `address`     | string | 否  | 公司地址     |

### 请求示例

```json
{
  "username": "testuser1",
  "email": "testuser1@example.com",
  "password": "SecureP@ssword123",
  "contactName": "Alice Chen",
  "phone": "1234567890",
  "companyName": "Example Tech Ltd.",
  "address": "123 Orchard Road, Singapore"
}
```

### 响应示例

```json
{
  "message": "Registration successful"
}
```

---

## 🔓 登录用户（Login）

### 接口说明

* **URL**：`POST /api/auth/login`
* **内容类型**：`application/json`
* **认证**：不需要 Token

### 请求参数

| 字段名        | 类型     | 必填 | 描述       |
| ---------- | ------ | -- | -------- |
| `username` | string | 是  | 登录用户名    |
| `password` | string | 是  | 用户密码（明文） |

### 请求示例

```json
{
  "username": "testuser1",
  "password": "SecureP@ssword123"
}
```

### 响应示例

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---


## 3. 忘记密码 Forgot Password

### 接口

```http
POST /api/auth/forgot-password
```

### 描述

提交邮箱以接收重置密码链接。

### 请求体（Body）

| 字段      | 类型     | 是否必填 | 说明   |
| ------- | ------ | ---- | ---- |
| `email` | string | 是    | 注册邮箱 |

### 请求示例

```json
{
  "email": "john@example.com"
}
```

### 响应示例

```json
{
  "message": "Reset link sent to email."
}
```

---

## 4. 支付订阅 Pay Subscription

### 接口

```http
POST /api/payments/subscribe
```

### 描述

用户填写订阅支付信息，激活订阅功能。

### 请求体（Body）

| 字段           | 类型     | 是否必填 | 说明          |
| ------------ | ------ | ---- | ----------- |
| `cardNumber` | string | 是    | 银行卡卡号       |
| `cardName`   | string | 是    | 持卡人姓名       |
| `expiry`     | string | 是    | 过期时间（MM/YY） |
| `cvv`        | string | 是    | 卡背后三位数      |

### 请求示例

```json
{
  "cardNumber": "4242424242424242",
  "cardName": "John Doe",
  "expiry": "05/26",
  "cvv": "123"
}
```

### 响应示例

```json
{
  "message": "Payment successful. Subscription activated."
}
```

---

## 📝 小结

该模块提供用户基础认证操作，包括注册、登录、密码找回与付费订阅功能，为系统安全与用户接入提供统一接口标准。

---
