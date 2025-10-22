#!/bin/bash
### 此sh檔用來在minikube一鍵部署所有服務至minikube

# echo字體顏色
LIGHT_YELLOW_FONT_COLOR='\033[1;33m' # 亮黃色
LIGHT_GREEN_FONT_COLOR='\033[1;32m' # 亮綠色
LIGHT_BLUE_FONT_COLOR='\033[1;34m'   # 亮藍色
ERROR_FONT_COLOR='\033[1;31m'        # 亮紅色
RESET_FONT_COLOR='\033[0m'           # 重置顏色

# (function)部署服務
deploy_service() {
    local service_name="$1"
    local service_dir="$2"

    echo -e "\n${LIGHT_BLUE_FONT_COLOR}▶ 部署並啟動${service_name} ◀${RESET_FONT_COLOR}"
    (cd "$service_dir" && sh deploy.sh && sh rollout_restart.sh) || service_deploy_error "$service_name"
}

# (function)部署服務時如果中途發生錯誤，就會跑這個function印錯誤訊息並且中止部署程序
service_deploy_error() {
    local service_name="$1"

    echo -e "\n${ERROR_FONT_COLOR}$service_name 部署時出現錯誤，將中止後續服務的部署程序。${RESET_FONT_COLOR}"
    exit 1 
}


# 部署資料庫
deploy_service "Database" "../Database/sh"

# 部署並啟動後端服務
deploy_service "Account Service" "../BackEnd/Account-Service/sh"
deploy_service "Borrowing Service" "../BackEnd/Borrowing-Service/sh" 
deploy_service "Collection Service" "../BackEnd/Collection-Service/sh" 

# 部署前端
deploy_service "Front end" "../FrontEnd/sh"

echo -e "\n${LIGHT_GREEN_FONT_COLOR}所有服務皆已部署完畢。${RESET_FONT_COLOR}\n"

