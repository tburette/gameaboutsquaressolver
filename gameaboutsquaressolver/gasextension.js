/*
Content script associated with the page of the game
*/


function noAnswerFactory(){
    var div = document.createElement('div');
    div.id = 'solver-no-answer';
    div.setAttribute('class', 'invisible');
    
    var recenter = document.createElement('div');
    div.appendChild(recenter);
    recenter.setAttribute('class', 'recenter');
    
    var frown = document.createElement('span');
    recenter.appendChild(frown);
    frown.id = 'frown';
    frown.innerHTML = ':-('

    var p = document.createElement('p');
    recenter.appendChild(p);
    p.innerHTML = "Couldn't find an answer";

    var footer = document.createElement('div');
    footer.id = 'solver-no-answer-footer';
    recenter.appendChild(footer);
    

    var button = document.createElement('button');
    footer.appendChild(button);
    button.setAttribute('class', 'typcn icon-back');

    button.addEventListener('click', function(){
	div.setAttribute('class', 'invisible');
    });
 
    document.body.appendChild(div);
    return div;
}

var noAnswerDiv = noAnswerFactory();
var showNoAnswer = function showNoAnswer(){
    noAnswerDiv.setAttribute('class', '');
}

function solveButtonFactory(){
    var button = document.createElement('button');
    button.id = 'solver-btn';

    var spanIcon = document.createElement('span');
    button.appendChild(spanIcon);
    spanIcon.setAttribute('class', 'typcn');
    spanIcon.innerHTML = '?';


    var spanText = document.createElement('span');
    button.appendChild(spanText);
    spanText.setAttribute('class', 'ctrl-text');
    spanText.innerHTML = 'solve';

    return button;
}

function addButtonToUI(button){
    var li = document.createElement('li');
    li.appendChild(button);
    document.getElementsByClassName('main-btns')[0].appendChild(li);
}

/*
Dynamically inject script to execute code in the concept of the web page
see http://stackoverflow.com/questions/18707341/how-to-access-page-variables-
    from-chrome-extension-background-script and http://stackoverflow.com/questions/3955803/page-variables-in-content-script
*/
function executeJavascriptInWebpageContext(code){
	var script = document.createElement('script');
	script.appendChild(document.createTextNode(code));
	(document.body || document.head || document.documentElement).appendChild(script);
	script.remove();
    
}

function sendDataOnButtonClick(button){
    var sendGameStateMessage = "\
window.postMessage($('.game-object').map(function(){var go = this.gameObject; var ret = {posX: go.posX, posY: go.posY};\
    if(go.constructor == GAMEABOUTSQUARES.Engine.Square) ret.gameObject = {team: go.team, direction: go.action.name};\
    else if(go.core.constructor == GAMEABOUTSQUARES.Engine.Heart) ret.gameObject = go.team;\
    else if(go.constructor == GAMEABOUTSQUARES.Engine.Tile && go.core.constructor == GAMEABOUTSQUARES.Engine.Action) ret.gameObject = go.core.name;\
    return ret;\
}).get(), '*')"

    button.addEventListener('click', function(){
	executeJavascriptInWebpageContext(sendGameStateMessage);
    })

};

var solveButton = solveButtonFactory();
addButtonToUI(solveButton);
sendDataOnButtonClick(solveButton);


function executeMoves(moves){
    var script = "\
moves = " + JSON.stringify(moves)+";\
function executeMoves(moves){\
    var team;\
    if(moves.length > 0){\
        team=moves.shift();\
        GAMEABOUTSQUARES.Model.playerMove($('.square').filter(function(){return this.gameObject.team == team })[0].gameObject);\
        setTimeout(function(){executeMoves(moves)}, 800);\
    }\
}\
executeMoves(moves);";

    executeJavascriptInWebpageContext(script);
}


/*
We need to retrieve the state of the game.
A content script cannot access javascript variables from the page, it can only access its DOM.
We Use postMessage to transfer the data. The page send a message with the data and we retrieve it
Note that we could retrieve the data by examining the DOM but it would be messier
see https://developer.chrome.com/extensions/content_scripts#host-page-communication
*/
window.addEventListener("message", function(event) {
    if(event.source != window)
	return;
    //the initial state of the problem is not (necessary) the initial state of the puzzle 
    //but is the current state of the game when we launched the solver
    problem = new ProblemFactory(event.data).createProblem();
    console.log(result=solve(problem));
    if(result){
	//remove the last step so we don't automatically jump to the next level?
	//result.pop();
	executeMoves(result);
    }else{
	//tell the user there is no answer
	showNoAnswer();
    }

});

