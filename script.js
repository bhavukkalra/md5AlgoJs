// const { log } = require("console");





window.addEventListener("load", () => {
    console.log("loaded")

    const canvas = document.getElementById("canvasId");
    const context = canvas.getContext("2d");
    console.log("context");

        
    // Resizing

    canvas.height = screen.height/2;
    canvas.width = screen.width/2;


    // variables
    let painting = false;


    // Event Listeners
    function startPosition(event) {
        console.log("Started");
        painting = true;
        context.moveTo(event.clientX,event.clientY);
        context.beginPath();
        draw(event);
        
        
        
    }
    function endPosition(){
        console.log("Ended");
        painting = false;

        let dataURL = canvas.toDataURL();
        console.log(dataURL);


        let binaryData = atob(dataURL.split(',')[1]); // remove data:image/png;base64,

        // Convert the binary data to a Uint8Array
        let array = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            array[i] = binaryData.charCodeAt(i);
        }

        // Do something with the binary data, for example, send it to the server
        console.log(array);

        // Convert each element to String binary
        // console.log(`Array generated ${array}`);


        // TODO lateruse map here

        // let binaryStringConvertedArray = array.map((currentuInt8Number) => {
        //     // console.log(`Processing ${currentuInt8Number}`)
        //     let returnedString = uInt8ToBinaryConverter(currentuInt8Number);
        //     // console.log(`returnedString ${returnedString}`);
        //     return returnedString;

        // })
        // console.log("String below")
        // console.log(binaryStringConvertedArray)


        // console.log(`binaryStringConvertedArray ${binaryStringConvertedArray}`)
        // console.log("Array string below")
        // console.log(binaryStringConvertedArray);

        let finalStringArray = [];
        for(let i = 0; i< array.length; i++){
            let currentElement = uInt8ToBinaryConverter(array[i]);
            finalStringArray.push(currentElement)

        }

        console.log("Final string array")
        console.log(finalStringArray);

        
        generateMD5Checksum(finalStringArray);
        
        // firstNumberToBinary = uInt8ToBinaryConverter(array[0]);

        // console.log(`First number to binary ${firstNumberToBinary}`)
        
    }

    // function convertEachElementToBinaryString(uIntArrayInput){

    //     uIntArrayInput.map((currentElement) => {
    //         return 

    //     })

    // }

    // Keeps on getting triggered as long as mouse is hovering on the canvas
    function draw(event){
        console.log("Drawing")
        if(!painting) return;

        context.lineWidth = 4;
        context.lineCap = "round"
        
        context.lineTo(event.clientX, event.clientY);
        context.stroke();

        // For smoother experience
        context.beginPath();
        context.moveTo(event.clientX,event.clientY);
            
        
    }

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    // // context.strokeStyle = "red";
    // // context.strokeRect(100, 100, 100, 100);

    // context.beginPath();
    // // x(right), y(down)
    // context.moveTo(100,100);
    // context.lineTo(200, 100);
    // context.lineTo(200, 300);
    // context.closePath();

    context.stroke();

});


/*
Inputs will range in from 
0 - 255 

uInt8Number >>> 0 
[coerces the number to unSigned, if the input is a negative number]
*/





function uInt8ToBinaryConverter(uInt8Number){
    let stringRepresentation = (uInt8Number >>> 0).toString(2);

    // Pad with "0" in the beginning if len(input) < 8

    let appendBit = "";

    if(stringRepresentation.length < 8){
        let requiredBits = 8 - stringRepresentation.length;


        for(let i = 0; i < requiredBits; i++){
            appendBit += "0"
        }

    }

    let finalReturnString = appendBit + stringRepresentation;

    return finalReturnString;

}

function uInt8ToBinaryConverterSimple(decimalNumber){
    return (decimalNumber >>> 0).toString(2);

}


/*
Input  Uint8Array[]
Output md5 Checksum of the Input
*/

