1. npm init to create the package.json for our projects so that all possible information regarding the app can be stored and can be re installed whenever required just by "npm i" command;

2. in require the first element exported is taken out by its . name syntax

3. classes have their own constructors but see if a function is called with new keyword it by defaults creates a class with the name that is same to its name and also it will have access to its own environment.

4. calling a function behaves like a constructor of a dummy class with the same name.

5. {passs, ...info} = us

6. response must be sent in each api call othrwise it will stuck

7. closures concepts as taught in COL226
   // Online Javascript Editor for free
   // Write, Edit and Run your Javascript code using JS Online Compiler

function hello(){
let val = "hello closures"

    return function clos(){
        val = val +1;
        console.log(val)
    }

}

Mkclos(x ,opcodes,[env])
valx -> stack.push(valx)

App(Abs,val);

function1 -> env [(x,val),(y,val)]

clos(x, opcodelist,[(x,newval),(x,val),(y,val)]::[calling env]::global_env)

arg -> stack.top , fn is stack.pop().top()

Abs(x,)
function1 {
valx;
valy;
function(x){
x,
y,
}
}

let fn = hello();
let fn2 = hello();
fn()
fn2()
