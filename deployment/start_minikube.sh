#!/bin/bash
# echo字體顏色
LIGHT_BLUE_FONT_COLOR='\033[1;34m'  # 亮藍色
LIGHT_GREEN_FONT_COLOR='\033[1;32m' # 亮綠色
ERROR_FONT_COLOR='\033[1;31m' # 亮紅色
RESET_FONT_COLOR='\033[0m'  # 重置顏色

# 啟動minikube(初次啟動會需要等它安裝minikube的image)
if ! minikube status | grep -q "Running"; then
  minikube start --cpus=4 --memory=10240 --driver docker --static-ip 192.168.49.2
else
  echo -e "\n${LIGHT_GREEN_FONT_COLOR}minikube已經在運行中，跳過此步驟。\n${RESET_FONT_COLOR}"
  exit 0
fi

# 確認minikube有沒有成功跑起來，沒有的話就中止sh並丟出錯誤
if ! minikube status | grep -q "Running"; then
  echo -e "${ERROR_FONT_COLOR}minikube啟動失敗，請查看終端機的顯示的錯誤log。${RESET_FONT_COLOR}"
  exit 1
fi

# 確保minikube能連線到網路
sudo iptables -P FORWARD ACCEPT

echo -e "\n${LIGHT_GREEN_FONT_COLOR}minikube成功啟動。\n${RESET_FONT_COLOR}"
