#!/bin/bash
### 此sh檔用來一鍵建立所有服務的本地端映像檔，後續部署服務時會直接拿本地端映像檔來啟動容器

# echo字體顏色
LIGHT_GREEN_FONT_COLOR='\033[1;32m' # 亮綠色
ERROR_FONT_COLOR='\033[1;31m' # 亮紅色
LIGHT_YELLOW_FONT_COLOR='\033[1;33m' # 亮黃色
RESET_FONT_COLOR='\033[0m' # 重置顏色

# 開多個終端機建所有服務的image，並且用PIDs列表追蹤所有終端機運行是否有錯
PIDS=()
FAILED_SERVICES=()

# (function) 建立服務image(開多個終端機，每個終端機各負責建立一個服務的image)
build_service() {
    local service_name="$1"
    local sh_path="$2"

        gnome-terminal --wait -- bash -c "\
        echo -e '${LIGHT_GREEN_FONT_COLOR}=======================================\n正在建立${service_name}的映像檔...\n=======================================${RESET_FONT_COLOR}'; \
        (cd ${sh_path} && sh build.sh); \
        if [ \$? -ne 0 ]; then \
            echo -e '${ERROR_FONT_COLOR}建立${service_name}的映像檔時出現錯誤！請確認問題後，按[Enter]關閉終端機.${RESET_FONT_COLOR}'; \
            read; \
            exit 1; \
        fi" &

    PIDS+=($!)
    FAILED_SERVICES+=("${service_name}")
}

# 建立每個服務的image
build_service "Account Service" "../BackEnd/Account-Service/sh" 
build_service "Borrowing Service" "../BackEnd/Borrowing-Service/sh" 
build_service "Collection Service" "../BackEnd/Collection-Service/sh" 
build_service "Front end" "../FrontEnd/sh"


# 等待所有終端機跑完，就檢查每個服務的映像檔是否成功建立
FAILED_SERVICES_FAILED=0
for i in "${!PIDS[@]}"; do
    wait ${PIDS[i]}
    if [ $? -ne 0 ]; then
        echo -e "-${ERROR_FONT_COLOR}建立 ${FAILED_SERVICES[i]} 的映像檔失敗${RESET_FONT_COLOR}"
        FAILED_SERVICES_FAILED=1
    fi
done

if [ "$FAILED_SERVICES_FAILED" -eq 1 ]; then
  echo -e "\n${ERROR_FONT_COLOR}上述服務的映像檔未能成功建立，將中止部署程序。${RESET_FONT_COLOR}"
  exit 1
fi
echo -e "\n${LIGHT_GREEN_FONT_COLOR}所有服務的映像檔皆成功建立。\n${RESET_FONT_COLOR}"
