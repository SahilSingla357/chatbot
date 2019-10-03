var vendor = "15";
//based on ui 
//may not be required
var bootstrap = '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js">'+'</'+'script>'+'<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js">'+'</'+'script><link href="https://use.fontawesome.com/releases/v5.0.1/css/all.css" rel="stylesheet">';
// may required to be passed 
var siteDomain = "http://localhost:8000/";
    
    var head = document.getElementsByTagName("head")[0].innerHTML;
    document.getElementsByTagName("head")[0].innerHTML += bootstrap;


    var html = document.getElementsByClassName("chat-bot")[0].innerHTML;
    var chatBotDiv = document.getElementsByClassName("chat-bot")[0];

    // var chatBotDiv = document.createElement("div");
    // chatBotDiv.setAttribute("class","chat-bot");
    // var body = document.getElementsByTagName("body")[0];
    // body.appendChild(chatBotDiv); 
    
    // chatBotDiv.innerHTML = HTMLTEXT;

    // if(document.getElementsByTagName("style")[0])
    // {
    //     // var csstext = document.createTextNode(CSSTEXT);
    //     document.getElementsByTagName("style")[0].innerHTML = CSSTEXT;
    // }
    // else{
    //     var style = document.createElement("style");
    //     document.getElementsByTagName("head")[0].appendChild(style);
    //     style.innerHTML = CSSTEXT;
    // }


    //refresh button feature
    var refreshButton = document.createElement("button");
    refreshButton.setAttribute("class","refresh-button");
    refreshButton.setAttribute("id","refresh-button");
    refreshButton.setAttribute("onclick","refresh()");
    refreshButton.setAttribute("data-toggle","tooltip");
    refreshButton.setAttribute("data-placement","left");
    refreshButton.setAttribute("title","refresh");
    document.getElementsByTagName('body')[0].appendChild(refreshButton);

    var refreshIcon =document.createElement("span");
    refreshIcon.setAttribute("class","glyphicon glyphicon-refresh");
    document.getElementById("refresh-button").appendChild(refreshIcon);

    
    //adding the question asked into the chat
    function questionAsked(questionText) {
        var quesMessage = document.createElement("LI");
        quesMessage.setAttribute("class", "messages question-asked");
        quesMessage.appendChild(document.createTextNode(questionText));
        document.getElementById("messages").appendChild(quesMessage);
    }

    //adding all the possible options from that question
    function responseOptions(res) {
        var questionNext = res.question_next;
        var responseText = res.response_text;
        var responseComment = res.comment;
        var responseElement = document.createElement("LI");
        responseElement.setAttribute("data-question-next", questionNext);
        responseElement.setAttribute("data-response-comment",responseComment);
        responseElement.setAttribute("onclick", "fetchQuestion(this)");
        responseElement.appendChild(document.createTextNode(responseText));
        document.getElementById("response-list").appendChild(responseElement);
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
            document.getElementById("messages").appendChild(responseElement);
        }
    }

    function feedbackOptions(res, has_multiple_responses){
        if(has_multiple_responses){
            var questionNext = res.question_next;
            var responseText = res.response_text;

            var feedbackResponse = document.createElement("input");
            feedbackResponse.setAttribute("type", "checkbox");
            feedbackResponse.setAttribute("class", "feedback-response");
            feedbackResponse.setAttribute("value", res.response_text);
            feedbackResponse.setAttribute("data-question-next", questionNext);
            // feedbackResponse.setAttribute("onclick", "fetchQuestion(this)");
            // feedbackResponse.appendChild(document.createTextNode(res.response_text));
            document.getElementById("feedback-form").insertBefore(feedbackResponse,document.getElementById("feedback-form").childNodes[0]);
            feedbackResponse.insertAdjacentText("beforeend", res.response_text);

        }else{
            var questionNext = res.question_next;
            var responseText = res.response_text;

            var feedbackResponse = document.createElement("input");
            feedbackResponse.setAttribute("type", "radio");
            feedbackResponse.setAttribute("class", "feedback-response");
            feedbackResponse.setAttribute("value", res.response_text);
            feedbackResponse.setAttribute("data-question-next", questionNext);
            // feedbackResponse.setAttribute("onclick", "fetchQuestion(this)");
            // feedbackResponse.appendChild(document.createTextNode(res.response_text));
            document.getElementById("feedback-form").insertBefore(feedbackResponse, document.getElementById("feedback-form").childNodes[0]);
            feedbackResponse.insertAdjacentText("beforeend", res.response_text);
        }
    }

    function openChat() {
        document.getElementById("myForm").style.display = "block";
                //if the close button is pressed and page is not loaded, still chat will remain
        if(document.getElementById("messages").childNodes[1])
        {
            return;
        }
        //if the feedback form is shown, it will remain there even after page reload unless submitted
        //if feedback is shown, last_question asked is set to -1
        // else if (localStorage.getItem("last_Question") == '-1')
        // {
        //     // document.getElementById("feedback").style.display = "block";
        //     document.getElementById("myForm").removeChild(document.getElementById("chatflow"))
        //     return;
        // }
        //if chat is on any question and page is reloaded, chat will be retrieved from local history
        else if(localStorage.getItem("last_Question")){

            var chatHistory = localStorage.getItem("chatHistory")
            chatHistory = JSON.parse(chatHistory)
            for (var count = 0; count < chatHistory.length ; count++){
                questionAsked(chatHistory[count].question);
                responseMessage(chatHistory[count].response);
            }

            var questionId = parseInt(localStorage.getItem("last_Question"));
            fetch(siteDomain + "api/vendor/" + vendor + "/question/" + questionId)
            .then(res => res.json())
            .then(function(response){
                questionAsked(response.question_text);
                for (res of response.response_data){
                    responseOptions(res);
                }
            });
            return;
        }
        //Create the first Question
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
                    responseOptions(res);
                }
            });
    }

    function fetchQuestion(resp) {
        debugger;
        respMessage = resp.innerHTML;
        respComment = resp.dataset.responseComment;

        var question_next = resp.dataset.questionNext;
        if(question_next == "null") {
          
          //last_Question set to -1 when the chat reaches feedback form
          localStorage.setItem("last_Question", -1); 
          
          //adding the selected response to the chat
          responseMessage(respMessage, respComment);

          //saving the whole chat into localstorage
          saveChat();

          //Deleting the response-list and creating a new one which has no elements
          // var responseList = document.getElementById("response-list");
          // responseList.parentNode.removeChild(responseList);
          // var form = document.createElement("form");
          // form.setAttribute("id","feedback-form");
          // var input_submit = document.createElement("input");
          // input_submit.setAttribute("type","submit");
          // input_submit.setAttribute("value","submit");
          // form.appendChild(input_submit);
          // responseList.appendChild(form);


          // document.getElementById("feedback").style.display = "block";
          document.getElementById("myForm").removeChild(document.getElementById("chatflow"));
          return;
        }

        responseMessage(respMessage, respComment);

        var questionNextId = resp.dataset.questionNext;
        //Deleting the response-list and creating a new one which has no elements
        // var responseList = document.getElementById("response-list");
        // responseList.parentNode.removeChild(responseList);
        // var form = document.createElement("form");
        // form.setAttribute("id","feedback-form");
        // form.setAttribute("style","display: none");
        // var input_submit = document.createElement("input");
        // input_submit.setAttribute("type","submit");
        // input_submit.setAttribute("value","submit");
        // form.appendChild(input_submit);
        // responseList.appendChild(form);


        // var responseDiv = document.getElementById("responses-div");
        // var responseList = document.createElement("UL");
        // responseList.setAttribute("id", "response-list");
        // responseDiv.appendChild(responseList);

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
                    responseOptions(res);
                    }
                }
            });
    }

    function closeChat() {
        document.getElementById("myForm").style.display = "none";
    }

    function FormSubmit(){
        var fname = document.getElementById("fname").value;
        var lname = document.getElementById("lname").value;
        var feedback = document.getElementById("subject").value;

        var input = {
            "first_name" : fname,
            "last_name" : lname,
            "feedback" : feedback,
        }

        var response = fetch(siteDomain + "api/user/feedback/",{
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(input)});
        localStorage.removeItem("last_Question");
        document.getElementById("feedback").style.display = "none";
        successMessage();
    }

    function successMessage(){
        var x = document.getElementById("success-message");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
    }

    function saveChat(){
        //saving the chat into localStoarge 
        var chatHistory=[];
        var chat = document.getElementById("messages");
        chat = chat.getElementsByTagName("li");
        debugger;
        var count = 0;
        //if chat.length%2 == 0, chat has reached feedback form
        //else chat is on a question
        // while(count < ((chat.length%2==0) ?(chat.length):(chat.length-1))){
        //     chatHistory.push({question : chat[count].innerHTML, response : chat[count+1].innerHTML});
        //     count = count+2;
        var question = "";
        var response = "";
        var comment = "";
        for(var i=0;i<chat.length;i=i+1){
            var value = chat[i].classList.value;
            if(value.includes("question-asked")){
                if(question != ""){
                    chatHistory.push({question : question, response : response, comment : comment})

                }else{
                    question = chat[i].innerHTML;
                }
            }else if(value.includes("user-response")){
                if(response != ""){
                    reponse +=";"
                }
                response +=chat[i].innerHTML
            }else if(value.includes("response-comment")){
                if(comment != ""){
                    comment +=";"
                }
                comment +=chat[i].innerHTML
            }
            if(i == chat.length-1){
                chatHistory.push({question : question, response : response, comment : comment})
            }
        }
        chatHistory = JSON.stringify(chatHistory);
        localStorage.setItem("chatHistory",chatHistory);
    }

    function refresh(){
        closeChat();
        chatBotDiv.innerHTML = html;

        localStorage.removeItem("chatHistory");
        localStorage.removeItem("last_Question");
        
    }

    window.addEventListener("unload", function() {
  saveChat();
});