function getNumberOfPaddingBits(totalBits){
    // let i = 0;

    let nearestMultiple = Math.floor(totalBits/512);
    // console.log(`nearestMultiple ${nearestMultiple}`)

    let i = nearestMultiple + 1;
    // console.log(`Check condition ${512*i -  totalBits}`)
    while(512*i -  totalBits < 64){
        i++;
    }

    let requiredFinalOut = 512*i - 64;
    // console.log(`requiredFinalOut ${requiredFinalOut}`)

    let numPaddingBitsRequired = requiredFinalOut - totalBits;

    return numPaddingBitsRequired;

}

function handleBitsAppending(inputArray, noBitsToAppend){

    let baseAdditionToArray = Math.floor(noBitsToAppend/8);
    let remainingBits = noBitsToAppend % 8;
    let SingleSetBitAdded = false;

    // Add the new bits to the array
    let baseAdditionBits = "00000000";

    if(baseAdditionToArray != 0){
        let customBaseAdditionBits = "10000000";
        // Add the first element
        inputArray.push(customBaseAdditionBits);
        SingleSetBitAdded = true;
    }



    // Push the whole bits
    for(let i = 0; i < baseAdditionToArray - 1; i++){
        inputArray.push(baseAdditionBits);

    }

    // push the remaining bits
    let baseAddition = "";

    for(let i = 0; i < remainingBits; i++){
        if(i == 0 && !SingleSetBitAdded){
            baseAddition += "1";
            SingleSetBitAdded = true;

        }else{
            baseAddition += "0"

        }
        
    }

    // Push the base addition
    if(baseAddition != "") inputArray.push(baseAddition);

}


function totalBitsIntheStringArray(binaryStringArray, currentStep){

    let totalBits = 0;

    for(let i = 0; i < binaryStringArray.length; i++){
        // Detect Empty strings in the array
        if(binaryStringArray[i] == ""){
            console.log(`Empty string detected at index ${i}`)
        }
        
        let currentStringLength = binaryStringArray[i].length;

        if(currentStringLength < 8){
            
            console.log("Something went wrong");
            console.log(`${currentStep}, Current string - ${binaryStringArray[i]}`)
        }

        totalBits += currentStringLength;

    }

    // Validate the incoming bits

    if(totalBits % 8 == 0){
        console.log("No of bits validated")
    }else{
        console.log("Please exit")
    }

    return totalBits;


}


function deriveLengthBitsString(stringRepresentationOfLength){
    if(stringRepresentationOfLength.length > 64){
        console.log(`The binary representation of legth bits exceeded 64, edge case - ${stringRepresentationOfLength}`)
        console.log("Proceeding for now by assuming its <= 64")
    }

    // Usually comes out to be 64
    let totalInLengthOfTheMessage = (64 % stringRepresentationOfLength);

    if(totalInLengthOfTheMessage > 64){
        console.log(`an Edge case but ignoring ${totalInLengthOfTheMessage}`)

    }

    let lengthBitStringToAppend = stringRepresentationOfLength;
    let noZeroBitsToAppendAtStart = 64 - stringRepresentationOfLength.length;



    console.log(`noZeroBitsToAppendAtStart - ${noZeroBitsToAppendAtStart}`)

    for(let i = 0; i < noZeroBitsToAppendAtStart; i++){
        lengthBitStringToAppend = "0" + lengthBitStringToAppend;
    }

    return lengthBitStringToAppend;
}


function splitStringAtIndexes(str, indexes) {
    // console.log("input string to split")
    // console.log(str)


    var parts = [];
    var lastIndex = 0;
    
    // Iterate through the indexes
    for (var i = 0; i < indexes.length; i++) {
        // Get the current index
        var currentIndex = indexes[i];
        // Add the substring from the last index to the current index
        parts.push(str.substring(lastIndex, currentIndex));
        // Update the last index for the next iteration
        lastIndex = currentIndex;
    }
    // Add the remaining part of the string after the last index
    parts.push(str.substring(lastIndex));
    // console.log("Output array");
    // console.log(parts)
    
    return parts;
}


