var vendor = "15";

var bootstrap = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js">' + '</' + 'script>' + '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js">' + '</' + 'script><link href="https://use.fontawesome.com/releases/v5.0.1/css/all.css" rel="stylesheet">';
// may required to be passed 
var response_html = '<li id="feedback-response-list" class="feedback-response-list" style="display: none"><button id="submit-button" name="submit-button" onclick="submitFunction()">Submit</button></li>';
var siteDomain = "http://localhost:8000/";

var head = document.getElementsByTagName("head")[0].innerHTML;
document.getElementsByTagName("head")[0].innerHTML += bootstrap;

var html = document.getElementsByClassName("chat-bot")[0].innerHTML;
var chatBotDiv = document.getElementsByClassName("chat-bot")[0];

//adding the question asked into the chat

function endMessage(message) {
    var finalMessage = document.createElement("LI");
    finalMessage.setAttribute("class", "messages final-message");
    finalMessage.appendChild(document.createTextNode(message));
    document.getElementById("messages").appendChild(finalMessage);
}

function questionAsked(questionText) {
    var quesMessage = document.createElement("LI");
    quesMessage.setAttribute("class", "messages question-asked");
    quesMessage.appendChild(document.createTextNode(questionText));
    document.getElementById("messages").appendChild(quesMessage);
}

//adding all the possible options from that question
function responseOptions(res, category) {
    var questionNext = res.question_next;
    var responseText = res.response_text;
    var responseId = res.response_id;

    if(category == 2 || category == 3){
        document.getElementById("feedback-response-list").style.display = "block";

        var divElement = document.createElement("div");
        divElement.setAttribute("class", "input-body");
        var feedbackResponse = document.createElement("input");
        if(category == 2){
            feedbackResponse.setAttribute("type", "checkbox");}
        else if(category == 3){
            feedbackResponse.setAttribute("type", "radio");
            feedbackResponse.setAttribute("name", "feedback");}
        feedbackResponse.setAttribute("class", "feedback-response");
        feedbackResponse.setAttribute("value", res.response_text);
        feedbackResponse.setAttribute("id", res.response_text);
        feedbackResponse.setAttribute("data-response-id", responseId);

        divElement.appendChild(feedbackResponse);
        var labelElement = document.createElement("label");
        labelElement.setAttribute("for", res.response_text);
        labelElement.appendChild(document.createElement("span"));
        labelElement.appendChild(document.createTextNode(responseText));

        divElement.appendChild(labelElement);
        document.getElementById("feedback-response-list").insertBefore(divElement, document.getElementById("feedback-response-list").childNodes[0]);
    } else {

        var responseComment = res.comment;
        var responseImageUrl = res.response_image_url;
        var responseUrl = res.response_url;
        var responseElement = document.createElement("LI");
        var responseList = document.getElementById("response-list");
        responseElement.setAttribute("data-question-next", questionNext);
        responseElement.setAttribute("data-response-comment", responseComment);
        responseElement.setAttribute("data-response-image-url", responseImageUrl);
        responseElement.setAttribute("data-response-url", responseUrl);
        responseElement.setAttribute("onclick", "fetchQuestion(this)");
        responseElement.setAttribute("data-response-id", responseId);
        responseElement.appendChild(document.createTextNode(responseText));
        responseList.insertBefore(responseElement, responseList.childNodes[0]);

    }
}
//adding the selected response to the chat
function autoScrollDown(){
    var length = document.getElementsByClassName("user-response").length - 1;
    document.getElementsByClassName("user-response")[length].scrollIntoView();
}

function responseComment(resComment) {
    var responseComment = document.createElement("LI");
    responseComment.setAttribute("class", "messages response-comment");
    responseComment.appendChild(document.createTextNode(resComment));
    document.getElementById("messages").appendChild(responseComment);
}
function responseImage(resImageURL, resURL){
    var responseComment = document.createElement("LI");
    responseComment.setAttribute("class", "messages response-comment");

    var image_element = document.createElement("img");
    image_element.setAttribute("src",resImageURL);
    image_element.setAttribute("alt","Link to product");
    image_element.setAttribute("style","width:100%;")

    if(resURL != "null"){
    image_url = document.createElement("a");
    image_url.setAttribute("href",resURL);
    image_url.appendChild(image_element);
    responseComment.appendChild(image_url);}
    else {
     responseComment.appendChild(image_element);   
    }
    document.getElementById("messages").appendChild(responseComment);
}

function responseMessage(respMessage, resComment, resImageURL, resURL) {
    debugger;
    var responseElement = document.createElement("LI");
    responseElement.setAttribute("class", "messages user-response");
    responseElement.appendChild(document.createTextNode(respMessage));
    document.getElementById("messages").appendChild(responseElement);

    if (resComment != "") {
        responseComment(resComment);
    }
    if (resImageURL != "null"){
        responseImage(resImageURL, resURL);
    }
}


function clearResponses() {
    var responseList = document.getElementById("response-list");
    while (responseList.hasChildNodes()) {
        responseList.removeChild(responseList.firstChild);
    }
    responseList.innerHTML += response_html;
}


function apiCall(questionId, currRespId = null, lastQuesId = null) {
    var queryString = `${siteDomain}api/vendor/${vendor}/question/${questionId}/`;
    if (currRespId) {
        queryString += `?resp=${currRespId}&`;
    }
    if (lastQuesId) {
        queryString += `lques=${lastQuesId}`;
    }
    debugger;
    fetch(queryString)
        .then(res => res.json())
        .then(function (response) {
            questionAsked(response.question_text);
            localStorage.setItem("last_Question", response.id);
            for (res of response.response_data) {
                responseOptions(res, response.category);
            }
            if (response.next_default_question_id) {
                var submitButton = document.getElementById("submit-button");
                submitButton.setAttribute("value", response.next_default_question_id);
            }
            autoScrollDown();
        });
}

