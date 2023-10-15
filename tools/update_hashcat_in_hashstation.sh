#!/bin/bash
set -e

bash build_hashcat.sh

cp -f hashcat.bin ../server/client_bin/x86_64-pc-linux-gnu/hashcat1.bin
cp -f hashcat.exe ../server/client_bin/windows_x86_64/hashcat1.exe

cp -f hashcat_files_linux.zip ../server/client_bin/x86_64-pc-linux-gnu/hashcat_files_linux1.zip
cp -f hashcat_files_windows.zip ../server/client_bin/windows_x86_64/hashcat_files_windows1.zip

rm -rf ../backend/hashcat/*
cp -f hashcat.bin ../backend/hashcat/hashcat.bin
unzip hashcat_files_linux.zip -d ../backend/hashcat/

rm -f hashcat.bin hashcat.exe hashcat_files_linux.zip hashcat_files_windows.zip

echo "Updated."