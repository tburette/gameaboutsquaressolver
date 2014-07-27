/*
Content script associated with the page of the game
*/

alert("extension running! ");

/*
A content script cannot access variables from the page.
Use message to communicate
https://developer.chrome.com/extensions/content_scripts#host-page-communication
*/
window.addEventListener("message", function(event) {
    if(event.source != window)
	return;
    xxx = event.data
    console.log("Received data " + event.data);
});

