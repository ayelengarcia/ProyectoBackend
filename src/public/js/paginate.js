document.getElementById("form-paginate").onsubmit =(e)=>{
    e.preventDefault()
    const limit = document.getElementById("limit").value
    const page = document.getElementById("page").value

    const url = `/products/paginate/?page=${page}&limit=${limit}`

    window.location.href = url;
}