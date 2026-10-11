/* 技术速查手册 —— 内容数据
 * 结构：SECTION[] > items[]
 * item: { k 关键词/命令, d 说明, c 代码片段(可选), tags 检索别名(可选) }
 * 想加内容只需往下面的数组里追加对象，页面会自动渲染与检索。
 */
const SECTIONS = [
  {
    id: 'git',
    title: 'Git 版本控制',
    icon: '⑂',
    desc: '日常提交、分支、撤销与找回丢失提交。',
    items: [
      { k: 'git switch -c feat/login', d: '新建并切换到 feat/login 分支（比 checkout -b 更直观）。', tags: ['分支', 'branch'] },
      { k: 'git status -sb', d: '紧凑显示分支、领先/落后提交数与改动文件。' },
      { k: 'git commit --amend --no-edit', d: '把当前暂存区追加到上一次提交，不改提交信息。', tags: ['修改提交'] },
      { k: 'git reset --soft HEAD~1', d: '撤销最近一次提交，改动全部留在暂存区。', tags: ['撤销', 'undo'] },
      { k: 'git restore --staged <file>', d: '把文件移出暂存区，工作区内容保持不变。' },
      { k: 'git restore <file>', d: '丢弃工作区改动（不可恢复，慎用）。', tags: ['丢弃', '还原'] },
      { k: 'git log --oneline --graph --decorate -20', d: '图形化查看最近 20 条提交。', tags: ['日志', 'log'] },
      { k: 'git diff --staged', d: '查看已暂存但尚未提交的差异。' },
      { k: 'git stash push -u -m "wip"', d: '暂存改动，-u 连未跟踪的新文件一起存起来。', tags: ['暂存', 'stash'] },
      { k: 'git stash pop', d: '恢复最近一次 stash 并从栈中删除。' },
      { k: 'git rebase -i HEAD~3', d: '交互式整理最近 3 次提交：合并、改写、排序。', tags: ['变基'] },
      { k: 'git cherry-pick <sha>', d: '把指定提交复制到当前分支。' },
      { k: 'git reflog', d: '查看 HEAD 移动历史，误删分支或 reset 后的救命稻草。', tags: ['找回'] },
      { k: 'git remote -v', d: '查看远程仓库地址；配合 git push -u origin main 建立跟踪。' }
    ]
  },
  {
    id: 'shell',
    title: 'Linux 与 Shell',
    icon: '❯',
    desc: '文件、进程、端口、打包与管道组合。',
    items: [
      { k: 'cd -', d: '回到上一个所在目录。' },
      { k: 'grep -rn "keyword" .', d: '递归搜索当前目录并显示行号，-i 忽略大小写。', tags: ['搜索'] },
      { k: 'find . -name "*.log" -mtime +7 -delete', d: '删除 7 天前修改的日志文件。', tags: ['查找'] },
      { k: 'du -sh * | sort -h | tail -10', d: '列出占用最大的目录/文件。', tags: ['磁盘', '占用'] },
      { k: 'df -h', d: '查看各挂载点剩余空间。' },
      { k: 'ps aux | grep node', d: '查找进程；更推荐 pgrep -af node。', tags: ['进程'] },
      { k: 'kill -9 <pid>', d: '强制结束进程；先试 kill <pid> 发 SIGTERM。' },
      { k: 'lsof -i :3000', d: '查看谁占用了 3000 端口。Windows：netstat -ano | findstr :3000', tags: ['端口'] },
      { k: 'tar -czf backup.tar.gz ./dir', d: '打包压缩；解包用 tar -xzf backup.tar.gz。', tags: ['打包', '压缩'] },
      { k: 'curl -fsSL <url> -o file', d: '-f 失败即报错，-s 静默，-S 出错仍打印，-L 跟随重定向。' },
      { k: 'chmod +x run.sh', d: '给脚本加可执行权限；755 用于目录与脚本。', tags: ['权限'] },
      { k: 'cmd 2>&1 | tee run.log', d: '标准错误并入标准输出，同时写文件又显示在屏幕。', tags: ['重定向'] },
      { k: 'export FOO=bar', d: '设置环境变量（仅当前会话）；env 可列出全部。' },
      { k: 'history | grep deploy', d: '从历史命令里检索；!! 重复上一条，!$ 取上条最后的参数。' }
    ]
  },
  {
    id: 'http',
    title: 'HTTP 与网络',
    icon: '⇄',
    desc: '状态码语义、常用头字段与 curl 调试手法。',
    items: [
      { k: '2xx 成功', d: '200 正常；201 已创建；202 已接受（异步）；204 成功但无响应体。', tags: ['状态码'] },
      { k: '3xx 重定向', d: '301 永久；302 / 307 临时（307 保持方法）；304 命中协商缓存。', tags: ['状态码'] },
      { k: '4xx 客户端错误', d: '400 参数错；401 未认证；403 无权限；404 不存在；405 方法不允许；409 冲突；422 校验失败；429 触发限流。', tags: ['状态码'] },
      { k: '5xx 服务端错误', d: '500 内部错误；502 网关收到非法响应；503 服务不可用；504 网关超时。', tags: ['状态码'] },
      { k: '幂等性', d: 'GET / PUT / DELETE 幂等，POST 不幂等；重试只对幂等接口安全。', tags: ['idempotent'] },
      { k: 'Content-Type: application/json; charset=utf-8', d: '声明请求体的媒体类型，服务端据此选择解析器。', tags: ['请求头'] },
      { k: 'Authorization: Bearer <token>', d: '承载令牌认证；Basic 则是 user:pass 的 Base64。', tags: ['认证'] },
      { k: 'Cache-Control: no-store, max-age=0', d: '禁用强缓存；配合 ETag / If-None-Match 走协商缓存。', tags: ['缓存'] },
      { k: 'Access-Control-Allow-Origin', d: 'CORS 响应头；非简单请求会先发 OPTIONS 预检，需返回 Allow-Methods / Allow-Headers。', tags: ['跨域', 'cors'] },
      { k: 'curl -i <url>', d: '打印响应头与响应体；-v 显示完整握手与请求头，-I 只取响应头。', tags: ['调试'] },
      { k: "curl -X POST <url> -H 'Content-Type: application/json' -d '{\"a\":1}'", d: '发送 JSON 请求体；--data-binary @file.json 可直接读文件。' },
      { k: 'curl --resolve api.test:443:127.0.0.1 https://api.test/', d: '不改 hosts 文件，把域名强制解析到本地做联调。' }
    ]
  },
  {
    id: 'js',
    title: 'JavaScript / TypeScript',
    icon: '{ }',
    desc: '数组对象常用写法、异步控制与浏览器 API。',
    items: [
      { k: '[...new Set(arr)]', d: '数组去重；对象去重可按字段建 Map。', tags: ['去重'] },
      { k: 'arr.at(-1)', d: '取最后一个元素，负数索引从尾部计数。' },
      { k: 'Array.from({ length: n }, (_, i) => i)', d: '生成 0..n-1 的数组。' },
      { k: 'a?.b?.c ?? fallback', d: '可选链遇到 null/undefined 短路；?? 只在 null/undefined 时取默认值。', tags: ['空值合并'] },
      { k: 'Object.entries(obj) / Object.fromEntries(pairs)', d: '对象与键值对数组互转，配合 map / filter 很好用。' },
      { k: 'structuredClone(obj)', d: '内置深拷贝，支持 Date、Map、Set；不支持函数与 DOM 节点。', tags: ['深拷贝'] },
      { k: 'await fetch(url)', d: 'fetch 只在网络错误时 reject，务必先判断 res.ok 再解析。', c: "const res = await fetch(url);\nif (!res.ok) throw new Error(`HTTP ${res.status}`);\nconst data = await res.json();", tags: ['请求', 'fetch'] },
      { k: 'AbortController 超时', d: '给请求加超时，避免一直挂起。', c: "const ac = new AbortController();\nconst timer = setTimeout(() => ac.abort(), 5000);\ntry {\n  const res = await fetch(url, { signal: ac.signal });\n} finally {\n  clearTimeout(timer);\n}", tags: ['超时'] },
      { k: 'Promise.allSettled(tasks)', d: '等全部结束且不因单个失败而中断；Promise.all 则一败即败。', tags: ['并发'] },
      { k: 'debounce', d: '停止触发 delay 毫秒后才执行，适合输入框搜索。', c: "const debounce = (fn, delay = 300) => {\n  let t;\n  return (...args) => {\n    clearTimeout(t);\n    t = setTimeout(() => fn(...args), delay);\n  };\n};", tags: ['防抖'] },
      { k: 'throttle', d: '固定时间窗口内最多执行一次，适合滚动、拖拽。', c: "const throttle = (fn, gap = 200) => {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= gap) { last = now; fn(...args); }\n  };\n};", tags: ['节流'] },
      { k: 'new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(1234.5)', d: '本地化数字/货币/日期格式化，无需第三方库。', tags: ['格式化'] },
      { k: 'localStorage 存取 JSON', d: '只存字符串，且同源可用；敏感数据不要放这里。', c: "localStorage.setItem('key', JSON.stringify(value));\nconst value = JSON.parse(localStorage.getItem('key') ?? 'null');" },
      { k: '??= / ||= / &&=', d: '逻辑赋值：仅在左侧为 null/undefined、假值、真值时分别赋值。' },
      { k: 'performance.now()', d: '高精度单调时钟（毫秒，带小数），用来测量耗时而不是 Date.now()。' }
    ]
  },
  {
    id: 'python',
    title: 'Python',
    icon: '🐍',
    desc: '虚拟环境、推导式、标准库与常见脚本骨架。',
    items: [
      { k: 'python -m venv .venv', d: '建虚拟环境；Windows 激活 .venv\\Scripts\\activate，macOS/Linux 用 source .venv/bin/activate。', tags: ['虚拟环境'] },
      { k: 'pip install -r requirements.txt', d: '按锁定文件安装依赖；pip freeze > requirements.txt 导出。' },
      { k: '[f(x) for x in xs if cond(x)]', d: '列表推导；字典推导 {k: v for k, v in pairs}。', tags: ['推导式'] },
      { k: 'for i, v in enumerate(xs, start=1):', d: '同时拿到下标与值；zip(a, b) 并行遍历两个序列。' },
      { k: 'f"{price:.2f}"', d: 'f-string 格式化：:.2f 两位小数，:, 千分位，:>10 右对齐。' },
      { k: 'd.get(key, default)', d: '安全取值；collections.defaultdict(list) 可省去判空。' },
      { k: 'collections.Counter(words).most_common(5)', d: '词频统计取前 5，最常用的计数工具。' },
      { k: 'pathlib.Path', d: '面向对象的路径操作，比 os.path 更清晰。', c: "from pathlib import Path\np = Path('data') / 'a.txt'\ntext = p.read_text(encoding='utf-8')\np.write_text('hi', encoding='utf-8')", tags: ['文件'] },
      { k: 'with open(path, encoding="utf-8") as f:', d: '上下文管理器自动关闭文件，读大文件可逐行迭代。', tags: ['文件'] },
      { k: '@dataclass', d: '自动生成 __init__ / __repr__ / __eq__ 的轻量数据类。', c: "from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    name: str\n    tags: list[str] = field(default_factory=list)", tags: ['数据类'] },
      { k: 'if __name__ == "__main__":', d: '仅在被直接运行时执行，避免 import 时产生副作用。', tags: ['入口'] },
      { k: 'sorted(items, key=lambda x: x["score"], reverse=True)', d: '按字段排序；operator.itemgetter 更快。', tags: ['排序'] },
      { k: 'argparse 示例', d: '标准库命令行参数解析。', c: "import argparse\n\np = argparse.ArgumentParser()\np.add_argument('path')\np.add_argument('-n', type=int, default=10)\nargs = p.parse_args()", tags: ['命令行'] },
      { k: 'json.dumps(obj, ensure_ascii=False, indent=2)', d: '输出带缩进的中文可读 JSON。', tags: ['json'] },
      { k: 'requests 请求', d: '第三方库，超时必须显式设置。', c: "import requests\n\nres = requests.get(url, timeout=5)\nres.raise_for_status()\ndata = res.json()", tags: ['请求'] }
    ]
  },
  {
    id: 'sql',
    title: 'SQL',
    icon: '🗄',
    desc: '查询骨架、连接聚合、窗口函数与索引排查。',
    items: [
      { k: 'SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT', d: '书写顺序固定；执行顺序是 FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT。', tags: ['语法'] },
      { k: 'INNER / LEFT / RIGHT / FULL JOIN', d: 'LEFT JOIN 保留左表全部行，未匹配列为 NULL；过滤右表条件要写在 ON 里。', tags: ['连接'] },
      { k: 'COUNT(*) / COUNT(col) / SUM / AVG / MAX', d: 'COUNT(*) 含 NULL 行，COUNT(col) 不含；聚合会忽略 NULL。', tags: ['聚合'] },
      { k: 'WHERE 与 HAVING 的区别', d: 'WHERE 在分组前过滤行，HAVING 在分组后过滤组。' },
      { k: 'ROW_NUMBER() OVER (PARTITION BY uid ORDER BY created_at DESC)', d: '分组内排名，常用来取每组最新一条。', c: "SELECT * FROM (\n  SELECT t.*,\n         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn\n  FROM orders t\n) x\nWHERE x.rn = 1;", tags: ['窗口函数', '排名'] },
      { k: 'WITH recent AS (...)', d: 'CTE 公共表达式，把复杂查询拆成可读的若干步。', tags: ['cte'] },
      { k: 'COALESCE(a, b, 0)', d: '返回第一个非 NULL 值；判空用 IS NULL / IS NOT NULL，不要用 = NULL。', tags: ['null'] },
      { k: 'CREATE INDEX idx_user_created ON orders (user_id, created_at DESC)', d: '复合索引遵循最左前缀原则，字段顺序按等值在前、范围在后安排。', tags: ['索引'] },
      { k: 'EXPLAIN ANALYZE <query>', d: '查看真实执行计划与耗时，重点找 Seq Scan 和大 rows 估算偏差。', tags: ['性能'] },
      { k: 'INSERT INTO t (a, b) VALUES (1, 2) ON CONFLICT (a) DO UPDATE SET b = EXCLUDED.b', d: 'PostgreSQL 的 UPSERT 写法。', tags: ['upsert'] },
      { k: 'keyset 分页', d: '深分页时 WHERE id > :last ORDER BY id LIMIT 20，比大 OFFSET 快得多。', tags: ['分页'] }
    ]
  },
  {
    id: 'docker',
    title: 'Docker 与容器',
    icon: '🐳',
    desc: '镜像构建、容器排障与常用清理命令。',
    items: [
      { k: 'docker ps -a', d: '列出所有容器含已停止的；docker ps 只看运行中。' },
      { k: 'docker run -it --rm -p 8080:80 nginx sh', d: '前台交互运行并在退出后自动删除；-d 后台，-v 挂载卷。', tags: ['运行'] },
      { k: 'docker build -t app:1.0 .', d: '按当前目录 Dockerfile 构建镜像并打标签。', tags: ['构建'] },
      { k: 'docker logs -f --tail 100 <container>', d: '实时跟踪日志末尾 100 行。', tags: ['日志'] },
      { k: 'docker exec -it <container> sh', d: '进入运行中的容器排查；镜像里没有 bash 时用 sh。', tags: ['排障'] },
      { k: 'docker compose up -d --build', d: '重建并后台启动整套服务；down -v 连数据卷一起删。' },
      { k: 'docker system prune -af --volumes', d: '清理无用镜像、容器、网络与卷，释放磁盘（确认后再执行）。', tags: ['清理'] },
      { k: 'docker inspect <container>', d: '查看完整配置与状态；--format 可只取字段。', c: "docker inspect -f '{{.State.Status}} {{.NetworkSettings.IPAddress}}' web" },
      { k: '多阶段构建', d: '构建依赖与运行环境分离，产出更小的镜像。', c: "FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=build /app/dist /usr/share/nginx/html", tags: ['Dockerfile'] },
      { k: 'docker image prune -a', d: '删除所有未被容器引用的镜像。' }
    ]
  },
  {
    id: 'regex',
    title: '正则表达式',
    icon: '.*',
    desc: '元字符、分组环视与拿来即用的常用模式。',
    items: [
      { k: '^ 与 $', d: '匹配字符串（或行，多行模式下）的开头与结尾。', tags: ['锚点'] },
      { k: '\\d \\w \\s', d: '数字、单词字符（字母数字下划线）、空白；改成大写 \\D \\W \\S 表示取反。', tags: ['字符类'] },
      { k: '* + ? {n,m}', d: '0 次以上、1 次以上、0 或 1 次、指定区间；加 ? 变非贪婪，如 .*?。', tags: ['量词'] },
      { k: '[abc] [^abc] [a-z0-9]', d: '字符集合与取反集合；集合内的 . 和 * 是字面量。', tags: ['字符类'] },
      { k: '( ) 与 (?: )', d: '捕获分组可用 $1 反向引用，(?: ) 只分组不捕获。', tags: ['分组'] },
      { k: '(?<name>...)', d: '命名捕获组，替换时写 $<name>，可读性更好。', tags: ['命名组'] },
      { k: '(?=x) (?!x) (?<=x) (?<!x)', d: '先行/后行断言，只做条件判断不消耗字符。', tags: ['环视'] },
      { k: '标志位 g i m s u', d: '全局、忽略大小写、多行、. 匹配换行、Unicode 模式。', tags: ['flags'] },
      { k: '邮箱', d: '够用的实用版本，不追求 RFC 完备。', c: '^[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+$', tags: ['email'] },
      { k: 'URL', d: '提取协议、域名与路径。', c: '^https?:\\/\\/[\\w.-]+(?::\\d+)?(\\/[^\\s]*)?$', tags: ['网址'] },
      { k: '中国大陆手机号', d: '1 开头，第二位 3-9，共 11 位。', c: '^1[3-9]\\d{9}$', tags: ['手机'] },
      { k: 'IPv4', d: '每段 0-255。', c: '^(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)$', tags: ['ip'] },
      { k: '日期 YYYY-MM-DD', d: '宽松校验月日范围。', c: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', tags: ['日期'] },
      { k: 'HTML 标签', d: '提取标签名与属性；解析 HTML 请优先用解析器。', c: '<(\\w+)(?:\\s[^>]*)?>(.*?)<\\/\\1>', tags: ['html'] }
    ]
  },
  {
    id: 'vscode',
    title: 'VS Code 快捷键',
    icon: '⌨',
    desc: 'Windows / Linux 键位，macOS 把 Ctrl 换成 Cmd、Alt 换成 Option。',
    items: [
      { k: 'Ctrl + P', d: '按文件名快速打开；输入 :行号 可跳转行。', tags: ['导航'] },
      { k: 'Ctrl + Shift + P', d: '命令面板，记不住快捷键时的万能入口。', tags: ['命令'] },
      { k: 'Ctrl + Shift + F', d: '在工作区全局搜索文本。', tags: ['搜索'] },
      { k: 'Ctrl + D', d: '选中下一个相同单词，可连续多选后一起编辑。', tags: ['多光标'] },
      { k: 'Alt + ↑ / ↓', d: '整行上移或下移；Shift + Alt + ↑ / ↓ 复制整行。', tags: ['编辑'] },
      { k: 'Ctrl + /', d: '行注释开关；Shift + Alt + A 切换块注释。' },
      { k: 'Ctrl + Shift + K', d: '删除当前行。', tags: ['删除'] },
      { k: 'F2', d: '重命名符号，全项目引用一起改。', tags: ['重构'] },
      { k: 'F12 / Alt + F12', d: '跳转到定义 / 就地速览定义。', tags: ['定义'] },
      { k: 'Shift + Alt + F', d: '格式化整个文档；Ctrl + K Ctrl + F 只格式化选中部分。', tags: ['格式化'] },
      { k: 'Ctrl + B / Ctrl + `', d: '切换侧边栏 / 打开集成终端。', tags: ['面板'] },
      { k: 'Ctrl + K Ctrl + 0', d: '折叠全部代码；Ctrl + K Ctrl + J 全部展开。', tags: ['折叠'] }
    ]
  }
];
