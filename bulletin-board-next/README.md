📚 capstone_project 操作指南

GitHub 仓库地址：👉 https://github.com/nxiazhou/capstone_project

# 1. 如何在本地运行项目（首次安装）

适用于第一次在新环境运行项目（比如新电脑或者新服务器）。

1. 克隆仓库（如果未克隆）
git clone https://github.com/nxiazhou/capstone_project.git

2. 进入项目目录
cd capstone_project

3. 安装依赖
npm install

4. 运行开发环境
npm run dev

5. 打开浏览器访问
http://localhost:3000

# 2. 如何从 GitHub 上拉取并更新代码

保持你的本地仓库与远程 GitHub 仓库同步。

1. 进入项目目录
cd capstone_project

2. 拉取最新远程代码
git pull origin main

如果有更新，会自动同步到本地。

# 3. 如何提交你的更改到 GitHub

修改完代码后，记得提交和推送到 GitHub。

1. 查看当前更改
git status

2. 添加所有更改
git add .

3. 写提交信息（commit message）
git commit -m "描述你的更改"

4. 推送到 GitHub
git push origin main

# 4. 如何处理合并冲突（如果遇到冲突）

多人同时开发时可能出现冲突，按照下面步骤解决。

1. 拉取远程最新代码，可能会提示冲突
git pull origin main

2. 根据提示，手动编辑冲突文件，保留正确内容

3. 标记冲突已解决
git add 冲突文件路径

4. 完成合并提交
git commit -m "解决合并冲突"

5. 推送到 GitHub
git push origin main

⚡ 注意：合并冲突出现时，文件中会看到 <<<<<<, ======, >>>>>> 的标记，请小心选择保留版本。

📌 温馨提示

本项目基于 Next.js + Tailwind CSS。

Node.js 推荐版本 v18以上。

修改代码前，请先 pull 最新代码，避免出现冲突。

提交信息要简洁明了，易于跟踪历史更改。

