var vendor = "15";

var bootstrap = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js">'+'</'+'script>'+'<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js">'+'</'+'script><link href="https://use.fontawesome.com/releases/v5.0.1/css/all.css" rel="stylesheet">';
// may required to be passed 
var response_html = '<li id="feedback-response" style="display: none"><form id="feedback-form"><input type="submit" name="submit"></form></li>';
var siteDomain = "http://localhost:8000/";
    
    var head = document.getElementsByTagName("head")[0].innerHTML;
    document.getElementsByTagName("head")[0].innerHTML += bootstrap;

    //adding the question asked into the chat
    function questionAsked(questionText) {
        var quesMessage = document.createElement("LI");
        quesMessage.setAttribute("class", "messages question-asked");
        quesMessage.appendChild(document.createTextNode(questionText));
        document.getElementById("messages").appendChild(quesMessage);
    }

    //adding all the possible options from that question
    function responseOptions(res, category) {
        debugger;
        var questionNext = res.question_next;
        var responseText = res.response_text;
        if(category == 2){

            document.getElementById("feedback-response").style.display = "block";

            var feedbackResponse = document.createElement("input");
            feedbackResponse.setAttribute("type", "checkbox");
            feedbackResponse.setAttribute("class", "feedback-response");
            feedbackResponse.setAttribute("value", res.response_text);
            // feedbackResponse.setAttribute("data-question-next", questionNext);
            // feedbackResponse.appendChild(document.createTextNode(responseText));
            document.getElementById("feedback-form").insertBefore(feedbackResponse,document.getElementById("feedback-form").childNodes[0]);
            // feedbackResponse.insertAdjacentText("beforeend", res.response_text);
            // document.createElement('br').insertAfter(feedbackResponse)
            feedbackResponse.parentNode.insertBefore(document.createElement('br'),feedbackResponse.nextSibling)
            feedbackResponse.parentNode.insertBefore(document.createTextNode(responseText),feedbackResponse.nextSibling)

        }else if(category == 3){

            document.getElementById("feedback-response").style.display = "block";

            var feedbackResponse = document.createElement("input");
            feedbackResponse.setAttribute("type", "radio");
            feedbackResponse.setAttribute("class", "feedback-response");
            feedbackResponse.setAttribute("value", res.response_text);
            // feedbackResponse.setAttribute("data-question-next", questionNext);
            // feedbackResponse.appendChild(document.createTextNode(responseText));
            // feedbackResponse.innerHTML = '"'+responseText+'"';
            document.getElementById("feedback-form").insertBefore(feedbackResponse, document.getElementById("feedback-form").childNodes[0]);
            // feedbackResponse.insertAdjacentText("beforeend", res.response_text);
            // document.createElement('br').insertAfter(feedbackResponse)
            feedbackResponse.parentNode.insertBefore(document.createElement('br'),feedbackResponse.nextSibling)
            feedbackResponse.parentNode.insertBefore(document.createTextNode(responseText),feedbackResponse.nextSibling)

        }else{

            var responseComment = res.comment;
            var responseElement = document.createElement("LI");
            var responseList = document.getElementById("response-list");
            responseElement.setAttribute("data-question-next", questionNext);
            responseElement.setAttribute("data-response-comment",responseComment);
            responseElement.setAttribute("onclick", "fetchQuestion(this)");
            responseElement.appendChild(document.createTextNode(responseText));
            responseList.insertBefore(responseElement,responseList.childNodes[0]);

        }
    }
    //adding the selected response to the chat
    function responseMessage(respMessage, resComment){
        var responseElement = document.createElement("LI");
        responseElement.setAttribute("class", "messages user-response");
        responseElement.appendChild(document.createTextNode(respMessage));
        document.getElementById("messages").appendChild(responseElement);

        if(resComment != ""){
            var responseComment = document.createElement("LI");
            responseComment.setAttribute("class", "messages response-comment");
            responseComment.appendChild(document.createTextNode(resComment));
            document.getElementById("messages").appendChild(responseComment);
        }
    }

    function clearResponses(){
        var responseList = document.getElementById("response-list");
        while (responseList.hasChildNodes()){
        responseList.removeChild(responseList.firstChild);}
        responseList.innerHTML += response_html;
    }

    function openChat(){
        if(document.getElementById("myForm").style.display == "block"){
            document.getElementById("myForm").style.display = "none";
            return;
        }
        document.getElementById("myForm").style.display = "block";
        //if page has not been left
        if(document.getElementById("messages").childNodes[1]){return;}
        //if page is loaded
        else if(localStorage.getItem("last_Question")){

            var chatHistory = localStorage.getItem("chatHistory")
            chatHistory = JSON.parse(chatHistory)
            for (var count = 0; count < chatHistory.length ; count++){
                questionAsked(chatHistory[count].question);
                responseMessage(chatHistory[count].response, chatHistory[count].comment);
            }

            var questionId = parseInt(localStorage.getItem("last_Question"));
            fetch(siteDomain + "api/vendor/" + vendor + "/question/" + questionId)
            .then(res => res.json())
            .then(function(response){
                questionAsked(response.question_text);
                    for (res of response.response_data){
                        debugger;
                        responseOptions(res, response.category);
                    }
            });
            return;
        }
        fetch(siteDomain + "api/vendor/" + vendor + "/questions/?ifq=true")
            .then(res => res.json())
            .then(function(response) {
                //accessing first element only, to check for mistakenly more than 1, first questions.
                response = response[0]; 
                debugger;

                //Adding the question asked to the chat
                questionAsked(response.question_text);

                //overriding the last_Question asked variable
                localStorage.setItem("last_Question",response.id);

                //Adding all responses to the response-list
                for (res of response.response_data){
                    debugger;
                    responseOptions(res, response.category);
                }
            });
    }

    function fetchQuestion(resp){
        respMessage = resp.innerHTML;
        var respComment = resp.dataset.responseComment;
        var questionNextId = resp.dataset.questionNext;

        //adding the selected response to the chat
        responseMessage(respMessage, respComment);

        //put code to delete chat here later
        clearResponses()

        if(questionNextId == "null") {
          //last_Question set to -1 when the chat reaches feedback form
          localStorage.setItem("last_Question", -1); 
    
          //saving the whole chat into localstorage
          saveChat();

          return;
        }

        localStorage.removeItem("last_Question");
        localStorage.setItem("last_Question",parseInt(questionNextId,10));

        fetch(siteDomain + "api/vendor/" + vendor + "/question/" + questionNextId)
            .then(res => res.json())
            .then(function(response) {
                debugger;
                //Adding the recieved question_text from the api hit
                questionAsked(response.question_text);

                //Adding all responses to the response-list
                if(response.is_feedback_question){
                    debugger;
                    document.getElementById('feedback-form').style.display="block";
                   for (res of response.response_data){
                    feedbackOptions(res,response.has_multiple_responses);
                    }
                }
                else{
                    for (res of response.response_data){
                    responseOptions(res, response.category);
                    }
                }
            });
    }

    function closeChat() {
        document.getElementById("myForm").style.display = "none";
    }

    function successMessage(){
        var x = document.getElementById("success-message");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
    }

    function saveChat() {
        //saving the chat into localStoarge 
        var chatHistory=[];
        var chat = document.getElementById("messages");
        chat = chat.getElementsByTagName("li");
        var question = "";
        var response = "";
        var comment = "";
        for(var i=0;i<chat.length;i=i+1){
            var value = chat[i].classList.value;
            if(value.includes("question-asked")){
                if(question != ""){
                    chatHistory.push({question : question, response : response, comment : comment});
                    question = "";
                    response = "";
                    comment = "";
                }
                    question = chat[i].innerHTML;
            }else if(value.includes("user-response")){
                if(response != ""){
                    response +=";"
                }
                response +=chat[i].innerHTML
            }else if(value.includes("response-comment")){
                if(comment != ""){
                    comment +=";"
                }
                comment +=chat[i].innerHTML
            }
            if(i == chat.length-1 && !(value.includes("question-asked"))){
                chatHistory.push({question : question, response : response, comment : comment})
            }
        }
        chatHistory = JSON.stringify(chatHistory);
        localStorage.setItem("chatHistory",chatHistory);
    }

    window.addEventListener("unload", function() {
        saveChat();
    });

    function refresh(){
        closeChat();
        chatBotDiv.innerHTML = html;

        localStorage.removeItem("chatHistory");
        localStorage.removeItem("last_Question");
        
    }