/**
 * The class contains the basic TodoList working 
 */
class TodoList {
    
    #tasks;
    #completed;
    constructor(){
        
        this.#tasks=[];
        this.#completed=[];
    }
    /**
     * adds task to the list of tasks 
     */
    addTask=(task)=>{
            this.#tasks.push(task)
            return this.#tasks.length
    }
    /**
     * get all tasks
     */
    getTasks=()=>{
        this.#tasks;
    }
    /**
     * get completed tasks
     */
    getCompleted=()=>{
        this.#completed;
    }
    /**
     * remove a item from arr
     */
    #remove=(index,arr)=>{
       
        if(index>=0&&index<arr.length)
            arr.splice(index,1);
        console.log("deleted",arr)
    }
    /**
     * remove item from completed array
     */
    removeCompleted=(index)=>{
        this.#remove(index,this.#completed)
    }
    /**
     * remove form main task
     */
    removeTasks=(index)=>{
        console.log("Removing tasks")
        this.#remove(index,this.#tasks)
    }

    /**
     * push task from task to completed and remove the same form tasks
     */
    setStatus=(status,index)=>{
        console.log("status",status,index)
        if(status=="Completed"&&index>=0&&index<this.#tasks.length){
                this.#completed.push(this.#tasks[index]);
                this.#tasks.splice(index,1);
        }
        return 

    }

}

/**
 * TodoViewController controlls the view part and extends the todoList manager
 * 
 */
class TodoViewController extends TodoList{
    /**
     * setup
     * main task List and completedLists
     * setup view components to handlers
     * setup event handlers for delting and changing status
     */
    constructor(){
        super();
        this.Tasks=[]
        this.completed=[]
        this.rootElement=document.getElementById("TodoList")
        this.input=document.getElementById('TodoInput')
        this.AddInput=document.getElementById('AddTodo')
        this.completeTasksElement=document.getElementById('CompleteAllTasks')
        this.clearCompleted=document.getElementById('clearTasks')
        this.All=document.getElementById('All')
        this.Uncompleted=document.getElementById('Uncompleted')
        this.completedFilter=document.getElementById('completed')
        this.AddInput.addEventListener('click',(event)=>{
            let content=this.input.value
            this.input.value="";
            this.addTodo(content)
        })
        this.completeTasksElement.addEventListener("click",this.completeAllTasks)
        this.clearCompleted.addEventListener("click",this.clearCompletedTasks)
        this.All.addEventListener('click',this.filterAll)
        this.completedFilter.addEventListener('click',this.filterCompleted)
        this.Uncompleted.addEventListener('click',this.filterUncompleted)
        this.selected="All"
    }
    /**
     * updates index of items
     */
    updateIndex(arr){
        for(let i=0;i<arr.length;i++)
            arr[i].setIndex(i);
    }
    /**
     * delete from the respective list of tasks
     */
    handleDelete=(index,status)=>{
        console.log("deleting",index,status)
        if(index<0||index>=this.Tasks.length)
            return ;
        if(status=="Completed")
            {
                this.removeCompleted(index)
                this.completed.splice(index,1)
                this.updateIndex(this.completed)
                if(this.selected!="Completed")
                    this.setTaskCount(this.Tasks.length+" task left")
            }
        else
            {
                this.removeTasks(index)
                this.Tasks.splice(index,1);
                this.updateIndex(this.Tasks)
                if(this.selected=="Completed")
                    this.setTaskCount(this.completed.length+" task completed")
            }
            
        
        
    }
    /**
     * add a new task
     */
    addTodo=(todo)=>{
            if(todo=='')
                return;
            let index=this.addTask(todo);
            let item=new todoItem(index-1,"toComplete",this.handleDelete,this.status,todo);
            this.Tasks.push(item)
            if(this.selected!="Completed")
                {
                    this.rootElement.insertBefore(item.Element,this.rootElement.children[0])
                    this.setTaskCount(this.Tasks.length+" tasks left")
                }
            console.log(item);
    }
    /**
     * change status of a task from toComplete to completed
     */
    status=(status,index,Element)=>{
        console.log("setting status")
        this.setStatus(status,index);
        Element.remove();
        Element.classList.add("Completed");
        this.rootElement.appendChild(Element)
        let item=this.Tasks[index]
        this.Tasks.splice(index,1);
        console.log(item)
        this.updateIndex(this.Tasks)
        this.completed.push(item)
        item.setIndex(this.completed.length-1);
        this.setTaskCount(this.Tasks.length+" task left")
    }

