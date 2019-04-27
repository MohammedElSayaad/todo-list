function setupEvents() {
  $('.modal').modal();
  function todoStorage() {
    let tasks = [{taskText: 'hello world!', isDone: false}];

    let getAllTasksFromLocalStorage = function () {
      let data = localStorage.getItem('todoList');
      if(data !== null) {
        tasks = JSON.parse(data);
        tasks = tasks
      }
    }

    let updateTasksInLocalStorage = function () {
      let tasksList = [];

      tasks.forEach(function (item) {
        if(item !== null) {
          tasksList.push(item);
        }
      });

      localStorage.setItem('todoList', JSON.stringify(tasksList))
    }

    let addTaskToLocalSorage = function (task) {
      getAllTasksFromLocalStorage();

      tasks.push({taskText: task, isDone: false});

      updateTasksInLocalStorage()
    }
    
    let RemoveTaskFromLocalSorage = function (task) {
      let taskToRemove = '';

      for (let i = 0; i < task.length -10; i++) {
        taskToRemove += task[i];
      }
      tasks.forEach(function (item, index) {
        if(item.taskText === taskToRemove) {
          delete tasks[index];
        }
      });
      
      updateTasksInLocalStorage()
    }
    
    let clearAllTasksInLocalSorage = function () {
      tasks = [];

      updateTasksInLocalStorage()
    }

    this.getAll = function () {
      getAllTasksFromLocalStorage();

      return tasks;
    }

    this.addTask = function (task) {
      addTaskToLocalSorage(task)
    }

    this.removeTask = function (task) {
      RemoveTaskFromLocalSorage(task)
    }

    this.clear =function () {
      clearAllTasksInLocalSorage()
    }
  }

  function todo(addTaskForm, taskInput, tasksList, filterInput, clearBtn) {
    let addForm = document.querySelector(addTaskForm),
        addTaskInput = document.querySelector(taskInput),
        tasks = document.querySelector(tasksList),
        filter = document.querySelector(filterInput),
        clearButton = document.querySelector(clearBtn),
        storage = new todoStorage();

    let renderTasksList = function () {
      let allTasks = storage.getAll();

      allTasks.forEach(function (item) {
        let li = document.createElement('li'),
            edit = document.createElement('a');
            remove = document.createElement('a');

        li.classList.add('collection-item');
        edit.classList.add('secondary-content');
        remove.classList.add('secondary-content');

        edit.addEventListener('click', function (e) {
          editTask(e);
          removeTask(e)
        })

        remove.addEventListener('click', function (e) {
          removeTask(e)
        })

        li.textContent = item.taskText;
        edit.innerHTML = '<i class="material-icons">edit</i>';
        remove.innerHTML = '<i class="material-icons">delete</i>';

        li.appendChild(edit);
        li.appendChild(remove);
        tasks.appendChild(li);
      });
    }

    let addTask = function () {
      addForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let newTask = addTaskInput.value;

        if(!newTask) {
          return alert('type task to add')
        }

        let li = document.createElement('li'),
            edit = document.createElement('a');
            remove = document.createElement('a');

        li.classList.add('collection-item');
        edit.classList.add('secondary-content');
        remove.classList.add('secondary-content');

        edit.addEventListener('click', function (e) {
          editTask(e);
          removeTask(e)
        })

        remove.addEventListener('click', function (e) {
          removeTask(e)
        })

        li.textContent = newTask;
        edit.innerHTML = '<i class="material-icons">edit</i>';
        remove.innerHTML = '<i class="material-icons">delete</i>';

        li.appendChild(edit);
        li.appendChild(remove);
        tasks.appendChild(li);

        storage.addTask(newTask);

        addTaskInput.value = '';
      })
    }

    let editTask = function (e) {
      let text = e.target.parentElement.parentElement.innerText;
      let newText = '';
      for (let i = 0; i < text.length -10; i++) {
        newText += text[i];
      }

      addTaskInput.value = newText;
    }

    let filterTasks = function () {
      let tasks = tasksList + ' li';
      filter.addEventListener('keyup', function (e) {
        let text = e.target.value.toLowerCase();
        
        document.querySelectorAll(tasks).forEach(function (el) {
          let task = el.textContent.toLowerCase();

          if(task.indexOf(text) > -1 && text !== '') {
            el.style.display = 'block'
          } else {
            el.style.display = 'none'
          }
        })
      })
    }

    let removeTask = function (e) {
      let task = e.target.parentElement.parentElement;

      storage.removeTask(task.textContent);

      task.parentElement.removeChild(task)
    }

    let clearTasks = function () {
      while(tasks.firstChild) {
        tasks.removeChild(tasks.firstChild)
      }

      storage.clear()
    }

    this.initAddForm = function () {
      renderTasksList();

      addTask();
      filterTasks();

      clearButton.addEventListener('click', function () {
        clearTasks();
      })
    }
  }
  todoApp = new todo('#task-form', '#task', '.collection', '#filter', '.clear-tasks');
  todoApp.initAddForm()
}

window.onload = setupEvents();