/*
AI code of the extension
*/
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


/*
Faster on large sizes than doing push() and shift() (in chrome 37.0.2062)
Breaks once we reach 2^53 (max contiguous int that can fit in a Number)
*/
function Queue(){
    var queue = [];
    var queueStart = 0;
    var queueEnd = 0;
    
    this.isEmpty = function isEmpty(){
	return queueStart == queueEnd;
    };
    this.length = function length(){
	return queueEnd - queueStart;
    };
    this.add = function add(value){
	queue[queueEnd++] = value;
    };
    this.remove = function remove(){
	if(this.isEmpty()) throw new RangeError("empty");
	return queue[queueStart++];
    };
}


/*
 return a function to be called on each iteration to check if we must yield execution
 temporarily so the UI can be refreshed and other javascript code can execute.
 before a yielf updateCallback is called to provide information about 
 If the function returns true then the caller must stop execution immediatly.

 updateCallback function called when we are about to suspend execution. parameter will contain
     a description of the progress of the algorithm

 delayBeforeUpdate int how long to wait before yielding and calling updateCallback

 getProgress a fucntion to retrieve a string specifying the progress of the algorithm
     will be passed to updateCallback

 continueExecuting a function specifying how to resume execution. Typically:
     function(){someObject.search();} (mind the this of the function executed!)
*/
//TODO when updateCallback is called, other javascript execution has been 
//prevented for a long while. It might be nice to yield, let any update occur, 
//execute updateCallback and resume computation immediatly after
function updateCallbackChecker(
    updateCallback, 
    delayBeforeUpdateMS, 
    getProgress,
    continueExecuting){
    //to avoid creating a new Date object on each call, we use an 
    //increasing number to only check every X call
    //careful when setting the value: 
    //    iterations quick at the beginning and can slow down later
    var ITERATIONS_BEFORE_CHECKING_FOR_UPDATE = 1000;
    var updateTimeStart;
    var updateIterations;

    return function checkUpdateCallback(){
	if(!updateTimeStart){
	    updateTimeStart = new Date().getTime();
	    updateIterations = 1;	
	}else if(updateIterations % ITERATIONS_BEFORE_CHECKING_FOR_UPDATE == 0){
	    if(new Date().getTime() - updateTimeStart > delayBeforeUpdateMS){

		updateTimeStart = null;
		setTimeout(continueExecuting, 1);
		//TODO this is a user function, anything can happen. 
		//shouldn't we catch exceptions?
		updateCallback(getProgress());
		return true;
	    }
	}else
	    updateIterations++;
	return false;
    }
}


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
!!!game grid may not start at 0,0 yet we consider here it does
if there are negative values the array object will contain fields!
length will be wrong
*/
Problem.prototype.makeGrid = function makeGrid(max){
    //+1 because positions start at 0. eg.: max pos of 3 = 4 elems
    return _.times(max.x + 1, function(){
	return new Array(max.y + 1);
    })
}

Problem.prototype.objectAt = function objectAt(pos){
    /*
    if(pos.x < this.min.x ||
       pos.x > this.max.x ||
       pos.y < this.min.y ||
       pos.y > this.max.y)
	return null;
     */
    return this.objects[pos.x] && this.objects[pos.x][pos.y];
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
	//TODO could be wrong! a block can be pushed outside by another block 
	//yet still be oriented to go inward
	return square.pos.x < this.min.x - 1 || 
	    square.pos.x > this.max.x + 1 ||
	    square.pos.y < this.min.y - 1 ||
	    square.pos.y > this.max.y + 1
    }, this);
}

Problem.prototype.cloneState = function cloneState(state){
    //Optimized because profiler says lot of CPU time here
    var newState = new Array(state.length);
    for(var i = 0; i < state.length; i++){
	newState[i] = {
	    pos: state[i].pos,
	    team: state[i].team,
	    dir: state[i].dir
	};
    }
    return newState;

/*    return _.map(state, function(square){
	//shallow copy, pos object shared
	return _.clone(square);
    });
*/
}

