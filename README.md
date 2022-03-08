
### work-mode

Keep your work and personal files seperate on the same machine without seperate user


![](work-mode.gif)
<img src="work-mode-browser.gif" width="768" />

## How to use

Copy `work-mode.json` to `~/.work-mode.json` or `~/.config/work-mode.json`

Replace default directories in the config file with directories you want to have images for

`./work-mode.js on` when you start work

`./work-mode.js off` when you end work

### Built with

* `dd`
* `mkfs`
* `mount`

### How it works

`work-mode` mounts `.img` files on top of existing personal directories, effectively shadowing their contents.

For example, if `Downloads` is in your `work-mode.json`, then a coresponding .img file will be mounted at `Downloads` when `work-mode on` is called, effectively hiding all of your personal downloads. Then when `work-mode off` is called, the img will be unmounted, revealing the personal contents again.

### Why not multiple users?

As a developer, there is a lot of configuration and software that should be shared between a work and personal computing environment. Keeping seperate users and user directories for the two environments will lead to duplication of that configuration.

