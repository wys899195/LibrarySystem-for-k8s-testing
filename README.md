# LibrarySystem-for-k8s-testing
## Introduction
This is a simple library system designed for testing Kubernetes deployment.This project is derived from [tgb3yhn3/librarySystem](https://github.com/tgb3yhn3/librarySystem). It simulates typical librarian operations, including:
1. Borrowing and returning books.
2. Collection management (including adding and removing books from the collection, adjusting inventory, etc.).
3. User blacklist management (allowing or prohibiting general users from borrowing and returning books).

## Technical Architecture
1. Frontend: HTML, CSS, and JavaScript.
2. Backend: Python FastAPI.
3. Utilizes the MySQL database system, with phpMyAdmin allowing administrators to manage MySQL databases via a web interface.

## Let's get started
To install LibrarySystem on your Kubernetes cluster, follow the steps below.

### Pre-requirements
1. Prepare a Kubernetes cluster environment (e.g., using Minikube).
2. [Istio](https://istio.io/latest/docs/setup/getting-started/) is installed in your cluster.
3. Namespace library-system exists.
   ```
   kubectl create ns library-system
   ```
### Deployment 
1. You can execute run.sh for quick deployment.
   ```
   ./run.sh
   ```
### Viewing the front-end pages of this system.
1. Referencing the steps for [deploying the Bookinfo system with Istio](https://istio.io/latest/docs/setup/getting-started/#determining-the-ingress-ip-and-ports), get the $GATEWAY_URL of the Istio system.
2. Open "http://$GATEWAY_URL/page" to see the front-end homepage of the system.
3. Additionally, you can also open "http://$GATEWAY_URL/api/v1/docs" to view the system's FastAPI documentation.
   
## Uninstall
1. You can execute stop.sh to quickly undeploy.
   ```
   ./stop.sh
   ```
2. After undeploying, also delete the namespace.
   ```
   kubectl delete ns library-system
   ```
3. Delete the related Docker containers.
   ```
   docker rmi -f wys899195/fastapi_library_system_backend
   docker rmi -f wys899195/fastapi_library_system_frontend
   ```
