var keys=document.getElementsByClassName('events');
var stack=[],rear=-1;
var textArea=document.getElementById('disp')
textArea.readOnly=true;
var isFloat=false;
var keysColor=document.getElementById('keysColor')
var colorPicker=document.getElementById('myColor')
var opfunc=[];
opfunc['+']=add
opfunc['-']=sub
opfunc['*']=mul
opfunc['/']=div
opfunc['%']=percent
function add(a,b){
    return a+b;
}
function sub(a,b){
    return a-b;
}
function mul(a,b){
    return a*b;
}
function div(a,b){
    if(b==0)
        {
            alert("divide by 0 is prohibited")
            return -1;
        }
    return a/b;
}
function percent(a,b){
    var ans=div(a,b)
    if(ans!=-1){
        ans*=100
    }
    return ans;
}
function evaluate(){
    var b=parseFloat(stack[rear--]),opcode=stack[rear--],a=parseFloat(stack[rear--]);
    console.log(a,b)
    stack[++rear]=(opfunc[opcode](a,b).toFixed(5)).toString();
    return;
}
function calculate(value){
    if(value=='x')
        value='*';
    if(value=='Enter')
        value='='
    console.log(value)
    console.log(value=='negate')
    if(isOP(value)){
        if(value=='Delete'||value=='clear')
            {   if(value=='clear')
                    rear=-1;
                textArea.readOnly=false;
                textArea.value="";
                textArea.readOnly=true;
            }
        else if(value=='Backspace')
        {
                textArea.readOnly=false;
                textArea.value=textArea.value.substring(0,textArea.value.length-1);
                textArea.readOnly=true;
        }
        else if(value=='negate'){
                if(textArea.value=="")
                    return;
                textArea.readOnly=false;
                textArea.value=parseFloat(textArea.value)*-1    ;
                textArea.readOnly=true;
        }
       else if(rear==-1||!isOP(textArea.value))
            {   if(textArea.value!="")
                    stack[++rear]=textArea.value;
                else
                    stack[++rear]="0";
                if(rear==2){
                    evaluate()
                }
                if(value=='=')
                    value=stack[rear--];    
                textArea.readOnly=false;
                textArea.value=value;
                textArea.readOnly=true;
                isFloat=false;
            }
        return;
    }  
    else{
        textArea.readOnly=false;
        if(isOP(textArea.value))
            {   stack[++rear]=textArea.value;
                textArea.value="";
            }
        if(value=='.')
            {
                if(isFloat)
                    {   textArea.readOnly=true;
                        return;
                    }
                isFloat=true;
            }
        textArea.value+=value;
        textArea.readOnly=true;      
       
      
    }
    
}
function keysClick(event){
    console.log(event)
    var val=event.toElement.innerText;
    if(val=='AC')
        val='Delete'
    if(val=='C')
        val='Backspace'
    if(val=='+/-')
        val='negate'
calculate(val)
}
function openColorPicker(event){
    colorPicker.focus()
    colorPicker.click()
    
}
function changeButtonColor(event){
    console.log('changing')
    for(var i=0;i<keys.length;i++)
        keys[i].style.backgroundColor=event.target.value;
}
for(var i=0;i<keys.length;i++)
    keys[i].addEventListener('click',keysClick)
var op=['+','-','/','*','=','Enter','%','Delete','Backspace','negate','clear']
function isOP(key){
    for(var i =0;i<op.length;i++)
        if(op[i]==key)
        return true;
    return false;   
}
textArea.addEventListener('keydown',function(event){
    
    console.log(event.key)

    if((event.key>='0'&&event.key<='9')||event.key=='.'||isOP(event.key))
       {    
            calculate(event.key)
       }
});
keysColor.addEventListener('click',openColorPicker)
colorPicker.addEventListener('change',changeButtonColor)