##################################################################
# 功能：此sh檔負責下架服務，將服務從Kubernetes中移除
#
# 備註：此sh檔通常不常使用，主要在需要修改k8s的相關設定檔才需要執行
##################################################################

# 服務本體
kubectl -n library-system delete -f ../k8s/library-system-frontend.yaml

# API Gateway
kubectl -n library-system delete -f ../k8s/library-system-gateway.yaml