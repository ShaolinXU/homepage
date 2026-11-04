---
title: "Mac 上的 Windows App 连不上 Ubuntu 的 RDP 远程桌面"
date: 2025-07-09
summary: Ubuntu 已开启远程登录，但连接仍然失败。解决办法是改导出的 .rdp 文件里的一行。
tags: [linux, rdp]
---

在 Ubuntu 服务器上开启远程登录（RDP）后，我用 Mac 上的 Windows App（Microsoft Remote Desktop）仍然连不上。在 [Reddit 的一条评论](https://www.reddit.com/r/Ubuntu/comments/1c40ei8/comment/lhzgbk8/)里找到的办法对我有效：

1. 在 Windows App 里把这个连接导出为 `.rdp` 文件。
2. 用文本编辑器打开 `.rdp` 文件。
3. 找到这一行

   ```
   use redirection server name:i:0
   ```

   改成

   ```
   use redirection server name:i:1
   ```

4. 保存，把文件拖回 Windows App，再打开连接。

我没有深究这个参数为什么有影响，如果你知道原因，欢迎告诉我。
