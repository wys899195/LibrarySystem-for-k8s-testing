##################################################################
# 功能：此sh檔負責在minikube環境建立前端的docker image
#
# 備註：執行update.sh時，此sh檔會一併執行
##################################################################


# 當中途出現錯誤時會立即中止sh檔
set -e


# 進去minikube的docker環境
eval $(minikube docker-env)

# 刪掉舊版的image
docker rmi -f wys899195_library/borrowing_service:latest

# 建新版容器image
DOCKER_BUILDKIT=1 docker build ../app -t wys899195_library/borrowing_service:latest

# 退出minikube的docker環境
eval $(minikube docker-env --unset)