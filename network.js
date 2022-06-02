class NeuralNetwork {
    //neuronCount = Array of the number of neruons per layer
    constructor(neuronCount) {
        this.levels = []; //The levels of the neural network
        for (var i = 0; i < neuronCount.length - 1; i++) {
            //For each neuronCount, we are making levels between them.
            this.levels.push(
                new Level(neuronCount[i], neuronCount[i + 1])
            );
        }
    }

    static feedForward(givenInputs, network) {
        //First level to produce its output
        //output is the second layer (hidden layer)
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        for (let i = 0; i < network.levels.length; i++) {
            //Calling feedForward using the previous outputs as inputs
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }

}


class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        //Each ouptup have a bias.
        //Biases are those values above which the output will fire
        this.biases = new Array(outputCount);

        //Connections will be connected to all the inputs and outputs.
        //But these connections will have weights.
        //Weight of zero means "not connected"
        this.weights = [];
        for (var i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    //Randomizing every weight (which is connected like a matrix)
    //and bias (which is related to every output)
    // to be a random number between -1 and 1.
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (var j = 0; j < level.outputs.length; j++) {
                //This will give number between -1 and 1.
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }
        for (let i = 0; i < level.outputs.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    //FeedForward Algorithm
    static feedForward(givenInputs, level) {
        //Whatever is coming from the given inputs (i.e sensor readings)
        //We are putting it in level inputs
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            //Calculate sum by using value of the input and the weights
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }
            //We will turn it on if it is more than bias value
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            }
            else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}