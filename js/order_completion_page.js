$(document).ready(() => {
    //get the name of the buyer from the url (the url of this page must be loaded from the parfait joint main website)
    const queryString = window.location.search;//get the search query string from the url (i.e the characters after the "?" of the url)
    var urlParameters = new URLSearchParams(queryString);//extract the parameters

    //now to use the name of the person that placed the order in the success message
    var intro_text = document.getElementById("intro_text");
    intro_text.innerHTML = `Hi ${urlParameters.get("full_name")}`;
});