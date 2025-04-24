🧾 Git 操作指南（含项目运行命令）
✅ 1. 推送代码到 GitHub 仓库
bash
复制
编辑
# 初始化 Git 仓库（只需第一次）
git init

# 添加所有文件
git add .

# 提交改动（写明做了什么）
git commit -m "Initial front-end commit"

# 添加远程仓库（只需第一次）
git remote add origin https://github.com/nxiazhou/capstone_project.git

# 拉取远程 main 分支，合并仓库结构（如已有 README、back-end 等）
git pull origin main --allow-unrelated-histories

# 解决冲突后再次提交
git add .
git commit -m "Resolve merge conflict"

# 推送代码到远程仓库
git push origin main
✅ 2. 提交日常更新
bash
复制
编辑
# 拉取最新远程代码（避免冲突）
git pull origin main

# 添加所有变更
git add .

# 提交说明
git commit -m "Add user login page + navbar layout"

# 推送到远程主分支
git push origin main
✅ 3. 使用分支开发（多人协作）
bash
复制
编辑
# 创建并切换到新分支
git checkout -b feature/user-management

# 正常开发后，提交改动
git add .
git commit -m "Create user management UI"

# 推送该分支
git push origin feature/user-management

# （建议在 GitHub 上创建 Pull Request 合并进 main）
✅ 4. 合并分支（本地）
bash
复制
编辑
# 切换回 main 分支
git checkout main

# 拉取最新
git pull origin main

# 合并功能分支
git merge feature/user-management

# 推送合并后的代码
git push origin main
✅ 5. 处理冲突（如果 pull 或 merge 报错）
bash
复制
编辑
# Git 会提示有冲突的文件
# 打开冲突文件，手动处理冲突标记：
# <<<<<<< HEAD、=======、>>>>>>> 这些标记保留你要的代码

# 然后继续提交
git add .
git commit -m "Fix conflict in Login.jsx"
git push origin main
🧪 项目启动：从 GitHub 克隆并运行代码
bash
复制
编辑
# 克隆项目
git clone https://github.com/nxiazhou/capstone_project.git

# 进入前端目录（假设代码在 front-end 文件夹）
cd capstone_project/front-end

# 安装依赖（React、Tailwind、Flowbite 等）
npm install

# 启动开发服务器
npm start
📝 补充命令（Tailwind 或 Router 没装时）
bash
复制
编辑
# 如需安装 Tailwind + React Router
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

npm install react-router-dom
npm install flowbite
✅ 推荐 commit 语法

类型	示例
✨ 功能	Add login page layout
🐛 修复	Fix navbar icon hover issue
♻️ 重构	Refactor Sidebar to use map()
🔧 配置	Update tailwind.config.js for Flowbite
