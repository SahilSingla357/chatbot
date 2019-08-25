var vendor = "1";
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

        var responseElement = document.createElement("LI");
        responseElement.setAttribute("data-question-next", questionNext);
        responseElement.setAttribute("onclick", "fetchQuestion(this)");
        responseElement.appendChild(document.createTextNode(responseText));
        document.getElementById("response-list").appendChild(responseElement);
    }
    //adding the selected response to the chat
    function responseMessage(respMessage){
        var responseElement = document.createElement("LI");
        responseElement.setAttribute("class", "messages user-response");
        responseElement.appendChild(document.createTextNode(respMessage));
        document.getElementById("messages").appendChild(responseElement);
    }

    function openChat() {
        document.getElementById("myForm").style.display = "block";
                //if the close button is pressed and page is not loaded, still chat will remain
        if(document.getElementById("messages").childNodes[1])
        {
            return;
        }
        //if the feedback form is shown, it will remain there even after page reload unless submitted
        //if feedback is shown, last)_question asked is set to -1
        else if (localStorage.getItem("last_Question") == '-1')
        {
            document.getElementById("feedback").style.display = "block";
            document.getElementById("myForm").removeChild(document.getElementById("chatflow"))
            return;
        }
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

                //Adding the question asked to the chat
                questionAsked(response.question_text);

                //overriding the last_Question asked variable
                localStorage.setItem("last_Question",response.id);

                //Adding all responses to the response-list
                for (res of response.response_data){
                    responseOptions(res);
                }
            });
    }

    function fetchQuestion(resp) {
        respMessage = resp.innerHTML;

        var question_next = resp.dataset.questionNext;
        if(question_next == "null") {
          
          //last_Question set to -1 when the chat reaches feedback form
          localStorage.setItem("last_Question", -1); 
          
          //adding the selected response to the chat
          responseMessage(respMessage);

          //saving the whole chat into localstorage
          saveChat();

          //Deleting the response-list and creating a new one which has no elements
          var responseList = document.getElementById("response-list");
          responseList.parentNode.removeChild(responseList);

          document.getElementById("feedback").style.display = "block";
          document.getElementById("myForm").removeChild(document.getElementById("chatflow"));
          return;
        }

        responseMessage(respMessage);

        var questionNextId = resp.dataset.questionNext;
        //Deleting the response-list and creating a new one which has no elements
        var responseList = document.getElementById("response-list");
        responseList.parentNode.removeChild(responseList);


        var responseDiv = document.getElementById("responses-div");
        var responseList = document.createElement("UL");
        responseList.setAttribute("id", "response-list");
        responseDiv.appendChild(responseList);

        localStorage.removeItem("last_Question");
        localStorage.setItem("last_Question",parseInt(questionNextId,10));

        fetch(siteDomain + "api/vendor/" + vendor + "/question/" + questionNextId)
            .then(res => res.json())
            .then(function(response) {

                //Adding the recieved question_text from the api hit
                questionAsked(response.question_text);

                //Adding all responses to the response-list
                for (res of response.response_data){
                    responseOptions(res);
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
        var count = 0;
        //if chat.length%2 == 0, chat has reached feedback form
        //else chat is on a question
        while(count < ((chat.length%2==0) ?(chat.length):(chat.length-1))){
            chatHistory.push({question : chat[count].innerHTML, response : chat[count+1].innerHTML});
            count = count+2;
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
