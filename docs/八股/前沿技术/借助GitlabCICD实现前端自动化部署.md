   

[![](https://p3-passport.byteimg.com/img/user-avatar/03ef9b966e83ef5c0e9b6522472cff63~100x100.awebp)](https://juejin.cn/user/3957869870592685)

2021年12月02日 16:43 ·  阅读 9590

## 🌏 概论

传统的前端部署往往都要经历：`本地代码更新` => `本地打包项目` => `清空服务器相应目录` => `上传项目包至相应目录`几个阶段，这些都是机械重复的步骤。对于这一过程我们往往可以通过`CI/CD`方法进行优化。所谓`CI/CD`，即持续集成/持续部署，以上我们所说的步骤便可以看作是持续部署的一种形态，其更详细的解释大家可以自行了解。

`Jenkins`、`Travis CI`这些都是可以完成持续部署的工具。除此之外，`Gitlab CI/CD`也能很好的完成这一需求。下面就来详细介绍下。

## 🌏 核心工具

### GitLab Runner

`GitLab Runner`是配合`GitLab CI/CD`完成工作的核心程序，出于性能考虑，`GitLab Runner`应该与`Gitlab`部署在不同的服务器上（`Gitlab`在单独的仓库服务器上，`GitLab Runner`在部署web应用的服务器上）。`GitLab Runner`在与`GitLab`关联后，可以在服务器上完成诸如项目拉取、文件打包、资源复制等各种命令操作。

### Git

web服务器上需要安装`Git`来进行远程仓库的获取工作。

### Node

用于在web服务器上完成打包工作。

### NPM or Yarn or pnpm

用于在web服务器上完成依赖下载等工作（用`yarn`,`pnpm`亦可）。

![web服务器上的所需程序](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4faad6113c4e46bb9e30b0cc36741ac0~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

## 🌏 流程

这里我自己用的是centOS环境：

#### 1\. 在web服务器上安装所需工具

**（1）安装Node**

```
# 下载node包
wget https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz
复制代码
```

```
# 解压Node包
tar -xf node-v16.13.0-linux-x64.tar.xz
复制代码
```

```
# 在配置文件（位置多在/etc/profile）末尾添加：
export PATH=$PATH:/root/node-v16.13.0-linux-x64/bin
复制代码
```

```
# 刷新shell环境：
source /etc/profile
复制代码
```

```
# 查看版本（输出版本号则安装成功）：
node -v

#后续安装操作，都可通过-v或者--version来查看是否成功
复制代码
```

`npm`已内置在`node`中，如要使用`yarn`或，则可通过`npm`进行全局安装，命令与我们本地环境下的使用命令是一样的：

```
npm i yarn -g
#or
npm i pnpm -g
复制代码
```

**（2）安装Git**

```
# 利用yum安装git
yum -y install git
复制代码
```

```
# 查看git版本
git --version
复制代码
```

**（3）安装Gitlab Runner**

```
# 安装程序
wget -O /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64

# 等待下载完成后分配权限
chmod +x /usr/local/bin/gitlab-runner

# 创建runner用户
useradd --comment 'test' --create-home gitlab-runner --shell /bin/bash

# 安装程序
gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner

# 启动程序
gitlab-runner start

# 安装完成后可使用gitlab-runner --version查看是否成功
复制代码
```

#### 2\. 配置Runner及CI/CD

基本的安装操作完成后，就是最核心的阶段：Runner与CI/CD的配置。

**（1）配置Gitlab Runner**

首先打开待添加自动部署功能的gitlab仓库，在其中`设置 > CI/CD > Runner`中找到runner配置信息备用：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/080073fabd24491ba15784196a8f0376~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

在web服务器中配置runner：

```
gitlab-runner register

>> Enter the GitLab instance URL (for example, https://gitlab.com/):
# 输入刚才获取到的gitlab仓库地址
>> Enter the registration token:
# 输入刚才获取到的token
>> Enter a description for the runner:
# 自定runner描述
>> Enter tags for the runner (comma-separated):
# 自定runner标签
>> Enter an executor: docker-ssh, docker+machine, docker-ssh+machine, docker, parallels, shell, ssh, virtualbox, kubernetes, custom:
# 选择执行器，此处我们输入shell
复制代码
```

完整示例： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de5f7e8dac434bd1bed887b314129bdc~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

**（2）配置.gitlab-ci.yml**

`.gitlab-ci.yml`文件是流水线执行的流程文件，Runner会据此完成规定的一系列流程。

我们在项目根目录中创建`.gitlab-ci.yml`文件，然后在其中编写内容：

```
# 阶段
stages:
  - install
  - build
  - deploy

cache:
  paths:
    - node_modules/

# 安装依赖
install:
  stage: install
  # 此处的tags必须填入之前注册时自定的tag
  tags: 
    - deploy
  # 规定仅在package.json提交时才触发此阶段
  only:
    changes:
      - package.json
  # 执行脚本
  script:
    yarn

# 打包项目
build:
  stage: build 
  tags: 
    - deploy
  script: 
    - yarn build
  # 将此阶段产物传递至下一阶段 
  artifacts: 
    paths:
        - dist/

# 部署项目
deploy:
  stage: deploy
  tags: 
    - deploy
  script: 
    # 清空网站根目录，目录请根据服务器实际情况填写
    - rm -rf /www/wwwroot/stjerne/salary/*
    # 复制打包后的文件至网站根目录，目录请根据服务器实际情况填写
    - cp -rf ${CI_PROJECT_DIR}/dist/* /www/wwwroot/stjerne/salary/ 
复制代码
```

保存并推送至gitlab后即可自动开始构建部署。

构建中可在gitlab CI/CD面板查看构建进程：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43e6e692181f46ab9fc7f1a87bf968ac~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

待流水线JOB完成后可前往页面查看🛫🛫🛫🛫🛫

文章被收录于专栏：

![cover](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95414745836549ce9143753e2a30facd~tplv-k3u1fbpfcp-no-mark:160:160:160:120.awebp)

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/00ba359ecd0075e59ffbc3d810af551d.svg) 161

![](https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/3d482c7a948bac826e155953b2a28a9e.svg) 收藏