# Student Learning Outcomes and notes for each

## Be able to get rid of placeholder assets

### What are placeholder assets?
- Stand-in items that are used to get a feel for how the app will look, but will not be used in the final project
    * EX: generic images, latin text, hard-coded data, 
### How do I get rid of them, and why would I?
- Just delete them to get rid of them
    * For images, just delete and replace with dynamic images or final images
    * For data, add JS to make reactive, use serverside API to get data

## Understand what components are

### What are componets?
- Used to break up the UI, and then you can pass different data, props UI into each one.
### How are they useful?
- Keeps code clean, organized.
- Allows components to be reused

## Understand which parts of your design/code belong in which components

### You can split components into 3 categories by function
- **Views**: route-level containers
    * Contain the high level components that make up the entire page
    * Contain data used over the whole page
- **Feature Components**: Chunks of a page that have one specific function
    * EX: "PollResults", "TransactionList", etc.
- **UI/Base Components**: Generic building blocks
    * EX: "Button", "Card", "Dropdown", "Navbar", etc.


## Understand which components go in the components folder and which go in the views folder

### Types of components that go in the components folder
- Generic UI
- layout items like navbar, sidebar, page shells
- feature specific chunks like "AddTransaction.vue"
### Types of components that go in views folder
- Actual pages
- These will be mapped by a router
- Top level components only

## Understand how relative urls work within typescript/vite/vue:

### What is a relative url?
- It is a partial address that relies on the current location in order to find a file

### How do relative urls work?
- ```./file``` references a file in the current directory
- ```../file``` references a file one level up in the url
- ```/file``` references a file absolute to the site origin

## Be able to install and integrate libraries like css frameworks, etc.

### How do you install a library?
- ```npm i {package}@{version}```

### How do you integrate a library?
- ```import { method } from package```
- import css file if needed
- call ```app.use(Method);``
- import method from package in component script 
- initialize in js
- use in js
## Understand the difference between Options API and composition API

### Options API
- Traditional way
- Groups data and methods by options
- You make a data function containing your objects/methods, and you can access your objects with object.field or object.method


### Composition API
- More organized way to structure logic of components
- Promotes usability, readability, reactivity

- You make a setup function, then create objects as variables, then return from setup function


## Be able to make reactive variables in composition API

### How do you make reactive variables in the composition API?
- You wrap them in the "ref" function to create a reactive property
    * in script setup,
        * ```import {ref} from vue```
        * then you do: 
            ```const thing = ref({fields})```
- You can wrap them in the "computed" function to create reactive values that depend on reactive property(ies)
    * in script setup,
        * ```import {computed} from vue```
        * then you do: 
            ```const value = computed(() => {// computation logic using object.value \n return value});```
- To integrate from one component into another:
    * You can add JS in from one component and import in another component to use JS globally
    * You pass as a prop to the component by adding ```:object="object"``` inside component html
    * Then you do ```import {defineProps} from vue``` and ``` const props=defineProps({ object: {type: type, required: boolean},})```
    * Then you can use the reactive variable in your code with ```{{ variable}}```

