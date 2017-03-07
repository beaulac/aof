# Node Graph Parameters
Instructions on how to modify and test the Node Graph system.
</br></br>

## Running the Node Graph
1. In Terminal, navigate to the ```aof``` root directory. In OSX, simply opening the Terminal and dragging the ```aof``` directory into it should do the trick.
2. Type ```brunch watch --server``` into the Terminal. A bunch of text should spit out, and a message should eventually be output stating that compilation is finished.
3. In your browser, type ```localhost:3333```. You should now be able to interact with the node graph.

**Note**: If you make any modifications to the files after the above steps, the changes should automatically be picked up and re-compiled. So simply refreshing the page should have your new changes show up.

## Parameters

```PROBABILITY_TICK:``` This value controls the increase in probability for each node type for every time it is not picked for a node. For example: a 'bass' node has probability 0.4 of being picked, whilst 'beat' has probability 0.5. For the current node, 'bass' gets picked and its probability resets to the value of ```PROBABILITY_TICK```, and the 'beat' probability 'ticks' up to 0.6. Eventually, if a node type reaches a probability of 1, it will be definitely be picked next round (unless there is a tie).
 </br></br>
 Range: [0.1]
 ___

 ```BRANCHING_PROBABILITY:``` The probability that a new node will be the parent of the next node in the list. Example: 2 nodes, A and B, currently exist in the graph, B being a child of A. If the ```BRANCHING_PROBABILITY``` is 0.8, there is an 80% chance that the next node, C, is a child of B, rather than a sibling of B, in other words a child of A.
 </br></br>
 Range: [0.1]
 ___

 ```types:``` Defines the number of each type of sample to load into the graph. Example:

```
static types = {
     "Beat": 5,
     "Bass": 3,
     "Element": 10,
     "Speech": 5,
     "Texture": 10
 };
 ```
  ___

 ```BUILD_FIXED:``` Whether to build the pre-defined 'fixed' tree, or a randomized tree.
 </br></br>
 Values: ```true``` or ```false```
 ___

 ```fixedSamplesTree```: This list is what defines the fixed version of the node graph, by defining which samples to load, and what samples each is connected to. It is comprised of what is called 'key-value' pairs, the collection of these key-value pairs being known as a dictionary. It has the following format:

 ```
 static fixedSamplesTree =
 {
    <key1>: <value>,
    <key2>: <value>,
    ...
 }
 ```
 It is important that each key be unique, however the same value can be mapped to multiple keys if desired.

 The keys define which samples will be loaded, and are simply the filenames of these samples, example "A10_Speech.mp3".

 The values are a list of samples which will be connected to the sample defined by the key. Example:  ["A14_Texture.mp3", "A2_Bass.mp3"], these nodes will be children of the node defined in the key. There can be as many samples in here as you like, but they must also exist as a key somewhere in the list (otherwise they will not have been loaded).

 An example list could look like this:
 ```
 static fixedSamplesTree =
 {
     "A10_Speech.mp3": ["A14_Texture.mp3"],
     "A14_Texture.mp3": ["A2_Bass.mp3", "F4_Beat.mp3"],
     "A2_Bass.mp3": ["A10_Speech.mp3"],
     "F4_Beat.mp3": []
 }
 ```

 Not all nodes need children, and you can also have a node be a child of multiple other nodes (creating a cycle in the graph).

 To simplify typing these lists, and to avoid typing errors, it is probably simpler to first define the keys as variables, and then use these variables rather than the typed names in the key-value pair list.

 Example:
 ```
 speech_1 = "A10_Speech.mp3";
 texture_1 = "A14_Texture.mp3";
 bass_1 =  "A2_Bass.mp3";
 beat_1 = "F4_Beat.mp3";

 static fixedSamplesTree =
 {
     speech_1: [texture_1],
     texture_1: [bass_1, beat_1],
     bass_1: [speech_1],
     beat_1: []
 }
 ```

 ## Remaining ToDos:
 1. Have a way to fix the positions of the initial graph.
 2. Use cookies to determine whether initial fixed graph has been seen.
 3. For fixed graph, have only one node 'clickable', maybe pulse it
 4. Have a way to define, the volume/duration of each node
