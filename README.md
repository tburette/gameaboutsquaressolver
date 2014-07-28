Game About Squares Solver
===

This chrome extension is a simple AI to attempt to solve Game About Squares levels.

It is not able to solve all the levels. Well, technically it should be able to solve all the levels given enough memory and time, sometimes lots of memory and time!

Algorithms
---

Multiple algorithms have been tried. You can look at the code in the [gassolver.js file](https://github.com/tburette/gameaboutsquaressolver/blob/master/gameaboutsquaressolver/gassolver.js#L315).

The first algorithm was an [iterative deepening depth-first search](http://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search). It works well for the first levels but choked on level 11, 14 and everything above 16.

To go further, the [Breadth-first search](http://en.wikipedia.org/wiki/Breadth-first_search) algorithm was implemented. Some level worked better than iterative deepening other worse.

To avoid visiting again and again the same states I augmented the BFS algorithm by adding a list of already visited states. With this algorithm a few more levels can be solved.


Possible Improvements to solve all levels
===
* more agressive pruning by detecting unsolvable states.
* reducing the state space collapsing multiple moves into a single one.
* informed search to steer towards more promising states. I wouldn't be suprised if a good heuristic were to allow solving all the levels. Eg. a good old A*
* searching starting from the result and moving backward towards the initial state
