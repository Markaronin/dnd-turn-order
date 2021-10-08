import { notUndefined } from "../../node_modules/@markaronin/jefferson-util/dist/index";

interface UnsuccessfulRequest {
    success: false;
}

export function getCookie(cname: string): string | undefined {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

export class APIHelper {
    private static readonly baseUrl = "https://m83obq436a.execute-api.us-east-1.amazonaws.com/prod";

    public static getData(): Promise<UnsuccessfulRequest | { success: true; body: string }> {
        return APIHelper.jsonGetRequest("data");
    }

    // public static login(body: {usernameOrEmail: string, password: string}): Promise<UnsuccessfulRequest | {success: true, valid: false} | {success: true, valid: true, cookies: string[]}> {
    //     return APIHelper.jsonPostRequest("login", body)
    // }

    // public static register(body: {username: string, email: string, password: string}): Promise<UnsuccessfulRequest | {success: true, valid: false} | {success: true, valid: true, token: string}> {
    //     return APIHelper.jsonPostRequest("register", body)
    // }

    private static jsonGetRequest(url: string): Promise<any | UnsuccessfulRequest> {
        return APIHelper.handleFetch(url, {
            method: "GET",
        });
    }

    private static jsonPutRequest(url: string, body: unknown): Promise<any | UnsuccessfulRequest> {
        return APIHelper.handleFetch(url, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    private static handleFetch(url: string, options: RequestInit): Promise<any | UnsuccessfulRequest> {
        return fetch(`${APIHelper.baseUrl}/${url}`, {
            ...options,
            headers: { ...options.headers, authorization: notUndefined(getCookie("Auth")) },
        })
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
