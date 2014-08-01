/*
Content script associated with the page of the game
*/

/*
Allow the displaying of a message overlayed on the game
*/
function SolverMessage(){
    var displayElements = this.messageDisplayFactory();
    this.div = displayElements.div;
    this.text = displayElements.text;
    this.button = displayElements.button;
    this.frown = displayElements.frown;
}

SolverMessage.prototype.messageDisplayFactory= function messageDisplayFactory(){
    var div = document.createElement('div');
    div.id = 'solver-message';
    div.setAttribute('class', 'invisible');
    
    var recenter = document.createElement('div');
    div.appendChild(recenter);
    recenter.setAttribute('class', 'recenter');
    
    var frown = document.createElement('span');
    recenter.appendChild(frown);
    frown.id = 'frown';
    frown.innerHTML = ':-(';
    frown.setAttribute('class', 'invisible');

    var p = document.createElement('p');
    recenter.appendChild(p);
    p.id = 'solver-message-text';
    p.innerHTML = "";

    var footer = document.createElement('div');
    footer.id = 'solver-message-footer';
    recenter.appendChild(footer);

    var button = document.createElement('button');
    footer.appendChild(button);
    button.setAttribute('class', 'typcn icon-back');

    var that = this;
    button.addEventListener('click', function(){
	div.setAttribute('class', 'invisible');
	if(that.callbackClosed)
	    that.callbackClosed(that);
    });
 
    document.body.appendChild(div);
    return {div: div, 
	    text: p,
	    button: button,
	    frown: frown
	   };
}

SolverMessage.prototype.show = function show(){
    this.div.setAttribute('class', '');
}

SolverMessage.prototype.hide = function hide(){
    this.div.setAttribute('class', 'invisible');
}

SolverMessage.prototype.setMessage = function setMessage(message, frown){
    this.text.innerHTML = message;
    if(frown)
	this.frown.setAttribute('class', '');
    else
	this.frown.setAttribute('class', 'invisible');
}

SolverMessage.prototype.setEventClosedListener = function setEventClosedListener(callback){
    this.callbackClosed = callback;
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


function stopExecutingMovesOnResetOrLevelSelect(){
    script = "\
(function closure(){\
    var onLvlSelect = GAMEABOUTSQUARES.Hooks.onLvlSelect;\
    GAMEABOUTSQUARES.Hooks.onLvlSelect = function(){\
	executeMoves = function(){};\
	onLvlSelect(undefined, Array.prototype.slice.apply(arguments));\
    };\
    var onLevelStart = GAMEABOUTSQUARES.Hooks.onLevelStart;\
    GAMEABOUTSQUARES.Hooks.onLevelStart = function(){\
	executeMoves = function(){};\
	onLevelStart(undefined, Array.prototype.slice.apply(arguments));\
    }\
})()";
    executeJavascriptInWebpageContext(script);
}

stopExecutingMovesOnResetOrLevelSelect();

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
    var messageUI = new SolverMessage();
    //the initial state of the problem represented by event.data is not 
    //(necessary) the initial state of the puzzle but is the current state of 
    //the game when the user launched the solver
    var problem = new ProblemFactory(event.data).createProblem();
    messageUI.show("Searching...");
    var solver = solve(problem, 
		 function progressUpdateUI(message){
		     messageUI.setMessage(message);
		 }, 
		 function finished(result){
		     //must free reference to AI stuff, there could be a lot of memory used!
		     solver = null;
		     messageUI.setEventClosedListener(null);
		     messageUI.hide();

		     if(result){
			 //remove the last step so we don't automatically jump to the next level?
			 //result.pop();
			 executeMoves(result);
		     }else{
			 //tell the user there is no answer
			 messageUI.setMessage("Couldn't find an answer", true);
		     }
		 });
    
    messageUI.setEventClosedListener(function (){
	solver.cancelSearch();
	//must free reference to AI stuff, there could be a lot of memory used!
	solver = null;
	messageUI.setEventClosedListener(null);
    });

});

