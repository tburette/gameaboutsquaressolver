/*
Content script associated with the page of the game
*/

//TODO split in multiple file AI stuff and page interaction
//TODO button
//TODO when click button create dynmically script that that post the data for us
//   see http://stackoverflow.com/questions/18707341/how-to-access-page-variables-from-chrome-extension-background-script and http://stackoverflow.com/questions/3955803/page-variables-in-content-script


function solveButtonFactory(){
    var button = document.createElement('button');
    button.id = 'solver-btn';

    var spanIcon = document.createElement('span');
    button.appendChild(spanIcon);
    spanIcon.setAttribute('class', 'typcn');
    spanIcon.innerHTML = 'S';


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

function sendDataOnButtonClick(button){
    var sendGameStateMessage = "\
window.postMessage($('.game-object').map(function(){var go = this.gameObject; var ret = {posX: go.posX, posY: go.posY};\
    if(go.constructor == GAMEABOUTSQUARES.Engine.Square) ret.gameObject = {team: go.team, direction: go.action.name};\
    else if(go.core.constructor == GAMEABOUTSQUARES.Engine.Heart) ret.gameObject = go.team;\
    else if(go.constructor == GAMEABOUTSQUARES.Engine.Tile && go.core.constructor == GAMEABOUTSQUARES.Engine.Action) ret.gameObject = go.core.name;\
    return ret;\
}).get(), '*')"

    button.addEventListener('click', function(){
	var script = document.createElement('script');
	script.id = 'solverSendState_7c84b192cc57b2451f2834276f30c050';
	script.appendChild(document.createTextNode(sendGameStateMessage));
	(document.body || document.head || document.documentElement).appendChild(script);
	script.remove();
    })

};

var solveButton = solveButtonFactory();
addButtonToUI(solveButton);
sendDataOnButtonClick(solveButton);


/*
We need to retrieve the state of the game.
A content script cannot access javascript variables from the page, it can only access its DOM.
We Use postMessage to retrieve the data. The page send a message with the data and we retrieve it
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
});


function Point(x, y){
    this.x = x;
    this.y = y;
}
Point.prototype.add = function add(point){
    return new Point(this.x + point.x, this.y + point.y);
}
Point.prototype.move = function(){
    var moves = {
	"up": new Point(0, -1),
	"down": new Point(0, 1),
	"left": new Point(-1, 0),
	"right": new Point(1, 0)
    };
    return function move(dir){
	return this.add(moves[dir]);
    }
}();//closure!


function ProblemFactory(pageData){
    this.pageData = pageData;
}
ProblemFactory.prototype.findMinPos = function findMinPos(){
    return new Point(
	_.min(this.pageData, function(elem){return elem.posX}).posX,
	_.min(this.pageData, function(elem){return elem.posY}).posY);
}
ProblemFactory.prototype.findMaxPos = function findMaxPos(){
    return new Point(
	_.max(this.pageData, function(elem){return elem.posX}).posX,
	_.max(this.pageData, function(elem){return elem.posY}).posY);
}
ProblemFactory.prototype.isDirectionChanger = function isDirectionChanger(data){
    return typeof data.gameObject == "string";
}
ProblemFactory.prototype.isGoal = function isGoal(data){
    return typeof data.gameObject == "number";
}
ProblemFactory.prototype.isSquare = function isSquare(data){
    return typeof data.gameObject == "object";
}
ProblemFactory.prototype.createProblem = function createProblem(){
    var problem = new Problem(this.findMinPos(), this.findMaxPos());

    _.each(this.pageData, function(data){
	if(this.isSquare(data)){
	    problem.initialState.push({
		pos: new Point(data.posX, data.posY),
		team: data.gameObject.team,
		dir: data.gameObject.direction
	    });
	    problem.teams.push(data.gameObject.team);
	}else if(this.isDirectionChanger(data) || this.isGoal(data)){
	    problem.objects[data.posX][data.posY] = data.gameObject;
	}else{
	    console.error("unknown data object " + data);
	}
    }, this);

    return problem;
} 


//TODO create a state class a move all relevant code to it

/*
Data necessary to define the Problem to be solved
*/
function Problem(min, max){
    this.min = min;
    this.max = max;
    //two dimensional array [x][y]
    this.objects = this.makeGrid(max);
    this.teams = [];
    this.initialState = [];
}
/*
game grid starts at 0,0
*/
Problem.prototype.makeGrid = function makeGrid(max){
    //+1 because positions start at 0. eg.: max pos of 3 = 4 elems
    return _.times(max.x + 1, function(){
	return new Array(max.y + 1);
    })
}
Problem.prototype.objectAt = function objectAt(pos){
    if(pos.x >= this.objects.length ||
       pos.y >= this.objects[pos.x].length)
	return null;
    return this.objects[pos.x][pos.y];
}
Problem.prototype.isGoalState = function isGoalState(state){
    return _.every(state, function(square){
	return square.team === this.objectAt(square.pos);
    }, this);
}
/*
Detect some (but not all) state for which a solution is impossible
*/
Problem.prototype.unsolvable = function unsolvable(state){
    return _.some(state, function(square){
	return square.pos.x < this.min.x || 
	    square.pos.x > this.max.x ||
	    square.pos.y < this.min.y ||
	    square.pos.y > this.max.y
    }, this);
}
Problem.prototype.cloneState = function cloneState(state){
    return _.map(state, function(square){
	//shallow copy, pos object shared
	return _.clone(square);
    });
}
Problem.prototype.squareOfTeam = function squareOfTeam(state, team){
    return _.find(state, function(square){
	return square.team === team;
    });
}
/*
return undefined if not found
*/
Problem.prototype.squareAtPos = function squareAtPos(state, pos){
    return _.find(state, function(square){
	return _.isEqual(square.pos, pos);
    });

}
/*
move square which belongs to state
*/
Problem.prototype.move = function move(state, square){
	var dirToPush = square.dir;
	//a square may push others, hence the loop
	while(square){
	    var newPos = square.pos.move(dirToPush);
	    //are we pushing another square?
	    //check before moving the old one otherwise two squares would be at
	    //the same position
	    var nextSquareToMove = this.squareAtPos(state, newPos);
	    square.pos = newPos;
	    //has the square changed direction because it is on an arrow?
	    //arrow represented by string "up", "left",... Ugly code!
	    if(typeof this.objectAt(newPos) === "string"){
		square.dir = this.objectAt(newPos);
	    }
            square = nextSquareToMove;
	}
    
}
Problem.prototype.nextStates = function nextStates(state){
    //one new state per square
    return _.map(state, function(squareToMove, index){
	var newState = this.cloneState(state);
	//we want to modify the square of newState, not state
	squareToMove = newState[index];
	this.move(newState, squareToMove);
	//move is the team of the square moved
	return {move: squareToMove.team, state: newState};
    }, this);
}


//TODO iterative deepening for optimal solution
function solve(problem){
    return iterativeDeepening(problem);
}

function iterativeDeepening(problem){
    for(var maxDepth = 0;;maxDepth++){
	var result = new DepthLimitedSearch(problem, maxDepth).search();
	if(result !== DepthLimitedSearch.cutoff) {
	    //answer or no result
	    return result;
	}
    }
}

function DepthLimitedSearch(problem, depthLimit){
    this.problem = problem;
    this.depthLimit = depthLimit;
}
DepthLimitedSearch.cutoff = undefined;
DepthLimitedSearch.prototype.search = function search(){
    var result = this.searchRec(
	problem.initialState,
	"dummy",
	0);
    if(result){
	result.pop();
	result.reverse();
    }
    return result;
}
/*

Return null if no solution exist
       undefined if the search was stopped due to depth limit
       a solution in the form of an array of move to perform
*/

DepthLimitedSearch.prototype.searchRec = function searchRec(state, move, depth){
    //i++;
    //console.log(state[0].team + " " + state[0].dir + " " + state[0].pos.x + 
    //" " + state[0].pos.y + "||"
    //+ state[1].team + " " + state[1].dir + " " + state[1].pos.x + " " + 
    //state[1].pos.y);
    var cutoffOccured = false;
    //pruning
    if(this.problem.unsolvable(state)) return null;
    else if(this.problem.isGoalState(state)) return [move];
    else if(depth == this.depthLimit) return DepthLimitedSearch.cutoff;
    else{
	var nextStates = this.problem.nextStates(state);
	for(var i = 0;i < nextStates.length;i++){
	    var next = nextStates[i];
	    var result = this.searchRec(next.state, next.move, depth+1);
	    if(result === this.cutoff) cutoffOccured = true;
	    else if(result){
		result.push(move);
		return result;
	    }

	}
	return cutoffOccured?DepthLimitedSearch.cutoff:null;
    }
}
