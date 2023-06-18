/**
 * Core api class of connection to server
 */
interface RequestHeaders {
  "Content-Type": string;
  Authorization?: string;
}

enum RequestMethods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

interface RequestOptions {
  method: RequestMethods;
  requestURL: string;
  params?: object;
  body?: { data?: any };
}

interface RequestErrorHandler {
  (error: any): void;
}

class ApiClient {
  baseUrl: string;
  authToken?: string;

  _onRequestErrorHandler?: RequestErrorHandler;

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error('"baseUrl" is required!');
    }

    this._onRequestErrorHandler = undefined;

    this.baseUrl = baseUrl;
  }

  clear() {
    this.setAuthToken();
  }

  static CONTENT_TYPES = {
    JSON: "application/json; charset=utf-8",
    X_WWW_FORM_URLENCODED: "application/x-www-form-urlencoded; charset=utf-8",
  };

  get(requestURL: string, params?: object): Promise<any> {
    return this._request({
      method: RequestMethods.GET,
      requestURL,
      params,
    });
  }

  post(requestURL: string, data?: object): Promise<any> {
    return this._request({
      method: RequestMethods.POST,
      requestURL,
      body: data,
    });
  }

  put(requestURL: string, data?: object): Promise<any> {
    return this._request({
      method: RequestMethods.PUT,
      requestURL,
      body: data,
    });
  }

  patch(requestURL: string, data?: object): Promise<any> {
    return this._request({
      method: RequestMethods.PATCH,
      requestURL,
      body: data,
    });
  }

  delete(requestURL: string, data?: object): Promise<any> {
    return this._request({
      method: RequestMethods.DELETE,
      requestURL,
      body: data,
    });
  }

  async _request({
    method,
    requestURL,
    params = {},
    body = {},
  }: RequestOptions): Promise<any> {
    const url = this._getUrl(requestURL, params);
    const headers = this._getHeadersByMethod(method);
    const bodyString = this._getBodyByMethod(method, body);
    const options = { method, headers, body: bodyString };

    const resp = await this.fetch(url, options, 2);

    // if (!resp || resp.status !== 200) {
    if (!resp) {
      return this._handleRequestError("Bad response");
    }

    const response = await resp.json();

    if (response.status === 0) {
      return this._handleRequestError(response.error);
    }

    if (response.data !== undefined) {
      return response.data;
    } else {
      return response;
    }
  }

  async fetch(url: string, options: object, attempts = 2) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await fetch(url, options);
      } catch (error: any) {
        if (
          error &&
          error.name === "TypeError" &&
          error.message === "Network request failed"
        ) {
          await this._delay(100);
          continue;
        } else throw error;
      }
    }
  }

  async _delay(ms = 100) {
    return new Promise((res) => setTimeout(res, ms));
  }

  setAuthToken(authToken?: string) {
    this.authToken = authToken;
  }

  getAuthToken(): string {
    return this.authToken || "";
  }

  onRequestError(onRequestErrorHandler: RequestErrorHandler) {
    this._onRequestErrorHandler = onRequestErrorHandler;
  }

  _getUrl(url: string, params: object = {}): string {
    const queryString = this._encodeQueryString(params);

    return `${this.baseUrl}/${url}?${queryString}`;
  }

  _getBodyByMethod(method: RequestMethods, body: object): string | undefined {
    if (method !== RequestMethods.GET) {
      return this._getBodyByContentType(
        this._getContentTypeByMethod(method),
        body
      );
    }

    return;
  }

  _getBodyByContentType(contentType: string, body: object): string {
    return contentType === ApiClient.CONTENT_TYPES.JSON
      ? JSON.stringify(body)
      : this._encodeQueryString(body);
  }

  _getHeadersByMethod(method: RequestMethods): RequestHeaders {
    return {
      "Content-Type": this._getContentTypeByMethod(method),
      Authorization: this.authToken,
      // 'Cache-Control' : 'no-cache'
    };
  }

  _getContentTypeByMethod(method: RequestMethods): string {
    return method === RequestMethods.GET
      ? ApiClient.CONTENT_TYPES.X_WWW_FORM_URLENCODED
      : ApiClient.CONTENT_TYPES.JSON;
  }

  _encodeQueryString(payload: any): string {
    return Object.keys(payload)
      .map((key) => `${key}=${payload[key]}`)
      .join("&");
  }

  _handleRequestError(e: any) {
    const error = typeof e === "string" ? new Error(e) : e;

    if (this._onRequestErrorHandler) {
      return this._onRequestErrorHandler(error);
    }

    throw error;
  }
}

export default ApiClient;
