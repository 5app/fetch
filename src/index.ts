import fetch from 'node-fetch';

export interface Options {
	timeout?: number;
	headers?: object;
}

const defaultOptions: Options = {
	timeout: 5000,
};

type ResponseObject = object;

/**
 * @typedef {object} ResponseObject
 */

/**
 * Request to get JSON from a web resource
 * @param {string} url - URL to resource
 * @param {object} [options] - Request options
 * @returns {Promise<ResponseObject>} JSON Object
 */
export async function fetchJSON(
	url: string,
	options?: Options
): Promise<ResponseObject> {
	// Fetch and JSON parse the response
	const opts = {...defaultOptions, ...options};

	// Create a timeout controller
	const controller = new AbortController();
	const timeout = setTimeout(() => {
		controller.abort();
	}, opts.timeout);

	const headers = {
		Accept: 'application/json',
		...options?.headers,
	};

	try {
		const resp = await fetch(url, {signal: controller.signal, headers});
		if (resp.status >= 400) {
			throw new Error(`Fetch failed: ${resp.status}`);
		}
		return resp.json() as ResponseObject;
	} finally {
		// Clear timeout
		clearTimeout(timeout);
	}
}
