#!/bin/bash
### 此sh檔用來把圖書館系統從minikube暴露到localhost 讓外部能夠連線到前端頁面
# (由於圖書館系統目前使用istio-ingressgateway作為閘道器,因此下面指令的意思是暴露istio-ingressgateway到localhost)
gnome-terminal --title="此終端機用來把圖書館系統從minikube暴露到localhost" -- bash -c "echo '此終端機用來把圖書館系統從minikube暴露到localhost，為了讓外部能連到圖書館系統，請不要關閉此終端機';minikube tunnel & kubectl port-forward -n istio-system svc/istio-ingressgateway 6677:80 --address=0.0.0.0; exec bash"
