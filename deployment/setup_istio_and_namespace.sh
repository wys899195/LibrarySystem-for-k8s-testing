#!/bin/bash
### 此sh檔用來自動部署系統所需的Istio,以及建立library-system namespace,確保後續能順利部署服務
#(重要：執行此sh檔之前請確保minikube已經啟動)

# 下載isito並解壓縮到home資料夾（壓縮檔如果存在就跳過下載）
ISTIO_ZIPFILE_NAME='istio-1.21.1-linux-amd64.tar.gz'
if [ ! -f ~/${ISTIO_ZIPFILE_NAME} ]; then
    wget -P ~/ https://github.com/istio/istio/releases/download/1.21.1/${ISTIO_ZIPFILE_NAME} 
fi
tar -xzvf ~/${ISTIO_ZIPFILE_NAME} -C ~/ 1>/dev/null

# 部署istio到minikube
~/istio-1.21.1/bin/istioctl install -f ../Library-system-Istio-sample-rate.yaml --skip-confirmation

# 建立library-system namespace
if ! kubectl get ns library-system; then
  kubectl create ns library-system
fi

# library-system namespace啟用Istio注入邊車(後續流量才會進得來)
kubectl label namespace library-system istio-injection=enabled

