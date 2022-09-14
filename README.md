### 这个项目只做三件事
- 不遗余力的拼接sql语句
- 不遗余力的让ts提示友好
- 不遗余力的避免使用第三方包
	- 选择达梦作为数据库，相信你的项目一定非常重视其国产和安全的属性，因此，`dmdb-orm`的代码中，生产环境的依赖包只有达梦官方推荐的`Nodejs`驱动`dmdb`这一个，没有其他依赖包。

### 安装
    `npm install dmdb-orm`

### 快速使用
`startup.ts`
```typescript
import { DMServer } from 'dmdb-orm';

const server = new DMServer({
    connectString: 'dm://SYSDBA:SYSDBA@localhost:5236'
});

server.connect();

export default server;
```
