export function getApiURL() {
	if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") {
		return "http://localhost:5000/";
	}
	return "https://api." + window.location.hostname.replace("www.", "").split(".").slice(1).join(".") + "/";
}

export function getPrivateSpaceURL() {
	if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") {
		return "http://localhost:3001/";
	}
	if (window.location.hostname.includes("test")) {
		return "https://test-my.cy.lu/";
	}
	return "https://my." + window.location.hostname.replace("www.", "").split(".").slice(1).join(".") + "/";
}

export function getMainAppURL() {
	if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") {
		return "http://localhost:3002/";
	}
	return "https://" + window.location.hostname.replace("www.", "").split(".").slice(1).join(".") + "/";
}

export function isInternetExplorer() {
	const ua = window.navigator.userAgent;
	const msie = ua.indexOf("MSIE ");

	return msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
}
