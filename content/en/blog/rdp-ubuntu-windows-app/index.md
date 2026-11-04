---
title: "Windows App on macOS cannot connect to an Ubuntu RDP server"
date: 2025-07-09
summary: Remote login was enabled on Ubuntu, but the connection still failed. The fix is one line in the exported .rdp file.
tags: [linux, rdp]
---

After enabling remote login (RDP) on an Ubuntu server, I still could not connect to it with the Windows App (Microsoft Remote Desktop) on my Mac. The fix I found in a [Reddit comment](https://www.reddit.com/r/Ubuntu/comments/1c40ei8/comment/lhzgbk8/) worked for me:

1. In the Windows App, export the connection as an `.rdp` file.
2. Open the `.rdp` file in a text editor.
3. Find the line

   ```
   use redirection server name:i:0
   ```

   and change it to

   ```
   use redirection server name:i:1
   ```

4. Save the file, drag it back into the Windows App and open the connection.

I have not looked into why this setting matters; if you know, I would be happy to hear it.
