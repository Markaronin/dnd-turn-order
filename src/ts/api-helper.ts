interface UnsuccessfulRequest {
    success: false;
}

export class APIHelper {
    private static readonly baseUrl = "https://api.dnd-turn-order.markaronin.com";

    // public static login(body: {usernameOrEmail: string, password: string}): Promise<UnsuccessfulRequest | {success: true, valid: false} | {success: true, valid: true, cookies: string[]}> {
    //     return APIHelper.jsonPostRequest("login", body)
    // }

    // public static register(body: {username: string, email: string, password: string}): Promise<UnsuccessfulRequest | {success: true, valid: false} | {success: true, valid: true, token: string}> {
    //     return APIHelper.jsonPostRequest("register", body)
    // }

    public static jsonPostRequest(url: string, body: unknown): Promise<any | UnsuccessfulRequest> {
        return APIHelper.handleFetch(url, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    public static handleFetch(url: string, options: RequestInit): Promise<any | UnsuccessfulRequest> {
        return fetch(`${APIHelper.baseUrl}/${url}`, options)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Something went wrong");
                }
            })
            .catch((reason) => {
                console.error(reason);
                return { success: false };
            });
    }
}
