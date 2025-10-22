##################################################################
# 功能：此sh檔負責把服務部署到Kubernetes並啟動服務
#
# 備註：執行run_all.sh（或run_test.sh）架設系統時，此sh檔會順便執行
##################################################################

# 服務本體
kubectl -n library-system create configmap mysql-initdb --from-file ../library_system.sql
kubectl -n library-system apply -f ../library-system-mysql.yaml