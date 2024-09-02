<script lang="ts">
    import '../app.css';
    import '../app.ts';

    class Todo {
        text: string;
        done: boolean;

        constructor(initial: string, done = false) {
            this.text = initial; 
            this.done = done;
        }
    }

    // Load todos from localStorage
    function loadTodos(): Todo[] {
        if (typeof window !== 'undefined') {
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                return JSON.parse(savedTodos).map((todo: { text: string, done: boolean }) => 
                    new Todo(todo.text, todo.done)
                );
            }
        }
        return [];
    }

    // Reactive array of todos
    let todos = $state<Todo[]>(loadTodos());

    // Save todos to localStorage whenever they change
    $effect(() => {
        if (typeof window !== 'undefined') {
            const plainTodos = todos.map(todo => ({ text: todo.text, done: todo.done }));
            localStorage.setItem('todos', JSON.stringify(plainTodos));
        }
    });

    // Derived states with explicit types using $derived.by
    let activeTodos = $derived.by<Todo[]>(() => todos.filter(t => !t.done));
    let completedTodos = $derived.by<Todo[]>(() => todos.filter(t => t.done));

    function toggleTodo(todo: Todo): void {
        todo.done = !todo.done;
        todos = [...todos]; // Trigger reactivity by reassigning todos
    }

    function addTodo(): void {
        const inputElement = document.getElementById('todoInput') as HTMLInputElement;
        const inputValue = inputElement.value.trim();
        if (inputValue) {
            todos.push(new Todo(inputValue));
            inputElement.value = ''; 
        }
    }

    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            addTodo();
        }
    }
</script>

<style>
    main {
        display: flex;
        justify-content: center;
        padding: 100px 0;
    }
    .app {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border-radius: 10px;
        background-color: #353434;
        box-shadow: 0 0 15px 5px rgba(255,255,255,.3);
    }
    .app * {
        color: #fff;
    }
    .todo-wrapper {
        cursor: pointer;
        padding: 0.5em;
        margin-bottom: 0.5em;
        border: none;
        background: none;
        text-align: left;
        width: 100%;
    }
    .todo-wrapper:hover {
        background-color: #505050;
    }
    .completed button {
        text-decoration: line-through;
        color: #fff;
        background-color: rgb(1, 94, 1);
    }
    .completed .todo-wrapper:hover {
        color: #fff;
        background-color: rgb(1, 94, 1);
    }
    .input-wrapper {
        display: flex;
        gap: 0.5em;
        margin-bottom: 1em;
    }
    button {
        padding: 0.5em 1em;
        cursor: pointer;
        border-radius: 5px;
        background-color: #015a38;
        border: none;
        outline: none;
        transition: all ease .3s;
    }
    button:hover {
        background-color: #013b25;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .completed-section {
        margin-top: 30px;
    }
    input {
        border-radius: 5px;
        background-color: #707070;
        padding: 7px;
        border: none;
        outline: none;
        width: 100%;
    }

    ::placeholder {
        color: #bbbaba;
    }

    h2:first-child {
        margin-top: 0;
    }
</style>

<main>
    <div class="app">
        <h2>Add a task for poor ol' future you!</h2>
        <!-- Input field and submit button for adding new todos -->
        <div class="input-wrapper">
            <input
                id="todoInput"
                onkeydown={handleKeydown}
                placeholder="Create a todo app..."
            />
            <button onclick={addTodo}>
                Submit
            </button>
        </div>
    
        <!-- Display the list of active todos -->
        <h2>Active Tasks</h2>
        <ul>
            {#each activeTodos as todo}
                <li>
                    <button class="todo-wrapper" onclick={() => toggleTodo(todo)}>
                        <span>{todo.text}</span>
                    </button>
                </li>
            {/each}
        </ul>
    
        <!-- Display the list of completed todos -->
        <div class="completed-section">
            <h2>Completed Tasks</h2>
            <ul>
                {#each completedTodos as todo}
                    <li class="completed">
                        <button class="todo-wrapper" onclick={() => toggleTodo(todo)}>
                            <span>{todo.text}</span>
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</main>
