
class Api {
    static baseUrl = "http://localhost:8000";   // change this if deployed

    // ---- Generic helper ----
    static async request(endpoint, method = "GET", body = null) {
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
        };

        if (body) options.body = JSON.stringify(body);

        const res = await fetch(`${this.baseUrl}${endpoint}`, options);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || "API error");
        }

        return res.json();
    }

    // -------------------------------
    // USERS
    // -------------------------------
    static createUser(user) {
        return this.request("/users", "POST", user);
    }

    static getUsers() {
        return this.request("/users");
    }

    static login(username, password) {
        return this.request("/login", "POST", { username, password });
    }
    // -------------------------------
    // POSTINGS
    // -------------------------------
    static getPostings() {
        return this.request("/postings");
    }

    static getFullPostings() {
        return this.request("/fullpostings");
    }

    static createPosting(posting) {
        return this.request("/postings", "POST", posting);
    }

    static deletePosting(username, eat_time) {
        return this.request(`/postings/user/${username}/${eat_time}`, "DELETE");
    }

    static joinPosting(username, eat_time) {
        return this.request(`/postings/join?username=${username}&eat_time=${eat_time}`, "PATCH");
    }

    static leavePosting(username, eat_time) {
        return this.request(`/postings/leave?username=${username}&eat_time=${eat_time}`, "PATCH");
    }
}

export default Api;