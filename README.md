# LibrarySystem-for-k8s-testing
## Introduction
This is a simple library system designed for testing Kubernetes deployment.This project is derived from [tgb3yhn3/librarySystem](https://github.com/tgb3yhn3/librarySystem). It simulates typical librarian operations, including:
1. Borrowing and returning books.
2. Collection management (including adding and removing books from the collection, adjusting inventory, etc.).
3. User blacklist management (allowing or prohibiting general users from borrowing and returning books).


## Technical Architecture
1. Frontend: Built using pure HTML, CSS, and JavaScript.
2. Backend: Developed with Python FastAPI.
3. Utilizes the MySQL database system, with phpMyAdmin allowing administrators to manage MySQL databases via a web interface.


## Let's get started
To install LibrarySystem on your Kubernetes cluster, follow the steps below.

### Pre-requirements
1. [Istio](https://istio.io/latest/docs/setup/getting-started/) is installed in your cluster.
2. [Zipkin](https://istio.io/latest/docs/ops/integrations/zipkin/) is set up and enabled in Istio.
3. 
