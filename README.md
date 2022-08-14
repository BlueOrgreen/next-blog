## Next + TS 博客项目

### 项目配置 eslint 、 stylelint

- yarn add eslint --save-dev
- yarn add stylelint stylelint-config-standard-scss --save-dev

.eslintrc.json
.stylelintrc.json


设置 -> codeAct
```json
{
  ...
  "editor.codeActionsOnSave": {
        "source.fixAll.stylelint": true // 保存自动修复css样式lint问题
  }
}
```


### 验证码

在生产环境中会将验证码保存在redis中, 如果保存在内存中的话,遇到一台设备获取验证码,然后用另一台设备登录,那么将不适用, 因此用redis

在本项目由于单机版学习项目, 会将验证码放到内存中, 用到了 `iron-session`


### 引入TypeOrm使用装饰器的时候, Nextjs项目是不支持装饰器的

配置tsconfig.json

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
}
```

babel也要配置experimentalDecorators 因为最终taget为ES5的代码

- yarn add @babel/core
- yarn add babel-plugin-transform-typescript-metadata
- yarn add @babel/plugin-proposal-decorators
- yarn add @babel/plugin-proposal-class-properties 

配置.babelrc

```json
{
  "presets": ["next/babel"],
  "plugins": [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-class-properties"
  ]
}
```

### 状态管理库 redux和mobx

- redux和mobx都是单向数据流, 都是state发生变化然后触发视图的变化
- redux需要写比较多的样板代码, 需要自己dispatch派发action, 在action中修改数据触发state变化, 数据是immutable的
- mobx是双向绑定的,类似于vue, 修改observe监听的数据时, 会自动触发组件的更新


### 如何解决刷新页面导致登录状态丢失的问题

背景: 存储在全局store的用户信息(已登录态) 在刷新网页的时候内存会丢失 因此刷新后又会回到未登录态

- 使用 `next-cookie` 保存用户信息, 刷新页面后再筛进内存里面(store)去

### OAtuh2 第三方登录

所谓第三方登录, 实质就是 OAtuth 授权. 用户想要登录A网站, A网站让用户提供第三方网站的数据, 证明自己的身份.
获取第三方网站的身份数据, 就需要 OAuth 授权.

举例来说, A网站允许 Github 登录, 就是以下的逻辑
- A网站让用户跳转到 Github
- Github要求用户登录, 然后询问 "A网站要求获得 XX 权限, 你是否同意?"
- 用户同意, Github 重定向会到A网站, 并且带回一个授权码
- A网站使用授权码, 向 Github 请求令牌
- Github返回令牌
- A网站使用令牌, 向 Github 请求用户数据


`Client ID` 7f4baee64f58b2b092fb
`Client secrets` 5feae6192337357cebbb16bf3efe9e5168449021