function checkLengthBitStepCompletion(lengthBitString, lengthBitArrayToAppend){
        // Check the length of the array == 8

        if(lengthBitArrayToAppend.length != 8){
            console.log("Length bit array incorrectly formed");
        }
    
        // Check if each element is of size 8 bits
        for(let i = 0; i < lengthBitArrayToAppend.length; i++){
            if(lengthBitArrayToAppend[0].length != 8){
                console.log("Corrupted bit in the array")
            }
        }
    
        // Check if the array generated when combined gives the original completelength  string
    
        let lengthStringGeneratedFromArray = "";
    
        for(let i = 0; i < lengthBitArrayToAppend.length; i++){
            lengthStringGeneratedFromArray += lengthBitArrayToAppend[i];
        }
    
        if(lengthStringGeneratedFromArray !== lengthBitString){
            console.log("Overall check for length bits doesn't pass, Check the splitStringAtIndexes fx")
        }else{
            console.log("Append length bit step completed successfully")
        }
}

// Before inputing to any
function binaryStringToNumber(binaryString) {
    // Using parseInt to convert binaryString to number
    return parseInt(binaryString, 2);
}




/*
Generic F, G, H, I function def's

b - 32 bit  (In JS it gets stored as 64 bit)
c - 32 bit  (In JS it gets stored as 64 bit)
d - 32 bit (In JS it gets stored as 64 bit)
*/

function inputBinaryStringToUint32ArrayConvert(b, c, d){

    numberB =  binaryStringToNumber(b);
    numberC =  binaryStringToNumber(c);
    numberD =  binaryStringToNumber(d);

    return new Uint32Array ([numberB, numberC, numberD]);

}
/*
Input UInt32BitArray[b, c, d]

Outs Logical 32 Bit out

*/

// Out 32 bit
function Fbcd(Uint32BitArrayBCD){
    return (Uint32BitArrayBCD[0] & Uint32BitArrayBCD[1]) | (~Uint32BitArrayBCD[0] & Uint32BitArrayBCD[2]);
}

// Out 32 bit
function Gbcd(Uint32BitArrayBCD){
    return (Uint32BitArrayBCD[0] & Uint32BitArrayBCD[2]) | (Uint32BitArrayBCD[1] & (~Uint32BitArrayBCD[2]))
    
}

// Out 32 bit
function Hbcd(Uint32BitArrayBCD){
    return Uint32BitArrayBCD[0] ^ Uint32BitArrayBCD[1] ^ Uint32BitArrayBCD[2];
}

// Out 32 bit

function Ibcd(Uint32BitArrayBCD){
    return Uint32BitArrayBCD[1] ^ (Uint32BitArrayBCD[0] | (~Uint32BitArrayBCD[2]))
    
}

function gen32BitConstants(){

    const _32Bit64ConstantsArray =  new Uint32Array(64); 

    for(let i = 0; i < 64; i++){
        let currentConstant = Math.floor(Math.pow(2, 32) * Math.abs(Math.sin(i + 1)));
        _32Bit64ConstantsArray[i] = currentConstant;

    }

    // console.log(_32Bit64ConstantsArray);
    // console.log(_32Bit64ConstantsArray.length);

    return _32Bit64ConstantsArray;

}


