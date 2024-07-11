# 使用 as 来为某一阶段命名
FROM node:lts-alpine as builder

# 设置环境
ENV PROJECT_DIR=/node_nest_api \
    SERVER_PORT=3000 \
    SOCKET_PORT=3001

# cd 到 /node_nest_api
WORKDIR $PROJECT_DIR

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone

# install & build


# export port
EXPOSE $SERVER_PORT $SOCKET_PORT

# 容器启动时执行的命令，类似npm run start
# # 容器启动时执行的命令，类似npm run start 使用pm2进行启动管理