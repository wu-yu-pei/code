FROM node:20-alpine3.21

# 设置工作目录
WORKDIR /app

# 先复制依赖文件（利用缓存）
COPY package.json ./

# 安装依赖
RUN npm install -g pnpm && \
    pnpm install

# 再复制代码（生产用）
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
