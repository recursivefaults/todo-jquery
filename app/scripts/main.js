'use strict';

class Todo {
  constructor(title) {
    this.title = title;
    this.complete = false;
  }

  toggleCompletion() {
    this.complete = !this.complete;
  }
}

class TodoList {
  constructor() {
    this.list = [];
  }
  addTodo(todo) {
    this.list.unshift(todo);
  }
  removeTodo(todo) {
    var index = this.todoIndex(todo);
    if(index === -1) {
      return;
    }
    this.list.splice(index, 1);
  }
  prioritize(todo) {
    var index = this.todoIndex(todo);
    if(index === -1 || index === 0) {
      return;
    }
    var previous = this.list[index-1];
    this.list[index-1] = todo;
    this.list[index] = previous;
  }

  deprioritize(todo) {
    var index = this.todoIndex(todo);
    if(index === -1 || index === this.list.length - 1) {
      return;
    }
    var previous = this.list[index+1];
    this.list[index+1] = todo;
    this.list[index] = previous;
  }

  serialize() {
    return this.list;
  }

  todoIndex(todo) {
    return this.list.indexOf(todo);
  }


}
$(document).ready(function() {
  var incompleteTodos = new TodoList();
  var completeTodos = new TodoList();

  var template = '<li class="todo-item"></li>'
  var prioritizeButton = '<button></button>';

  var addButtons = function(selector) {
    var lis = selector.find('ul li.todo-item');
    if(!item.complete) {
      lis.append($('<button />').addClass('prioritize btn').text('Shittier'));
      lis.append($('<button />').addClass('deprioritize btn').text('Less Shitty'));
    }
    lis.append($('<button />').addClass('toggle btn').text('DONE'));
  };

  var updateSection = function(baseSelector, todoList) {
    var selector = baseSelector.find('div');
    selector.empty();
    selector.append('<ul></ul>');
    console.log(todoList.serialize());
    todoList.serialize().forEach(function(item, index) {
      selector.find('ul').append($('<li class="todo-item" />').data('todo', item).text(item.title));
    });
    addButtons(selector);
  };


  $('#addTodo').click(function(event) {
    var todo = new Todo($(':input#newTodoInput').val());
    incompleteTodos.addTodo(todo);
    updateSection($('div.todo'), incompleteTodos);
    return false;
  });

  $('body').on('click','button.prioritize', function(event) {
    var todo = $(this).parent().data('todo');
    if(incompleteTodos.todoIndex(todo) !== -1) {
      incompleteTodos.prioritize(todo);
      updateSection($('div.todo'), incompleteTodos);
    }

  });

  $('body').on('click','button.deprioritize', function(event) {
    var todo = $(this).parent().data('todo');
    if(incompleteTodos.todoIndex(todo) !== -1) {
      incompleteTodos.deprioritize(todo);
      updateSection($('div.todo'), incompleteTodos);
    }
  });

  $('body').on('click','button.toggle', function(event) {
    var todo = $(this).parent().data('todo');
    todo.toggleCompletion();
    if(todo.complete === true) {
      incompleteTodos.removeTodo(todo);
      completeTodos.addTodo(todo);
    } else {
      completeTodos.removeTodo(todo);
      incompleteTodos.addTodo(todo);
    }
    updateSection($('div.todo'), incompleteTodos);
    updateSection($('div.done'), completeTodos);
  });




});
