# 竞赛信息管理系统后台

[前端项目地址](https://github.com/1446445040/competition-system)

后端项目基于 Node.js 开发，主要使用 TypeScript 编写，使用 Express 框架构建 Web 服务器，使用 [Sequelize](https://www.sequelize.com.cn/) 框架操作 MySQL 数据库。

用都用了，点个星星呗。

# 运行方法

请预先安装 Node.js 环境，并在项目根目录下运行以下命令：

```shell
npm install --registry https://registry.npm.taobao.org/ # 使用淘宝镜像源安装依赖包
npm run dev # 启动项目
```

`src/config/config.ts`为配置文件，请填写相关数据库配置，否则无法正常连接。

`src/config/init.sql`为数据库基础数据，sql 文件为 Navicat 导出。请使用该 sql 文件在数据库中初始化数据，否则可能无法正常登陆，大佬自便。

项目默认运行在`3000`端口，如果手动更改端口，请与前端配置保持一致。
