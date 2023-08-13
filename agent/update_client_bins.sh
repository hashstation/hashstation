#!/usr/bin/env bash

make clean
make linux
objcopy --strip-unneeded ./bin/agent.bin ../server/client_bin/x86_64-pc-linux-gnu/agent1.bin
objcopy --only-keep-debug ./bin/agent.bin ./bin/agent.bin.debug
rm ./bin/agent.bin

make clean
make windows
objcopy --strip-unneeded ./bin/agent.exe ../server/client_bin/windows_x86_64/agent1.exe
objcopy --only-keep-debug ./bin/agent.exe ./bin/agent.exe.debug
rm ./bin/agent.exe