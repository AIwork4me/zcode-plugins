# 共享静态资源（图标等）

[English](README.md)

本目录下的文件会在合入 main 时由发布流水线按原目录结构同步到 OSS/CDN：

```
assets/<plugin-name>/icon.png
  -> https://cdn-zcode.z.ai/zcode/official-plugin/assets/<plugin-name>/icon.png
```

客户端 / 市场条目里直接引用 CDN URL，例如：

```
icon: "https://cdn-zcode.z.ai/zcode/official-plugin/assets/android-emulator/icon.png"
```

约定：

- 每个插件一个子目录，目录名与插件名一致（kebab-case）。
- 图标：`icon.png`，正方形，建议 256×256（或更大的 2 的幂）。
- 图标保持透明背景并保留 Figma 原始颜色；客户端负责提供随主题变化的圆角容器，
  并将图形居中显示为容器尺寸的三分之二。
- 资源是**可变的**：同路径提交新内容会原地重新上传并刷新 CDN 缓存
  （浏览器缓存最长 1 小时过期）。
- 从本目录删除文件**不会**删除 OSS 上的对象；确有需要时手动清理。
- 点开头的文件和这两个 README 不会被上传。
