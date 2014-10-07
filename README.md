SimpleTester
============

A very simple object with ability to assert, test for equality, and create an exposed instance of a JS class.

*EXAMPLE USAGE*
var tests = [{
    description: "(1,0) test with size 100,100 at 0,0",
    arguments: [{
        textPosition: "0,0",
        dimensions: {
            x: 0,
            y: 0,
            width: 100,
            height:100,
        }
    }, 1, 0],
    expectedVal: [100,0]
},{
    description: "(.4,.5) test with size 100,100 at 0,0",
    arguments: [{
        dimensions: {
            x: 0,
            y: 0,
            width: 100,
            height:100,
        }
    }, 0.4, 0.5],
    expectedVal: [0,50]
},{
    description: "(1,1) test with size 100,100 at 0,0",
    arguments: [{
        dimensions: {
            x: 100,
            y: 100,
            width: 100,
            height:100,
        }
    }, 1, 1],
    expectedVal: [200,200]
}];

tester.test(tests, );

*EXAMPLE FOR createExposedInstance*
var Person = function() {
    //defaults
    var _age  =  0,
        _name = 'John Doe';
     
    var socialSecurity = '444 555 666';
    var bloodType      = 'O negative'
    //this is a global variable
    hatSize            = 'medium';
    var noValue;
     
    var aTest = function() {
      var nestedVar = 'nestedVar';
      var nestedFunction = function() {
        return 'nestedFunction';
      };
       
      alert('aTest');
    },
      anotherTest = function() {
        alert('anotherTest');
    };
     
    function test1() {
      alert('test1');
      var obj = {
        test3: 'test3',
      bla:   234
      };
       
      function nestedFc() {
        alert('I am nested!');
      }
    }
     
    function test2() {
      alert('test2');
    }
     
    function test3() {
      alert('test3');
      
      return {
        test3: 'test3',
        bla:   234
      };
    }
     
    this.initialize = function(name, age) {
      _name = _name || name;
      _age  = _age  || age;
    };
     
    if (arguments.length) this.initialize();
     
    //public properties. no accessors required
    this.phoneNumber = '555-224-5555';
    this.address     = '22 Acacia ave. London, England';
     
    //getters and setters
    this.getName     = function()      { return _name; };
    this.setName     = function (name) { _name = name; };
     
    //private functions
    function aFunction( arg1 ) {
      alert('I am a private function (ha!)');
    }
     
    //public methods
    this.addBirthday = function()      { _age++; };
    this.toString    = function()      { return 'My name is "+_name+" and I am "_age+" years old.'; };
};
 
//create an instance of a person
var rob = Reflection.createExposedInstance(Person); //new Person('Rob', 29); //still 29! (I wish!)
 
//document.write
rob._privMems['aFunction']();  //alerts "I am a private function (ha!)"
