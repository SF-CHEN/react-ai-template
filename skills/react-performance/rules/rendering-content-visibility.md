# 超长内容可以使用 content-visibility

当页面包含大量屏外内容，并且浏览器布局与绘制成本已经成为实际问题时，可以考虑使用 CSS `content-visibility` 减少初始渲染工作。

```css
.long-section {
  content-visibility: auto;
  contain-intrinsic-size: 800px;
}
```

这属于按需优化。普通页面和数据量不大的列表不需要默认添加。