function generateMD5Checksum(uInt8StringArrayInput){
    // Get total bits
    // console.log("Number array below")
    // console.log(uInt8StringArrayInput);


    let totalBits = totalBitsIntheStringArray(uInt8StringArrayInput, "firstIncomingArray");
    console.log("Total bits processed")

    console.log(`Num total Bits ${totalBits}`);
    let numberOfPaddingBits = getNumberOfPaddingBits(totalBits);

    console.log(`numberOfPaddingBits ${numberOfPaddingBits}`);
    

    // First Step padding
    handleBitsAppending(uInt8StringArrayInput, numberOfPaddingBits);

    totalBitsIntheStringArray(uInt8StringArrayInput, "afterFirstPadding");
    
    
    
    
    
    /*
    Second Step appending length Bits (Seems to be always appening 64 bits)
    */

    // Get length of the original message
    let stringRepresentation = (totalBits >>> 0).toString(2);

    let lengthBitString = deriveLengthBitsString(stringRepresentation);

    if(lengthBitString.length != 64){
        console.log(`lengthBitString incorrectly generated`)
    }

    let lengthBitArrayToAppend = splitStringAtIndexes(lengthBitString, [8, 16, 24, 32, 40, 48, 56])

    checkLengthBitStepCompletion(lengthBitString, lengthBitArrayToAppend);

    // Append the length bit array
    let newArrayInputToMachine =   uInt8StringArrayInput.concat(lengthBitArrayToAppend);

    // Check if the final total bits after both the steps is a multiple of 512

    let noBitsAfterAboveTwoSteps =  totalBitsIntheStringArray(newArrayInputToMachine, "afterAppendingPaddingLength");

    if(noBitsAfterAboveTwoSteps % 512 == 0){
        console.log("Padding and Length Bits append steps completeded successfully")
    }else{
        console.log("Error in above two steps");
    }



    /*
        Step 3 - Initialize MD5 buffer
        32 Bit

        A - 0 1 2 3 4 5 6 7     -> 32 Bit
        B - 8 9 a b c d e f     -> 32 Bit
        C - f e d c b a 9 8     -> 32 Bit
        D - 7 6 5 4 3 2 1 0     -> 32 Bit


        64 operations (for each 512 block)a [for i from 0, 63]


         (64 operations)

        Note - It's kinda difficult to get Numbers represented in 32 bi. As standard represewntation for all 
        numbers in JS is 64 bits
        

        Hacky Way - 1
        A hacky way of achieving this could be to represent each number as a 32 bit string and Implement the logical 
        Not, Or, XOR, AND for operating on Binary strings containing 32 bits 

        Hacky Way - 2 (Implemented)
        Use Int32Array or Uint32Array to store a 32-bit integers. 
        This approach with Typed Arrays is mainly useful in scenarios where you need to interact with binary data or perform low-level operations.
        As we get Uint8Bit Integers as input, we are going to use Uint32Array to store a 32-bit integers.

        --------------------

        In each round (4) we have 
        
        Function(B or C or D) X T[1-16] X Part of plain text
        
        These 4 rounds will be for each block of 512

        Output of one block will be the initialization vector [A, B, C, D] as input to the second block

        --------------------

        b (B=B+(A+G(B,C,D)+x[k]+t[i]<<s)

    */

        mainIterativeLoop(newArrayInputToMachine);



}

/*
Usage - 

number - input number
shift - No of bits to circular shift left
numBits - numBits in the inputNumber

2's complement of a number is -ve of a number

(1 << numBits) - 1) => Simple decimal subtraction

*/

function circularLeftShift(number, shift) {
    // 4585076036, 9, 32

    let stringRepresentation = uInt8ToBinaryConverterSimple(number);
    let numBits = stringRepresentation.length;
    // console.log(`Input for circularLeftShift Received - ${number}, ${shift}, ${numBits}`)
    return ((number << shift) | (number >>> (numBits - shift))) & ((1 << numBits) - 1);
}


/*
Takes in the final vector values
and compute the hash to be outputed 

*/
function computeFinalCheckSum(initialABCDVectorValues32Bitarray){

    let vector1 = initialABCDVectorValues32Bitarray[0];
    let vector2 = initialABCDVectorValues32Bitarray[1];
    let vector3 = initialABCDVectorValues32Bitarray[2];

    let vector4 = initialABCDVectorValues32Bitarray[3];


    const hexA = vector1.toString(16);
    const hexB = vector2.toString(16);
    const hexC = vector3.toString(16);
    const hexD = vector4.toString(16);

    // console.log("hexA")
    // console.log(hexA)
    // console.log(hexB)
    // console.log(hexC)
    // console.log(hexD)





    // Append each hash values
    const finalHash = hexA + hexB + hexC + hexD;

    return finalHash;
}



