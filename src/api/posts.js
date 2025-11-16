export async function fetchPosts() {
    // const response await fetch("http://localhost:8000/hostings"); // backend endpoint
    const data = await response.json();
    return data;
}