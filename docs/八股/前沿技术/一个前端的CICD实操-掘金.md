   

[![](https://p3-passport.byteimg.com/img/user-avatar/0d4bf3b6630c2653032657d93d152ad9~100x100.awebp)](https://juejin.cn/user/870468939167086)

2021年12月04日 13:56 ·  阅读 2449

![一个前端的CI/CD实操](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e7c7c4174c644f0a6f9a299c3112894~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?)  

这篇文章是我的成功记部署的记录，值得纪念。

但是不是教程，仅做自己的流程记录。

作为一个前端，终于学会了用docker部署自己的项目，还是很开心的。

## 安装jenkins

在/home/jenkins/文件夹下创建`docker-compose.yml`，输入下面的内容

```
version: '3'
services:
  jenkins:
    container_name: 'jenkins'
    image: jenkins/jenkins:lts
    restart: always
    user: jenkins:994
    ports:
    - "10050:8080"
    - "50000:500000"
    - "10051:10051"
    volumes:
    - /home/jenkins/data:/var/jenkins_home
    - /usr/bin/docker:/usr/bin/docker
    - /var/run/docker.sock:/var/run/docker.dock
复制代码
```

运行`docker-compose up -d`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73508f70bc034706885453191ad39fab~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## 打印容器信息

运行`docker logs -f jenkins`

获得如下密码：52af7e9aeb9f45fab9b357cd069a5ccd

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0db7dced470457bb8a64af9a46bd4e8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

浏览器访问IP+端口，即可得到如下的效果

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8a41a35ff54417a8febfc2443dae38c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

点击下一步，并选择社区推荐的插件

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67e4a67363744afdb17b98c3e82bf077~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

等待插件安装

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/357b532991644a0ebf5e43777b4a9c9f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

创建用户

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/314cdbaf575a476faa6d7df257015ab2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

这时候会看到一个全局的地址：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5f66c7b8a79421791272bab90a7a519~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

jenkins安装完成界面

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/346bfc73d08a46d99ca5e18941ccbd3e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## 插件安装

### git相关插件推荐

-   GitLab
-   PAM Authentication plugin：权限相关
-   Matrix Authorization Strategy Plugin：权限相关
-   Role-based Authorization Strategy：角色相关
-   LDAP：角色相关
-   GitLab Authentication：gitlab相关
-   ThinBackup：备份jenkins
-   AnsiColor：彩色输出
-   BuildWithParameters: 构建参数

## 使用docker创建gitlab

在/home/gitlab文件夹下创建docker-compose.yml文件

```
version: '2.3'

services:
  redis:
    restart: always
    image: redis:6.2
    command:
    - --loglevel warning
    volumes:
    - redis-data:/data:Z

  postgresql:
    restart: always
    image: sameersbn/postgresql:12-20200524
    volumes:
    - postgresql-data:/var/lib/postgresql:Z
    environment:
    - DB_USER=gitlab
    - DB_PASS=password
    - DB_NAME=gitlabhq_production
    - DB_EXTENSION=pg_trgm,btree_gist

  gitlab:
    restart: always
    image: sameersbn/gitlab:14.4.1
    depends_on:
    - redis
    - postgresql
    ports:
    - "13800:80"
    - "13822:22"
    volumes:
    - gitlab-data:/home/git/data:Z
    healthcheck:
      test: ["CMD", "/usr/local/sbin/healthcheck"]
      interval: 5m
      timeout: 10s
      retries: 3
      start_period: 5m
    environment:
    - DEBUG=false

    - DB_ADAPTER=postgresql
    - DB_HOST=postgresql
    - DB_PORT=5432
    - DB_USER=gitlab
    - DB_PASS=password
    - DB_NAME=gitlabhq_production

    - REDIS_HOST=redis
    - REDIS_PORT=6379

    - TZ=Asia/Kolkata
    - GITLAB_TIMEZONE=Kolkata

    - GITLAB_HTTPS=false
    - SSL_SELF_SIGNED=false

    - GITLAB_HOST=xx.xxx.xx.xxx
    - GITLAB_PORT=13800
    - GITLAB_SSH_PORT=13822
    - GITLAB_RELATIVE_URL_ROOT=
    - GITLAB_SECRETS_DB_KEY_BASE=long-and-random-alphanumeric-string
    - GITLAB_SECRETS_SECRET_KEY_BASE=long-and-random-alphanumeric-string
    - GITLAB_SECRETS_OTP_KEY_BASE=long-and-random-alphanumeric-string

    - GITLAB_ROOT_PASSWORD=xxxxx
    - GITLAB_ROOT_EMAIL=420526391@qq.com

    - GITLAB_NOTIFY_ON_BROKEN_BUILDS=true
    - GITLAB_NOTIFY_PUSHER=false

    - GITLAB_EMAIL=notifications@example.com
    - GITLAB_EMAIL_REPLY_TO=noreply@example.com
    - GITLAB_INCOMING_EMAIL_ADDRESS=reply@example.com

    - GITLAB_BACKUP_SCHEDULE=daily
    - GITLAB_BACKUP_TIME=01:00

    - SMTP_ENABLED=false
    - SMTP_DOMAIN=www.example.com
    - SMTP_HOST=smtp.gmail.com
    - SMTP_PORT=587
    - SMTP_USER=mailer@example.com
    - SMTP_PASS=password
    - SMTP_STARTTLS=true
    - SMTP_AUTHENTICATION=login

    - IMAP_ENABLED=false
    - IMAP_HOST=imap.gmail.com
    - IMAP_PORT=993
    - IMAP_USER=mailer@example.com
    - IMAP_PASS=password
    - IMAP_SSL=true
    - IMAP_STARTTLS=false

    - OAUTH_ENABLED=false
    - OAUTH_AUTO_SIGN_IN_WITH_PROVIDER=
    - OAUTH_ALLOW_SSO=
    - OAUTH_BLOCK_AUTO_CREATED_USERS=true
    - OAUTH_AUTO_LINK_LDAP_USER=false
    - OAUTH_AUTO_LINK_SAML_USER=false
    - OAUTH_EXTERNAL_PROVIDERS=

    - OAUTH_CAS3_LABEL=cas3
    - OAUTH_CAS3_SERVER=
    - OAUTH_CAS3_DISABLE_SSL_VERIFICATION=false
    - OAUTH_CAS3_LOGIN_URL=/cas/login
    - OAUTH_CAS3_VALIDATE_URL=/cas/p3/serviceValidate
    - OAUTH_CAS3_LOGOUT_URL=/cas/logout

    - OAUTH_GOOGLE_API_KEY=
    - OAUTH_GOOGLE_APP_SECRET=
    - OAUTH_GOOGLE_RESTRICT_DOMAIN=

    - OAUTH_FACEBOOK_API_KEY=
    - OAUTH_FACEBOOK_APP_SECRET=

    - OAUTH_TWITTER_API_KEY=
    - OAUTH_TWITTER_APP_SECRET=

    - OAUTH_GITHUB_API_KEY=
    - OAUTH_GITHUB_APP_SECRET=
    - OAUTH_GITHUB_URL=
    - OAUTH_GITHUB_VERIFY_SSL=

    - OAUTH_GITLAB_API_KEY=
    - OAUTH_GITLAB_APP_SECRET=

    - OAUTH_BITBUCKET_API_KEY=
    - OAUTH_BITBUCKET_APP_SECRET=
    - OAUTH_BITBUCKET_URL=

    - OAUTH_SAML_ASSERTION_CONSUMER_SERVICE_URL=
    - OAUTH_SAML_IDP_CERT_FINGERPRINT=
    - OAUTH_SAML_IDP_SSO_TARGET_URL=
    - OAUTH_SAML_ISSUER=
    - OAUTH_SAML_LABEL="Our SAML Provider"
    - OAUTH_SAML_NAME_IDENTIFIER_FORMAT=urn:oasis:names:tc:SAML:2.0:nameid-format:transient
    - OAUTH_SAML_GROUPS_ATTRIBUTE=
    - OAUTH_SAML_EXTERNAL_GROUPS=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_EMAIL=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_NAME=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_USERNAME=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_FIRST_NAME=
    - OAUTH_SAML_ATTRIBUTE_STATEMENTS_LAST_NAME=

    - OAUTH_CROWD_SERVER_URL=
    - OAUTH_CROWD_APP_NAME=
    - OAUTH_CROWD_APP_PASSWORD=

    - OAUTH_AUTH0_CLIENT_ID=
    - OAUTH_AUTH0_CLIENT_SECRET=
    - OAUTH_AUTH0_DOMAIN=
    - OAUTH_AUTH0_SCOPE=

    - OAUTH_AZURE_API_KEY=
    - OAUTH_AZURE_API_SECRET=
    - OAUTH_AZURE_TENANT_ID=

volumes:
  redis-data:
  postgresql-data:
  gitlab-data:
复制代码
```

运行`docker-compose up -d`，等待docker拉取完成。

## jenkins权限配置

### 矩阵授权

选用安全矩阵，需要注意的是，一定要先把当前用户的ID给所有的权限

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1a57b04f1554a43936210f2e8c96a85~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3949ac3062b1476bab1bb3433e41dc1e~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### gitlab授权

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29a9bd3f0cc54d6a83e00d0eda77a5d4~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

对应的是root，而不是simoon

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f6b7c488332408499278c09b3471feb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 配置安全域

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1ae22d8ad75441fb125672134be0e89~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

在gitlab中创建应用

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b665d146c4648e1afe48fe43327f508~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

勾选上API

redirectURI：[xx.xxx.xx.xxx:10050/securityRea…](https://link.juejin.cn/?target=http%3A%2F%2Fxx.xxx.xx.xxx%3A10050%2FsecurityRealm%2FfinishLogin "http://xx.xxx.xx.xxx:10050/securityRealm/finishLogin")

是jenkins的地址+/securityRealm/finishLogin

保存应用后得到下面的内容

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9a3f8bef5e941e6869730fab7b2f753~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

应用ID放到jenkins

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/109e84ae973d4c908122c139b35df852~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

管理中心 -> 网络 -> 外发请求

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2cf9d15c1564a0ca4a39c56b37067c8~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

勾选

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb82563f8c6b4db8a18aa57b0349ae7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

这个时候，gitlub授权就已经成功了。

## jenkins和gitlab对接

### gitlab创建一个私有的项目

在gitlab上面创建两个私有项目，如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a15c5726d3d4e6ab12365afb9019ee3~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 配置jenkins读取项目权限

在jenkins中添加凭据：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d0b8a474b53e4657aa7ac1390954c413~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

系统管理 -> 凭据管理 -> 添加凭据

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d5a7d15fa0f46929e26fd53f7c75922~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

选择ssh username with private key

单独为jenkins和gitlab对接创建一个私密钥对：

```
ssh-keygen -t rsa -b 4096 -C "420526391@qq.com"
复制代码
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c00dd744a46841a4a0eea78709143109~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

然后在jenkins侧方式私钥：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f89a0ed51d9c47f28059c7d70960d6b9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

配置完成图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f42204d80b8844eaa0454380f5649914~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

在gitlab侧配置公钥：

管理 -> 部署秘钥 -> 新建部署秘钥

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3edd029314ff4feb895e9c5a52fc9546~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c514850a6de4115b3486a7c1ab6c024~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57fe465245d24cd7a4d19b72bd5f022c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

gitlab侧配置完成

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68a5bb42882a4f6ab02f63507956fa44~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### gitlab项目中配置仓库选项

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e229c29ee3b4b0989040f94b36d824a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

启用公开访问的部署秘钥

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44c73d9e8518468bad90bd8d0f8f4ecb~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

这一步，jenkins就可以拉取到gitlab的代码了。

## jenkins拉取gitlab的代码

在jenkins创建一个任务

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/016e257a3df6413ab77e60e8c0c5c661~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

在源码管理中，选择git，然后输入项目地址，选择秘钥即可配置完成

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ad8f5690d6c418aa9ba6e29a9f8fa88~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

### 构建触发

点击高级，生成token

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cde281bb6b1740079cc72a037ace8b27~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

在这里需要用到两个东西，先复制下来：

-   webhookUrl
-   Secret token

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/634d92195e644a2f86841243af3274a9~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

webhookurl：[xx.xxx.xx.xxx:10050/project/fro…](https://link.juejin.cn/?target=http%3A%2F%2Fxx.xxx.xx.xxx%3A10050%2Fproject%2Ffront-dev "http://xx.xxx.xx.xxx:10050/project/front-dev")

Secret token: 96018aa86583eea327853bea1f386661

在gitlab的项目中，配置webhookurl和Secret token

设置 -> 集成

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0fc6fa8f68c48ccad00a6a1e8e96d29~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/869104994c4b4da184b32b732b50e396~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

下拉到下面，关闭SSL验证

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/698bf0c733dc44349d19c0d816c68e40~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

此时，我们会看到webhook已经配置完成了。

## jenkins中添加构建操作

在jenkins中选择构建 -> 执行shell

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/274079d0806c4a488898e0e81c5b7c72~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

然后在gitlab的webhook中测试推送。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8988853f3904972839d36b402bb1e34~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

这时候会显示推送成功

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c64cde76cc3498dbc5f558bbbfddb5a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

并且能在jenkins的项目中看到一次成功的推送。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b53591f69d81402297b887bba1c259b4~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93528538513c4831a113b66557c636af~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## 配置vue的构建文件dockerfile

在Vue的[官网 Dockerize Vue.js App](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vuejs.org%2Fv2%2Fcookbook%2Fdockerize-vuejs-app.html "https://cn.vuejs.org/v2/cookbook/dockerize-vuejs-app.html")，有关于dockerfile的配置

在自己的vue项目中新建Dockerfile文件，输入以下内容

```
# 构建
FROM node:10 as build-stage

LABEL maintainer="simoon"

# 创建工作目录
WORKDIR /app

# 把当前目录复制到镜像中来
COPY . .
# 安装依赖
RUN npm install
RUN npm run build

# 把内容复制到一个nginx容器中
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
# 运行起来
CMD ["nginx", "-g", "daemon off;"]
复制代码
```

然后创建.dockerignore文件：

```
# Dependency directory
# https://www.npmjs.org/doc/misc/npm-faq.html#should-i-check-my-node_modules-folder-into-git
node_modules
.DS_Store
dist

# node-waf configuration
.lock-wscript

# Compiled binary addons (http://nodejs.org/api/addons.html)
build/Release
.dockerignore
Dockerfile
*docker-compose*

# Logs
logs
*.log

# Runtime data
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw*
pids
*.pid
*.seed
.git
.hg
.svn
复制代码
```

### 为后端项目添加dockerfile

```
# 构建
FROM node:10 

LABEL maintainer="simoon"

# 创建工作目录
WORKDIR /app

# 把当前目录复制到镜像中来
COPY . .
# 安装依赖
RUN npm install
RUN npm run build
# 暴露端口
EXPOSE 12005
# 挂载一部分数据出来,public 上传静态资源的
VOLUME [ "/app/public" ]

# 运行node名称
CMD [ "node", "dist/server.bundle.js" ]
复制代码
```

后端也要创建一个.dockerignore文件。这里不做赘述。

## 编写构建的shell脚本

jenkins的frontend项目中，做如下配置

### general中添加构建参数

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33b3093c802b49c1aa6bf4d4129a6209~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7ba479f324c4eb0a76e4c135c357ae0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

构建参数如下：

```
#!/bin/bash

CONTAINER=${container_name}
PORT=${port}

echo  ${image_name}:${tag}

echo $CONTAINER -p $PORT:80 ${image_name}:${tag}

RUNNING=${docker inspect --format="{{ .State.Running }}" $CONTAINER 2 > /dev/null}

# 条件判断
if [! -n $RUNNING]; then
echo "$CONTAINER does not exit"
    return 1
fi

if [! -n $RUNNING]; then
echo "$CONTAINER is not running"
    return 2
else
echo "$CONTAINER is runing"
    # delete same name container
    matchingStarted=$(docker ps -a --filter="name=$CONTAINER" -q | xargs)
    if [ -n $matchingStarted ]; then
    docker stop $matchingStarted
    fi
    
    matching=$(docker ps -a --filter="name=$CONTAINER" -q | xargs)
    if [ -n $matching ]; then
    docker rm $matching
    fi
fi

# 完成镜像构建 .指使用当前文件目录下的dockerfile执行
docker build --no-cache -t ${image_name}:${tag} .

# 运行服务
docker run -itd --name $CONTAINER -p $PORT:80 ${image_name}:${tag}
复制代码
```

如果运行构建成功，则会出现下面的内容

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbaddfd3c7174ab4a4f43db60ad3853f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

此时，就可以访问前端项目啦。

### 后端node项目部署

后端的部署和前端的基本一致。

只需要把shell脚本修改成下面这样就可以了：

```
#!/bin/bash

CONTAINER=${container_name}
PORT=${port}

echo  ${image_name}:${tag}

echo $CONTAINER -p $PORT:80 ${image_name}:${tag}

RUNNING=${docker inspect --format="{{ .State.Running }}" $CONTAINER 2 > /dev/null}

# 条件判断
if [! -n $RUNNING]; then
echo "$CONTAINER does not exit"
    return 1
fi

if [! -n $RUNNING]; then
echo "$CONTAINER is not running"
    return 2
else
echo "$CONTAINER is runing"
    # delete same name container
    matchingStarted=$(docker ps -a --filter="name=$CONTAINER" -q | xargs)
    if [ -n $matchingStarted ]; then
    docker stop $matchingStarted
    fi
    
    matching=$(docker ps -a --filter="name=$CONTAINER" -q | xargs)
    if [ -n $matching ]; then
    docker rm $matching
    fi
fi

# 完成镜像构建 .指使用当前文件目录下的dockerfile执行
docker build --no-cache -t ${image_name}:${tag} .

# 运行服务
docker run -itd --name $CONTAINER -p $PORT:12005 ${image_name}:${tag}
复制代码
```

到此为止，部署完毕。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/236e063a2b0f41c2adc72f2d00a1f576~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 24

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