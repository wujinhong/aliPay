#!/bin/bash

export TERM=xterm-256color
ttys="请输入你的选择："
clear

#cd ..
#初使化tsc命令：npm install -g typescript
tsc --watch true --project . --outDir ./bin