    /**
     * mark all tasks completed
     */
    completeAllTasks=()=>{
        console.log("completing tasks")
        while(this.Tasks.length){
            this.Tasks[0].completedStatus();
        }
        this.setTaskCount("0 tasks left")
    }
    /**
     * delete all completed tasks
     */
    clearCompletedTasks=()=>{
        while(this.completed.length)
            this.completed[0].handleDelete();
        this.completed=[]
        
    }

    /**
     * render the list 
     */
    renderList=(list)=>{
        if(list.length==0||!list)
            return
        for(let node of list){
            this.rootElement.appendChild(node.Element);
        }
    }
    /**
     * clear List view
     */
    clearView=()=>{
        while(this.rootElement.children.length)
            this.rootElement.children[0].remove()
        this.setTaskCount(0)
    }
    /**
     * filter only completed
     */
    filterCompleted=()=>{
        this.clearView()
        this.renderList(this.completed)
        this.Uncompleted.classList.remove('selected')
        this.completedFilter.classList.add('selected')
        this.All.classList.remove('selected')
        this.selected="Completed"
        this.setTaskCount(this.completed.length+"task completed")
    }
    /**
     * filter view state to uncompleted
     */
    filterUncompleted=()=>{
        this.clearView()
        this.renderList(this.Tasks)
        this.Uncompleted.classList.add('selected')
        this.completedFilter.classList.remove('selected')
        this.All.classList.remove('selected')
        this.selected="Uncompleted"
        this.setTaskCount(this.Tasks.length+"task left")
    }
    /**
     * no filter
     */
    filterAll=()=>{
        this.clearView()
        this.renderList(this.Tasks)
        this.renderList(this.completed)
        this.Uncompleted.classList.remove('selected')
        this.completedFilter.classList.remove('selected')
        this.All.classList.add('selected')
        this.selected="All"
        this.setTaskCount(this.Tasks.length+"task left")
    }
    /**
     * update the task count
     */
    setTaskCount=(len)=>{
        let element=document.getElementById('taskCount')
        element.textContent=len
        
    }
}

/**
 * view component of a single task
 */
class todoItem{
    #status;
    #index;
    /**
     * setup class names and image src
     */
    #classNames={
        item:"todo_item",
        left:"todo_left",
        mark_complete:"complete",
        content:"todo_content",
        delete:"delete",
        completedImg:"https://image.flaticon.com/icons/svg/61/61221.svg",
        completedStatus:"https://image.flaticon.com/icons/svg/982/982624.svg"
    }
    /**
     * setup delete handler with the list delete
     * setup status change of items
     * 
     */
    constructor(index,status="toComplete",handleDelete,setStatus,content){
        this.#index=index;
        this.#status=status;
        this.handleDelete=()=>{
            console.log("handling delete")
            this.Element.remove();
            handleDelete(this.#index,this.#status);
        };
        
        this.setStatus=(status)=>{
                console.log("settingStatus")
                this.#status=status
                setStatus(status,this.#index,this.Element);
                let complete=this.Element.getElementsByClassName("complete")[0].children[0]
                complete.src=this.#classNames.completedStatus
                complete.removeEventListener("click",this.completedStatus)
        }
        this.completedStatus=this.setStatus.bind(this,"Completed");//bind context
        this.Element=this.createElement(content);
    }
    /**
     * set current index with respective to list
     */
    setIndex=(index)=>{
        if(index<0)
            return;
        this.#index=index;
    }
    getIndex=()=>this.#index;
    /**
     * create the dom element for the task and map respective classes
     */
    createElement=(contentString)=>{
        let item=document.createElement('div');
        let leftChild=document.createElement('div');
        let completedAction=document.createElement('div');
        let CompletedImg=document.createElement('img');
        let content=document.createElement('div');
        let deleteAction=document.createElement('div');
        CompletedImg.src=this.#classNames.completedImg
        CompletedImg.alt="mark_complete"
        item.classList.add(this.#classNames.item);
        leftChild.classList.add(this.#classNames.left);
        completedAction.classList.add(this.#classNames.mark_complete);
        content.classList.add(this.#classNames.content);
        deleteAction.classList.add(this.#classNames.delete);
        content.appendChild(document.createTextNode(contentString))
        completedAction.appendChild(CompletedImg)
        leftChild.appendChild(completedAction)
        leftChild.appendChild(content)
        item.appendChild(leftChild)
        item.appendChild(deleteAction)
        deleteAction.appendChild(document.createTextNode("X"))
        CompletedImg.addEventListener("click",this.completedStatus)
        deleteAction.addEventListener("click",this.handleDelete)
        return item;
    }
    get status(){
        return this.#status;
    }
    
}
let todo=new TodoViewController()