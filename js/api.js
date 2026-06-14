
const API_URL = ""; 

async function request(endpoint, method = "GET", data = null) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" }
    };

    const response = await fetch(API_URL + endpoint, options);

}

async function request(
    endpoint,
    method = "GET",
    data = null
){

    const options = {
        method,
        headers: {
            "Content-Type":
            "application/json"
        }
    };

    const token =
        localStorage.getItem("token");

    if(token){

        options.headers.Authorization =
            "Bearer " + token;

    }

    if(data){

        options.body =
            JSON.stringify(data);

    }

    const response =
        await fetch(
            API_URL + endpoint,
            options
        );

    const result =
        await response.json();

    if(!response.ok){

        throw new Error(
            result.message
        );

    }

    return result;
}