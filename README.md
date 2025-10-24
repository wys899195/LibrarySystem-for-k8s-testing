# LibrarySystem-for-k8s-testing
## Introduction
This is a simple library system designed for testing Kubernetes deployment.This project is derived from [tgb3yhn3/librarySystem](https://github.com/tgb3yhn3/librarySystem). It simulates typical librarian operations, including:
1. Borrowing and returning books.
2. Collection management (including adding and removing books from the collection, adjusting inventory, etc.).
3. User blacklist management (allowing or prohibiting general users from borrowing and returning books).

The API-only version is [here](https://github.com/wys899195/LibrarySystem-for-API-path-testing-of-KMamiz)

## Technical Architecture
1. Frontend: HTML, CSS, and JavaScript.
2. Backend: Python FastAPI.
3. Database: MySQL & phpMyAdmin.

## Get started
To install LibrarySystem on your Kubernetes cluster, follow the steps below.

### Pre-requirements
1. Ensure the Docker environment is ready in the virtual machine.
2. Set up a Minikube cluster.

### Deployment 
1. If you have already set up the Minikube environment and the virtual machine has more than 10GB of memory, you can directly execute **`run_all.sh`**  in the deployment folder for a quick deployment.
2. If the memory size is insufficient, you can edit the start_minikube.sh file to adjust the memory allocation for starting Minikube.

### Viewing the front-end pages of this system.
1. Open "[http://localhost:6677/](http://localhost:6677/)" to see the front-end homepage of the system.