function openChat() {
    if (document.getElementById("myForm").style.display == "block") {
        document.getElementById("myForm").style.display = "none";
        return;
    }
    document.getElementById("myForm").style.display = "block";
    //if page has not been left
    if (document.getElementById("messages").childNodes[1]) { return; }
    //if page is loaded
    else if (localStorage.getItem("chatHistory")) {
        var chatHistory = localStorage.getItem("chatHistory");
        chatHistory = JSON.parse(chatHistory);
        for (var count = 0; count < chatHistory.length; count++) {
            questionAsked(chatHistory[count].question);
            debugger;
            if (chatHistory[count].response) {
                responseMessage(chatHistory[count].response, chatHistory[count].comment, chatHistory[count].imageURL, chatHistory[count].URL);
            }
        }
        if (localStorage.getItem("last_Question")) {
            var questionId = parseInt(localStorage.getItem("last_Question"));
            apiCall(questionId);
        }else{
            endMessage("thanks for the feedback");
        }
        return;
    }
    questionAsked("Hi! I am Shiney...your personal Digital assistant!");
    fetch(siteDomain + "api/vendor/" + vendor + "/questions/?ifq=true")
        .then(res => res.json())
        .then(function (response) {
            //accessing first element only, to check for mistakenly more than 1, first questions.
            response = response[0];

            //Adding the question asked to the chat
            questionAsked(response.question_text);

            //overriding the last_Question asked variable
            localStorage.setItem("last_Question", response.id);

            //Adding all responses to the response-list
            for (res of response.response_data) {
                responseOptions(res, response.category);
            }
        });
}

function fetchQuestion(resp) {
    debugger;
    respMessage = resp.innerHTML;
    var resComment = resp.dataset.responseComment;
    var resImageURL = resp.dataset.responseImageUrl;
    var resURL = resp.dataset.responseUrl;
    var questionNextId = resp.dataset.questionNext;
    var currRespId = resp.dataset.responseId;
    var lastQuesId = parseInt(localStorage.getItem("last_Question")) || -1;

    //adding the selected response to the chat
    responseMessage(respMessage, resComment, resImageURL, resURL);

    //put code to delete chat here later
    clearResponses()

    if (questionNextId == "null") {
        //last_Question set to -1 when the chat reaches feedback form
        localStorage.setItem("last_Question", -1);

        //saving the whole chat into localstorage
        saveChat();
        return;
    }
    localStorage.removeItem("last_Question");
    localStorage.setItem("last_Question", parseInt(questionNextId, 10));

    apiCall(questionNextId, currRespId, lastQuesId);
}

function closeChat() {
    document.getElementById("myForm").style.display = "none";
}

function saveChat() {
    //saving the chat into localStoarge 
    if (!document.getElementById("messages").childNodes[1]) {
        return;
    }
    var chatHistory = [];
    var chat = document.getElementById("messages");
    chat = chat.getElementsByTagName("li");
    var question = "";
    var response = "";
    var comment = "";
    var imageURL = "null";
    var URL = "null";
    for (var i = 0; i < chat.length; i = i + 1) {
        var value = chat[i].classList.value;
        if (value.includes("question-asked")) {
            if (question != "") {
                chatHistory.push({ question: question, response: response, comment: comment, imageURL: imageURL, URL: URL});
                question = "";
                response = "";
                comment = "";
                imageURL = "null";
                URL = "null";
            }
            question = chat[i].innerHTML;
        } else if (value.includes("user-response")) {
            if (response != "") {
                response += ", "
            }
            response += chat[i].innerHTML
        } else if (value.includes("response-comment")) {
            if (chat[i].getElementsByTagName("a")[0]){
                debugger;
                URL = chat[i].getElementsByTagName("a")[0].getAttribute("href");
                image_element = chat[i].getElementsByTagName("a")[0];
                imageURL = image_element.getElementsByTagName("img")[0].getAttribute("src");
            }else{
                comment += chat[i].innerHTML;
            }
        }
        if (i == chat.length - 1 && !(value.includes("question-asked"))) {
            chatHistory.push({ question: question, response: response, comment: comment, imageURL: imageURL, URL: URL})
        }
    }
    chatHistory = JSON.stringify(chatHistory);
    localStorage.setItem("chatHistory", chatHistory);
}

function refresh() {
    closeChat();
    chatBotDiv.innerHTML = html;

    localStorage.removeItem("chatHistory");
    localStorage.removeItem("last_Question");

}

function submitFunction() {
    var feedbackResponse = document.getElementsByClassName("feedback-response");
    var submitButton = document.getElementById("submit-button");
    var lastQuesId = localStorage.getItem('last_Question')

    var message = "", respIds = "";

    for (var i = 0; i < feedbackResponse.length; i = i + 1) {
        if (feedbackResponse[i].checked) {
            if (message != "") {
                message += ",";
            }
            message += feedbackResponse[i].value;
            if (i !== feedbackResponse.length - 1) {
                respIds += `${feedbackResponse[i].dataset.responseId}, `;
            }
            else {
                respIds += `${feedbackResponse[i].dataset.responseId}`;
            }
        }
    }
    if (message != "") {
        responseMessage(message, "", "null", "null");
    }

    clearResponses();

    if (submitButton.value) {
        apiCall(parseInt(submitButton.value, respIds, lastQuesId));
        return;
    }
    localStorage.removeItem("last_Question");
    saveChat();
    endMessage("thanks for the feedback");
    autoScrollDown();
}


window.addEventListener("unload", function () {
    saveChat();
});

