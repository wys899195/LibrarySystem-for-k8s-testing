#!/bin/bash
### 此sh檔用來確認minikube中所有服務是否皆啟動成功（google alerts服務除外）

# echo字體顏色
LIGHT_YELLOW_FONT_COLOR='\033[1;33m' # 亮黃色
LIGHT_GREEN_FONT_COLOR='\033[1;32m' # 亮綠色
LIGHT_BLUE_FONT_COLOR='\033[1;34m'   # 亮藍色
ERROR_FONT_COLOR='\033[1;31m'        # 亮紅色
RESET_FONT_COLOR='\033[0m'           # 重置顏色


timeout=180          # 單位（秒），如果等待時間超過timeout就會直接錯誤
elapsed_time=0
not_running_pods=()  # 用來記錄未處於 Running 狀態的 Pod
not_ready_pods=()    # 用來記錄未準備就緒的容器
exit_code=0


while true; do
  # 使用 kubectl 獲取 library-system 命名空間下所有 Pod 的狀態
  pods_status=$(kubectl get pods -n library-system --no-headers)

  # 檢查是否所有 Pod 都是 Running 且 READY 欄位的容器數量與總數一致
  all_running=true
  all_ready=true
  not_running_pods=()  # 清空未處於 Running 狀態的 Pod 名單
  not_ready_pods=()    # 清空未準備就緒的 Pod 名單
  
  echo -ne "\r已等待 ${elapsed_time} 秒 (Timeout ${timeout} 秒)"

  while read -r pod; do
    pod_name=$(echo "$pod" | awk '{print $1}')
    pod_status=$(echo "$pod" | awk '{print $3}')
    pod_ready=$(echo "$pod" | awk '{print $2}')
    ready_count=$(echo "$pod_ready" | cut -d'/' -f1)
    total_count=$(echo "$pod_ready" | cut -d'/' -f2)

    # 檢查 Pod 是否為 Running
    if [[ "$pod_status" != "Running" ]]; then
      all_running=false
      not_running_pods+=("$pod_name")  # 添加未處於 Running 狀態的 Pod
    fi

    # 檢查容器是否都準備就緒
    if [[ "$ready_count" != "$total_count" ]]; then
      all_ready=false
      not_ready_pods+=("$pod_name")  # 添加未準備就緒的 Pod
    fi
  done <<< "$pods_status"

  # 如果所有 Pod 都是 Running 且容器都準備就緒，則退出
  if [[ "$all_running" == true && "$all_ready" == true ]]; then
    echo -e "\n${LIGHT_GREEN_FONT_COLOR}所有服務皆已啟動完畢。${RESET_FONT_COLOR}\n"
    break
  fi

  # 如果超過了設定的逾時時間，則退出
  if [[ "$elapsed_time" -ge "$timeout" ]]; then
    echo -e "\n${ERROR_FONT_COLOR}等候逾時，以下服務的Pod仍未成功啟動或容器未就緒：${RESET_FONT_COLOR}"
    if [[ "${#not_running_pods[@]}" -gt 0 ]]; then
      echo -e "\n${ERROR_FONT_COLOR}以下Pod沒有處於Running狀態，請輸入${LIGHT_YELLOW_FONT_COLOR}kubectl -n library-system describe po <pod名稱>${ERROR_FONT_COLOR}指令查看詳細訊息：${RESET_FONT_COLOR}"
      for pod in "${not_running_pods[@]}"; do
        echo -e "${ERROR_FONT_COLOR} - $pod${RESET_FONT_COLOR}"
      done
    fi
    if [[ "${#not_ready_pods[@]}" -gt 0 ]]; then
      echo -e "\n${ERROR_FONT_COLOR}以下Pod的容器未全部準備就緒，請輸入${LIGHT_YELLOW_FONT_COLOR}kubectl -n library-system logs <pod名稱>${ERROR_FONT_COLOR}指令，檢查服務的主容器是否出錯：${RESET_FONT_COLOR}"
      for pod in "${not_ready_pods[@]}"; do
        echo -e "${ERROR_FONT_COLOR} - $pod${RESET_FONT_COLOR}"
      done
    fi
    exit_code=1
    break
  fi

  # 等待 1 秒鐘後重新檢查
  sleep 1
  elapsed_time=$((elapsed_time + 1))
done

exit $exit_code