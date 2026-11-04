---
title: "Show your IP address in the oh-my-zsh prompt"
date: 2025-07-03
summary: A small helper function that puts the current IP address into the ys theme, on macOS and Linux.
tags: [linux, zsh]
---

When you work on several servers it helps to see which machine you are on, and its IP address, right in the prompt. This is how I added it.

Assumptions:

- you use [oh-my-zsh](https://ohmyz.sh)
- your theme is `ys`

## 1. Write a helper function

Edit the theme file `~/.oh-my-zsh/themes/ys.zsh-theme` and add:

```zsh
function get_ip_address {
  # primary IPv4 address: macOS first, Linux as fallback
  echo "$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}')"
}
```

## 2. Use it in `PROMPT`

Call the function inside the `PROMPT` definition of the same file:

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

Open a new shell (or run `source ~/.zshrc`) and the prompt now shows `user @ 192.168.x.x in /current/dir`.

## One caveat: when is the IP read?

Because `PROMPT` is in double quotes, `$(get_ip_address)` is evaluated **once, when the theme is loaded**. If you switch networks in the same terminal, the prompt keeps showing the old address. Escape the dollar sign to evaluate it on every prompt instead (oh-my-zsh enables `prompt_subst` by default):

```zsh
%{$fg[green]%}\$(get_ip_address) \
```

I checked the difference with a clock: the unescaped version prints the same time on every prompt, the escaped version prints the current time. The cost is one extra command per prompt, which is negligible here.
