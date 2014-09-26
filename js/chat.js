// conf
SERVER_URL = "http://127.0.0.1";
SERVER_PORT = "5000";

// functions
function send_click(data) {
    //console.log($("input#chat_input").val());
    console.log(SERVER_URL + ":" + SERVER_PORT + "/");
    console.log(data);
    url = SERVER_URL + ":" + SERVER_PORT + "/",
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            contentType: 'application/json;charset=UTF-8'
        })
}

function clicks() {
    $("a#send").click(function () {
        data = $("input#chat_input").val();
        console.log(data)
        data = {
            message: data,
            client: "test"
        }
        send_click(JSON.stringify(data))
        // alert( "Handler for .click() called." );
    });
}

// calls
$(document).ready(function () {
    clicks()
});