function mainIterativeLoop(paddedMessageChunksOf512, totalBitsInTheArray){

    console.log("Incoming ")

    // Initial Buffer Values
    // let a0  = 0x67452301   // A (32 bit hexadecimal number)
    // let b0  = 0xefcdab89   // B (32 bit hexadecimal number)
    // let c0 = 0x98badcfe   // C (32 bit hexadecimal number)
    // let d0 =  0x10325476   // D (32 bit hexadecimal number)


    let a0  = 1   // A (32 bit hexadecimal number)
    let b0  = 2   // B (32 bit hexadecimal number)
    let c0 = 3   // C (32 bit hexadecimal number)
    let d0 =  4   // D (32 bit hexadecimal number)

    // Will be updated after each iteration of one chunk of 512 bit

    // new Uint32
    let initialABCDVectorValues32Bitarray = new Uint32Array([a0, b0, c0, d0]);

    // Per round shift amounts (16*4)
    const perRoundShifts = [7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,  7, 12, 17, 22,
                            5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,  5,  9, 14, 20,
                            4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,  4, 11, 16, 23,
                            6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21,  6, 10, 15, 21]


    // Segregate each 512bit chunk (Single string array containing strings of lenght 512bits)
    // console.log("Received paddedMessageChunksOf512")
    // console.log(paddedMessageChunksOf512);

    let lengthArray = paddedMessageChunksOf512.length;
    // let noOfChunksOf512 = totalBitsInTheArray % 512;

    let currentStringToAppend = "";
    let finalChunkSArray = []

    for(let i = 0; i< lengthArray; i++){
        
        

        currentStringToAppend += paddedMessageChunksOf512[i];

        // At each chunk of 512 refresh do this
        if((i + 1) % 64 == 0){
            
            if(currentStringToAppend.length != 512){
                console.log(`Current string length - ${currentStringToAppend.length}`)

                console.log("Something wrong happened while making 512 chunks");
            }

            finalChunkSArray.push(currentStringToAppend);
            currentStringToAppend = "";
        }

    }

    // console.log("Input to the main algo prepared");
    // console.log(finalChunkSArray)


    for(let i = 0; i < finalChunkSArray.length; i++){
        if(finalChunkSArray[i].length != 512){
            console.log("Corrupted input went into the the algo")
        }
    }

    // Run loop for each chunk of 512

    for(let chunksIterator = 0; chunksIterator < finalChunkSArray.length; chunksIterator++){
        let current512BitChunkPT = finalChunkSArray[chunksIterator];

        if(current512BitChunkPT.length != 512){
            console.log("Current input is not ok, Please fix this")
        }

        // Break each 512 chunk into 16 blocks of 32 bits call it PT[j] (Part of plain text)
        let  pt16BlocksOf32Bits =  splitStringAtIndexes(current512BitChunkPT, [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480]);

        // console.log("pt16BlocksOf32Bits")
        // console.log(pt16BlocksOf32Bits)


        for(let i = 0; i < pt16BlocksOf32Bits.length; i++){
            if(pt16BlocksOf32Bits[i].length != 32){
                console.log("couldn't convert the 512 block to part of plain text")
            }
        }

        // Initialize hash value for this chunk: (CHAINING VARIABLES)
        let A = initialABCDVectorValues32Bitarray[0];
        let B = initialABCDVectorValues32Bitarray[1];
        let C = initialABCDVectorValues32Bitarray[2];
        let D = initialABCDVectorValues32Bitarray[3];

        // console.log(`Initial A - ${A}`)
        // console.log(`Initial B - ${B}`)
        // console.log(`Initial C - ${C}`)
        // console.log(`Initial D - ${D}`)

        // console.log("initialABCDVectorValues32Bitarray[0];")
        // console.log(initialABCDVectorValues32Bitarray[0])

        // get 32 bit constants for the upcoming 64 operarions
        const _32Bit64Constants = gen32BitConstants();

        // Convert A,B,C,D into 32 bit JS representation
        const bit32ArrayRepresentationOfBCD = inputBinaryStringToUint32ArrayConvert(B, C, D);

        // 64 operations for each chunk
        for(let i = 0; i < 64; i++){
            /*
            currentTempHash and selectHashPortion temporary values for storing the hash value for the current interation

            currentTempHash :- Storing temporary hash values
            selectHashPortion :- determines which 32 bit word to use from message chunk pt16BlocksOf32Bits array
            */

            let currentTempHash,selectHashPortion;
            
            if(0 <= i && i <= 15){
                currentTempHash = Fbcd(bit32ArrayRepresentationOfBCD[0], bit32ArrayRepresentationOfBCD[1], bit32ArrayRepresentationOfBCD[2]);
                selectHashPortion = i;
                // console.log(`Assigning selectHashPortion 1 - ${selectHashPortion}`)

            }else if(16 <= i && i<= 31){
                currentTempHash=  Gbcd(bit32ArrayRepresentationOfBCD[0], bit32ArrayRepresentationOfBCD[1], bit32ArrayRepresentationOfBCD[2]);
                selectHashPortion = (5*i + 1) % 16; 
                // console.log(`Assigning selectHashPortion 2- ${selectHashPortion}`)


            }else if(32 <= i && i<= 47){

                currentTempHash=  Hbcd(bit32ArrayRepresentationOfBCD[0], bit32ArrayRepresentationOfBCD[1], bit32ArrayRepresentationOfBCD[2]);
                selectHashPortion = (3*i + 5) % 16; 
                // console.log(`Assigning selectHashPortion 3- ${selectHashPortion}`)

            }else if(48 <= i && i<= 63){

                currentTempHash=  Ibcd(bit32ArrayRepresentationOfBCD[0], bit32ArrayRepresentationOfBCD[1], bit32ArrayRepresentationOfBCD[2]);
                selectHashPortion = (7*i) % 16;
                // console.log(`Assigning selectHashPortion 4 - ${selectHashPortion}`)

            }
            
            // console.log("currentTempHash");
            // console.log(currentTempHash);
            // console.log("A");
            // console.log(A);
            // console.log("_32Bit64Constants")
            // console.log(_32Bit64Constants)
            // console.log("pt16BlocksOf32Bits")
            // console.log(pt16BlocksOf32Bits)

            // console.log(`i - ${i}`)


            /*
            BUG - 
            pt16BlocksOf32Bits[i] => Convert to number while using
            Also, Sometimes coming as undefined i is not in range maybe

            */

            // console.log(`selectHashPortion - ${selectHashPortion}`)
            // console.log(`pt16BlocksOf32Bits[selectHashPortion] - ${pt16BlocksOf32Bits[selectHashPortion]}`)

            let selectionHashPortion = binaryStringToNumber(pt16BlocksOf32Bits[selectHashPortion]);
            
            let tempHash = A + _32Bit64Constants[i] + selectionHashPortion;
            // console.log(`tempHash Computation result - ${_32Bit64Constants[i]}, ${selectionHashPortion}`)
            currentTempHash = currentTempHash + tempHash //1073741823 

            // Update the chaining variables for next iteration
            A = D;
            D = C;
            C = B;
            let tempB = circularLeftShift(currentTempHash, perRoundShifts[i]);
            // console.log(`Temp B - ${tempB}`)
            B = B + tempB;

        }

        // Update A,B,C,D vectors for next chunk of 512 bits

        // console.log("A")
        // console.log(A)
        
        // console.log(`BEfore initialABCDVectorValues32Bitarray[0] - ${initialABCDVectorValues32Bitarray[0]}`)
        // console.log(`BEfore A - ${A}`)
        initialABCDVectorValues32Bitarray[0] += A;
        initialABCDVectorValues32Bitarray[1] += B;
        initialABCDVectorValues32Bitarray[2] += C;
        initialABCDVectorValues32Bitarray[3] += D;

        // console.log(`After initialABCDVectorValues32Bitarray[0] - ${initialABCDVectorValues32Bitarray[0]}`)
        // console.log(`BEfore A - ${A}`)

    }

    //Output final checksum
    const finalChecksumOut = computeFinalCheckSum(initialABCDVectorValues32Bitarray);
    console.log("finalChecksumOut")
    console.log(finalChecksumOut)
}
