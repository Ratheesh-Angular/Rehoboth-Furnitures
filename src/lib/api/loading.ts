type LoadingListener = (isLoading: boolean) => void;

class LoadingService {
  private listeners: Set<LoadingListener> = new Set();
  private activeRequests = 0;

  subscribe(listener: LoadingListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  startLoading() {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.notifyListeners(true);
    }
  }

  stopLoading() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      this.notifyListeners(false);
    }
  }

  private notifyListeners(isLoading: boolean) {
    this.listeners.forEach((listener) => listener(isLoading));
  }
}

export const loadingService = new LoadingService();
