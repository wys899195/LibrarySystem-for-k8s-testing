#!/bin/bash

# echo字體顏色
LIGHT_BLUE_FONT_COLOR='\033[1;34m'   # 亮藍色
RESET_FONT_COLOR='\033[0m'           # 重置顏色

# 開啟sh檔執行權限
chmod +x ./build_all_service_image.sh
chmod +x ./check_all_service_ready.sh
chmod +x ./deploy_all_service_in_minikube.sh
chmod +x ./expose_to_host.sh
chmod +x ./setup_istio_and_namespace.sh
chmod +x ./start_minikube.sh

# (function)echo輸出訊息
echo_msg() {
    local msg="$1"
    echo "${LIGHT_BLUE_FONT_COLOR}=======================================\n${msg}\n=======================================${RESET_FONT_COLOR}"
}


# git clone AICS系統的每個微服務專案
# 啟動minikube(初次啟動會需要等它安裝minikube的image)
echo_msg "正在啟動minikube..." &&
./start_minikube.sh &&

# 在minikube自動部署系統所需的Istio,以及建立aics namespace
echo_msg "正在部署Istio至minikube..."  && 
./setup_istio_and_namespace.sh &&

# 一鍵建立所有AICS服務的本地端映像檔，後續部署服務時會需要
echo_msg "正在建立所有AICS服務的本地端映像檔..." &&
./build_all_service_image.sh && 

# 在minikube一鍵部署並啟動所有AICS服務
echo_msg "正在部署並啟動所有AICS服務..." &&
./deploy_all_service_in_minikube.sh &&

# 檢查在minikube中的所有服務是否都啟動成功
echo_msg "正在等待所有AICS服務啟動完畢..." &&
./check_all_service_ready.sh &&

# 把AICS系統從minikube暴露到localhost 讓外部能夠連線到前端頁面
./expose_to_host.sh &&

echo_msg "系統部署＆啟動完畢"