/*
return undefined if not found
*/
Problem.prototype.squareAtPos = function squareAtPos(state, pos){
    //Optimized because profiler says lot of CPU time here
    for(var i = 0; i < state.length;i++){
	if(state[i].pos.x == pos.x && state[i].pos.y == pos.y) return state[i];
    }
    return undefined;
/*    return _.find(state, function(square){
	return _.isEqual(square.pos, pos);
    });
*/
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


/*
the function returns nothing immediatly.
execution of the search algorithm will stop briefly
regularly to allow he UI to work and will automatically resume (with setTimeout)
updateCallback is called regularly with a string parameter stating the search progress.
finishedCallback is called when a solution is found or there is no solution
*/
function solve(problem, updateCallback, finishedCallback){
    //return iterativeDeepening(problem);
    //return bfs(problem);
    return bfsClosed(problem, updateCallback, finishedCallback);
}

function bfs(problem){
    return new TreeSearch(problem).search();
}

function bfsClosed(problem, updateCallback, finishedCallback){
    var gs= new GraphSearch(problem, updateCallback, finishedCallback);
    gs.search();
    return gs;
}


function stateToString(state){
    return _.reduce(state, function(acc, val){return acc + val.pos.x + val.dir[0] + val.pos.y + val.team + "|"}, "");
}


function GraphSearch(problem, updateCallback, finishedCallback){
    this.problem = problem;
    this.iterations = 0;
    this.closed = {};
    this.fringe = new Queue();
    this.fringe.add({state: this.problem.initialState, parent: null, move: null});

    //count how many level of the search tree we have explored
    //= we have tried all possible combinations of 'level' moves or fewer
    this.level = 0;
    this.fringe.add({level:this.level});

    this.finishedCallback = finishedCallback;
    this.mustCancelSearch = false;
    var that = this;
    this.mustYieldAndUpdate = updateCallbackChecker(
	updateCallback, 
	500, 
	function(){return that.getProgress();},
	function(){that.search();});

    //debug vars
    //this.closedCount = 0;
    //this.dups = 0;
    //this.start = new Date().getTime();    
}

/*
To be called from outside to stop the search
*/
GraphSearch.prototype.cancelSearch = function cancelSearch(){
    this.mustCancelSearch = true;
}


GraphSearch.prototype.getProgress = function getProgress(){
    return "Tried all solutions in " + this.level + " moves or less. " +
	this.iterations + " moves performed";
}

GraphSearch.prototype.makeSolution = function makeSolution(node){
    function makeSolutionRec(node){
	if(node.parent == null)
	    return [];
	return makeSolutionRec(node.parent).concat([node.move]);
    }
    return makeSolutionRec(node);
}

/*
keep a list of all already visited states
*/
GraphSearch.prototype.search = function search(){
    while(true){
	this.iterations++;
	if(this.mustCancelSearch)
	    return;
	if(this.mustYieldAndUpdate()){
	    return;
	}

	//debug
	//if(this.iterations % 5000 == 0){
	//    var time = new Date().getTime() - this.start;
	//    console.log(time/1000 + " " + this.iterations + " closed " + this.closedCount + 
	//		" dups " + this.dups + " fringe " + this.fringe.length());
	//}

	if(this.fringe.isEmpty()){
	    this.finishedCallback(null);
	    return;
	}
	var node = this.fringe.remove();

	if(node.hasOwnProperty('level')){
            this.level = node.level;
	    //console.log("level " + this.level);
	    this.fringe.add({level: this.level + 1});
	    continue;
	}
	
	if(this.problem.isGoalState(node.state)){
	    this.finishedCallback(this.makeSolution(node));
	    return;
	}
	var stateString = stateToString(node.state);
	if(!this.closed[stateString]){
	    this.closed[stateString] = true;

	    //this.closedCount++;//debug

	    //Optimized because profiler says lot of CPU time here	    
	    var newStates = this.problem.nextStates(node.state);
	    for(var idx = 0; idx < newStates.length;idx++){
		var state = newStates[idx];
		state.parent = node;
		this.fringe.add(state);
	    }

	}//else
	    //this.dups++;//debug
    }
}


//Tree search not working due to missing updateCallbackChecker integration
function TreeSearch(problem){
    this.problem = problem;
}

TreeSearch.prototype.makeSolution = function makeSolution(node){
    function makeSolutionRec(node){
	if(node.parent == null)
	    return [];
	return makeSolutionRec(node.parent).concat([node.move]);
    }
    return makeSolutionRec(node);
}

TreeSearch.prototype.search = function search(){
    var fringe = [];
    fringe.push({state: this.problem.initialState, parent: null, move: null});
    while(true){
	if(fringe.length == 0) return null;
	var node = fringe.shift();
	if(this.problem.isGoalState(node.state))
	   return this.makeSolution(node);
	fringe = fringe.concat(_.map(this.problem.nextStates(node.state), function(state){state.parent = node; return state;}));
    }
}


//iterative deepening DFS not working due to missing updateCallbackChecker integration
function iterativeDeepening(problem){
    //don't go deeper than MAX_DEPTH moves to avoid burning CPU
    //We could let the iterative deepening algorithm work until it exhausts all possible moves
    var MAX_DEPTH = 99;
    for(var depthLimit = 0;depthLimit<MAX_DEPTH;depthLimit++){
	var result = new DepthLimitedSearch(problem, depthLimit).search();
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
