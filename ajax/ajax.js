// ajax.js
export default class Ajax {
    constructor(options = {}) {
        this.config = {
            baseURL: options.baseURL || '',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            timeout: options.timeout || 5000,
        };
    }

    async _request(method, url, data = null, options = {}) {
        const controller = new AbortController();
        const timeout = options.timeout || this.config.timeout;

        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const mergedHeaders = {
            ...this.config.headers,
            ...(options.headers || {}),
        };

        const fetchOptions = {
            method,
            headers: mergedHeaders,
            signal: controller.signal,
        };

        if (data !== null) {
            fetchOptions.body = JSON.stringify(data);
        }

        const finalUrl = url.startsWith('http')
            ? url
            : this.config.baseURL + url;

        try {
            const res = await fetch(finalUrl, fetchOptions);
            clearTimeout(timeoutId);

            if (!res.ok) {
                const message = await this._safeJson(res);
                throw new Error(
                    `HTTP ${res.status}: ${res.statusText} – ${JSON.stringify(
                        message
                    )}`
                );
            }

            return await this._safeJson(res);
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                throw new Error(`Request timeout: przekroczono ${timeout} ms`);
            }
            throw new Error(`Network error: ${err.message}`);
        }
    }

    async _safeJson(res) {
        try {
            return await res.json();
        } catch {
            return null;
        }
    }

    async get(url, options = {}) {
        return this._request('GET', url, null, options);
    }

    async post(url, data, options = {}) {
        return this._request('POST', url, data, options);
    }

    async put(url, data, options = {}) {
        return this._request('PUT', url, data, options);
    }

    async delete(url, options = {}) {
        return this._request('DELETE', url, null, options);
    }
}
