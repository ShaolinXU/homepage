---
title: "在 oh-my-zsh 提示符里显示 IP 地址"
date: 2025-07-03
summary: 用一个小函数把当前 IP 地址放进 ys 主题的提示符，macOS 和 Linux 都适用。
tags: [linux, zsh]
---

同时登录多台服务器时，如果提示符里直接显示当前机器的 IP，就不容易搞混。我是这样加的。

前提：

- 使用 [oh-my-zsh](https://ohmyz.sh)
- 主题是 `ys`

## 1. 写一个辅助函数

编辑主题文件 `~/.oh-my-zsh/themes/ys.zsh-theme`，加入：

```zsh
function get_ip_address {
  # 主 IPv4 地址：先试 macOS，失败则用 Linux 的命令
  echo "$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}')"
}
```

## 2. 在 `PROMPT` 里调用

在同一个文件的 `PROMPT` 定义里调用这个函数：

```zsh
PROMPT="
%{$terminfo[bold]$fg[blue]%}#%{$reset_color%} \
%(#,%{$bg[yellow]%}%{$fg[black]%}%n%{$reset_color%},%{$fg[cyan]%}%n) \
%{$reset_color%}@ \
%{$fg[green]%}$(get_ip_address) \
%{$reset_color%}in \
%{$terminfo[bold]$fg[blue]%}%d%{$reset_color%}\
${hg_info}\
${git_info}\
${svn_info}\
${venv_info}\
 \
[%*] $exit_code
%{$terminfo[bold]$fg[red]%}$ %{$reset_color%}"
```

新开一个终端（或执行 `source ~/.zshrc`），提示符就会变成 `用户名 @ 192.168.x.x in /当前目录`。

## 一个注意点：IP 什么时候读取？

因为 `PROMPT` 写在双引号里，`$(get_ip_address)` 只会在**主题加载时执行一次**。如果在同一个终端里切换了网络，提示符里仍然是旧地址。把美元符号转义，就会在每次出提示符时重新执行（oh-my-zsh 默认开启了 `prompt_subst`）：

```zsh
%{$fg[green]%}\$(get_ip_address) \
```

我用时钟验证过两者的区别：不转义时每次提示符显示的都是同一个时间，转义后显示的是当前时间。代价是每次提示符多执行一条命令，这里可以忽略。
