const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch(
    endpoint:string,
    options:RequestInit = {}
) {
    const token = localStorage.getItem("token");

    const headers: any = {
        "Content-Type": "application/json",
    };

    if(token){
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${endpoint}`,{
        ...options,
        headers
    });

    if(!res.ok){
        throw new Error("API request failed");
    }

    return res.json(); 
}