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



# 📄 Schedule Management 模块接口文档（正式版）
---

## 公共信息
+ **接口前缀**：`/api/schedules`
+ **数据格式**：请求（Request）和响应（Response）都使用 `application/json`
+ **认证方式**：需要携带认证 Token
+ **权限控制**：仅管理员角色（Admin）可以访问

---

## 1. 获取播放计划列表
### 接口
```plain
http


复制编辑
GET /api/schedules
```

### 描述
查询所有播放计划，支持分页、关键词搜索（按名称/文件名）和日期筛选。

### 请求参数（Query）
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `page` | int | 否 | 页码，默认 1 |
| `limit` | int | 否 | 每页数量，默认 10 |
| `search` | string | 否 | 搜索关键词（按名称或文件名模糊搜索） |
| `startDate` | string (ISO Date) | 否 | 筛选起始日期 |
| `endDate` | string (ISO Date) | 否 | 筛选结束日期 |


---

### 响应示例
```plain
json


复制编辑
{
  "schedules": [
    {
      "id": "101",
      "name": "Morning Promotion",
      "mediaType": "video",
      "fileUrl": "https://example.com/videos/promo.mp4",
      "startTime": "2025-04-28T08:00:00Z",
      "endTime": "2025-04-28T10:00:00Z",
      "status": "Scheduled",
      "createdAt": "2025-04-26T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 30,
    "page": 1,
    "limit": 10
  }
}
```

---

## 2. 获取单个播放计划详情
### 接口
```plain
http


复制编辑
GET /api/schedules/{id}
```

### 描述
根据播放计划ID查询详细信息。

### 路径参数
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 播放计划ID |


---

### 响应示例
```plain
json


复制编辑
{
  "id": "101",
  "name": "Morning Promotion",
  "mediaType": "video",
  "fileUrl": "https://example.com/videos/promo.mp4",
  "startTime": "2025-04-28T08:00:00Z",
  "endTime": "2025-04-28T10:00:00Z",
  "status": "Scheduled",
  "createdAt": "2025-04-26T10:00:00Z"
}
```

---

## 3. 创建新的播放计划
### 接口
```plain
http


复制编辑
POST /api/schedules
```

### 描述
新增一个播放排期，比如安排某个视频/图片在某个时间段播放。

### 请求体（Body）
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 是 | 播放计划名称 |
| `mediaType` | string | 是 | 媒体类型（可选值：`video`<br/>、`image`<br/>） |
| `fileUrl` | string | 是 | 媒体文件地址（URL） |
| `startTime` | string (ISO DateTime) | 是 | 开始播放时间 |
| `endTime` | string (ISO DateTime) | 是 | 结束播放时间 |


---

### 请求示例
```plain
json


复制编辑
{
  "name": "Lunch Break Video",
  "mediaType": "video",
  "fileUrl": "https://example.com/videos/lunch.mp4",
  "startTime": "2025-04-28T12:00:00Z",
  "endTime": "2025-04-28T13:00:00Z"
}
```

---

### 响应示例
```plain
json


复制编辑
{
  "message": "Schedule created successfully",
  "scheduleId": "102"
}
```

---

## 4. 更新播放计划
### 接口
```plain
http


复制编辑
PUT /api/schedules/{id}
```

### 描述
更新指定播放计划的信息，比如修改时间或换一个新的媒体。

### 路径参数
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 播放计划ID |


---

### 请求体（Body）
| 字段 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 否 | 播放计划名称 |
| `mediaType` | string | 否 | 媒体类型（`video`<br/> 或 `image`<br/>） |
| `fileUrl` | string | 否 | 媒体文件地址 |
| `startTime` | string (ISO DateTime) | 否 | 开始时间 |
| `endTime` | string (ISO DateTime) | 否 | 结束时间 |
| `status` | string | 否 | 状态（`Scheduled`<br/> / `Paused`<br/> / `Completed`<br/>） |


---

### 请求示例
```plain
json


复制编辑
{
  "name": "Updated Lunch Video",
  "startTime": "2025-04-28T12:30:00Z",
  "endTime": "2025-04-28T13:30:00Z"
}
```

---

### 响应示例
```plain
json


复制编辑
{
  "message": "Schedule updated successfully"
}
```

---

## 5. 删除播放计划
### 接口
```plain
http


复制编辑
DELETE /api/schedules/{id}
```

### 描述
删除一个播放安排。

### 路径参数
| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 播放计划ID |


---

### 响应示例
```plain
json


复制编辑
{
  "message": "Schedule deleted successfully"
}
```

---

# 🛢️ Schedule 数据库表设计（Schedule Table）
表名：`schedules`

| 字段名 | 类型 | 约束 | 描述 |
| --- | --- | --- | --- |
| `id` | BIGINT / UUID | 主键，自增 / UUID | 播放计划唯一ID |
| `name` | VARCHAR(100) | 不为空 | 播放计划名称 |
| `mediaType` | ENUM('video', 'image') | 不为空 | 媒体类型 |
| `fileUrl` | VARCHAR(255) | 不为空 | 媒体文件地址（URL） |
| `startTime` | DATETIME | 不为空 | 播放开始时间 |
| `endTime` | DATETIME | 不为空 | 播放结束时间 |
| `status` | ENUM('Scheduled', 'Paused', 'Completed') | 默认 'Scheduled' | 当前排期状态 |
| `created_at` | DATETIME | 默认当前时间 | 创建时间 |
| `updated_at` | DATETIME | 自动更新时间 | 最后更新时间 |


---

# 📌 小结
这样你的 **Schedule Management** API和数据库字段就非常完整了✅，而且：

+ 每条播放计划都能指定：**播放什么**、**从什么时候到什么时候**。
+ 支持不同类型的媒体：**视频**、**图片**。
+ 可以随时更新、删除播放排期。
+ 前端可以直接用分页 + 搜索接口来加载安排表格。

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
    - 这样可以防止因为设备时钟差异出现“空白播放”的情况。

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

