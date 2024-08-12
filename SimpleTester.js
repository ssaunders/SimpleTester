function Tester() {
    this.runTests = function(tests, scope, testFn, title) {
        console.group(title);

        var testVal, checkVal;
        for(var num = 0; num < tests.length; ++num) {
            if(tests[num].message) {
                console.log(tests[num].message);
            } else {
                testVal = testFn.apply(scope, tests[num].arguments);
                checkVal = tests[num].expectedVal;
                this.assert(testVal, checkVal,tests[num].description);
            }
        }

        console.groupEnd();
    };

    this.assert = function (testVal, checkVal, description) {
        var result, css;
        if(description === undefined) {
            description = "Test";
        }
        if(this.isEqual(testVal, checkVal)) {
            result = "%cPASSED";
            css = 'color:green';
        } else {
            result = "%cFAILED";
            css = 'color:red';
        }
        console.log(result,css,":",description,"- Target: ",checkVal," Actual:",testVal);
    };

    this.groupBegin = function(title) {
        console.group(title);
    };
    this.groupEnd = function() {
        console.groupEnd();
    };

    // Does not do multi-dim arrays
    // Not sure how it will handle Symbols
    this.isEqual = function(one, two) {
        var oneType = typeof(one),
            twoType = typeof(two);

        if(oneType != twoType) return false;
        
        if(one === two) return true;

        // We already confirmed the types are the same, and that they are not equal.
        // So if it's a primitive type, that's sufficient for it to not be equal.
        if(oneType === "string" || oneType === "number" || oneType === "boolean" || oneType === "bigint") return false;

        if(one instanceof Array && two instanceof Array) {
            var i = one.length;     //stackoverflow, Tim Down
            if (i !== two.length) return false;
            while (i--) {
                if (one[i] !== two[i]) return false;
            }
            return true;
        } else if (one instanceof Object && two instanceof Object) {
            // From  Jean Vincent
            // http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
            if ( one.constructor !== two.constructor ) return false;
            // they must have the exact same prototype chain, the closest we can do is
            // test there constructor.

            for ( var p in one ) {
                if ( ! one.hasOwnProperty( p ) ) continue;
                  // other properties were tested using one.constructor === two.constructor

                if ( ! two.hasOwnProperty( p ) ) return false;
                  // allows to compare one[ p ] and two[ p ] when set to undefined

                if ( one[ p ] === two[ p ] ) continue;
                  // if they have the same strict value or identity then they are equal

                if ( typeof( one[ p ] ) !== "object" ) return false;
                  // Numbers, Strings, Functions, Booleans must be strictly equal

                if ( ! Object.equals( one[ p ],  two[ p ] ) ) return false;
                  // Objects and Arrays must be tested recursively
            }

            for ( p in two ) {
                if ( two.hasOwnProperty( p ) && ! one.hasOwnProperty( p ) ) return false;
                  // allows one[ p ] to be set to undefined
            }
            return true;
        } else {
            console.warn("I don't know how to compare ",one," and ",two);
        }
    };
    /* The code below takes a constructor and exposes its private functions
       Useful for unit testing (not general use). An example usage is below it. 
       Access to the private functions available through the _privMems property. */
    /* http://www.htmlgoodies.com/beyond/javascript/accessing-private-functions-in-javascript.html */
    this.createExposedInstance = function(objectConstructor, args)
    {
        // get the functions as a string
        var objectAsString    = objectConstructor.toString();
        var aPrivateFunctions = objectAsString.match(/function\s*?(\w.*?)\(/g);

        // To expose the private functions, we create a new function that goes through 
        // the functions string we could have done all string parsing in this class 
        // and only associate the functions directly with string manipulation here and 
        // not inside the new class, but then we would have to expose the functions as 
        // string in the code, which could lead to problems in the eval since string 
        // might have semicolons, line breaks etc.
        // WORKS WITH PROTOYPES AND ARGUMENTS
        var instance = Object.create(objectConstructor.prototype);
        var otherstring = objectAsString.substring(0, objectAsString.length - 1)
                 + ";"
                 + "this.prototype=Object.create(objectConstructor.prototype);\n"
                 + "this._privMems = {};\n"
                 + "this._initPrivates = function(pf) {"
                 + "  this._privMems = {};"
                 + "  for (var i = 0, ii = pf.length; i < ii; i++)"
                 + "  {"
                 + "    var fn = pf[i].replace(/(function\\s+)/, '').replace('(', '');"
                 + "    try { "
                 + "      this._privMems[fn] = eval(fn);"
                 + "    } catch (e) {"
                 + "      if (e.name == 'ReferenceError') { continue; }"
                 + "      else { throw e; }"
                 + "    }"
                 + "  }"
                 + "}"
                 + "\n\n}";
        eval("var OtherClass = "+otherstring);
        OtherClass.apply(instance, args);
        instance._initPrivates(aPrivateFunctions);

        // delete the initiation functions
        delete instance._initPrivates;

        return instance;
    };

    return this;
}
