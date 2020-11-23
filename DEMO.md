# The 'Vue' from Up High
11/23/20

## Intro

### About Me

I have been developing software for over a year. I've been with Bison for just over 2 years. I'm a part of Bison Technology Group and I am a member of **The BattleToads** team!

### Topics

**"Boring" Technical Stuff**
- Options Api
- Reactivity Model
- Lifecycle Hooks

**"Less Boring" Planning, Demos and Refactoring**
- Component Architecture
- Props/Events
- Slots
- Mixins
- Flux & Vuex

### Questions

Drop questions in chat and feel free to ask them as we go. 

## [Options API](https://vuejs.org/v2/api/)

### Data Flow

#### data

The data option on your component instance is where the components local state lives. The data object's values are reactive due to some Vue magic that occurs under the hood.

When instantiated, every key on the root of your data object has getter and setter descriptors added to them to make them reactive!

Take the following javascript object for example.

```javascript=
const data = {
    key1: 'value-1',
    key2: 'value-2'
}
```

When it's created it will have default descriptors that describe what kind of object it is and what you can do with it.

```javascript=
console.log(Object.getOwnPropertyDescriptors(data))

// output
{ 
    key1: {
        configurable: true // can change descriptors 
        enumerable: true // can be iterated over with for loop
        value: "value-1" // object state, cannot be paired with get/set
        writable: true // can be mutated with assignment operator
    }
    key2: {
        configurable: true
        enumerable: true
        value: "value-2"
        writable: true
    }
}
```

Vue 'auto-magically' creates reactive objects for you! They do this so that they can keep track of dependencies and trigger rerendering accordingly. Every component has a `vm.$watcher` instance that keeps track of all changes during every render cycle. When the object's setter function is called it notifies `vm.$watcher` which will trigger a rerender of the component.

Let's look at the same `data` object from an instance of a Vue component

```javascript=
console.log(Object.getOwnPropertyDescriptors(this.$data))
{
    key1: {
        configurable: true 
        enumerable: true 
        get: ƒ reactiveGetter() // function that returns property value
        set: ƒ reactiveSetter(newVal) // function that sets property
    },
    key2: {
        configurable: true
        enumerable: true
        get: ƒ reactiveGetter()
        set: ƒ reactiveSetter(newVal)
    }
}
```

This conversion of normal objects to reactive ones only occurs with objects on the root of `vm.$data`. Descendant members will not have their descriptors changed and will not be magically reactive on their own. 

#### computed

If you would like to have a reactive reference to a nested member, you would use the computed option!

```javascript=
...
data() {
    return {
        object: {
            child: {
                grandchild: {
                    key1: 'some-value'
                }
            }
        }
    }
},
computed: {
    grandchild: function() {
        return this.object.child.grandchild;
    }
}
...
```


#### props

Props are used to pass readonly state into a component. When a prop is reactive, it will trigger a rerender in your component any time it has it's set function called in the parent. 

Props define a contract for your component. You should avoid directly mutating a prop as it can throw your rendering out of order and you may lose reactivity. When you desire to mutate state of a property you should pass your desired effect up to the parent using `vm.$emit`

I like to think of props as an object, since that is what they are. When binding props from a parent to child I use `v-bind`'s object syntax so I can clearly convey what I am doing.

```htmlmixed=
...
<child-component v-bind="{ prop1, prop2, prop3 }" />
<!-- OR -->
<child-component v-bind="myProps" />
<!-- myProps being an object declared down in the template -->
...

```

Using object syntax to bind props to children also allows for chaining props from parent to child. I have found this confuses people and don't really do it but it is an easy way to use a bus pattern to pass things down into descendants.

```htmlmixed=
...
<child-component v-bind="$props" />
<!-- $props being your components vm.$props object pass in from parent -->
...

```

Prop objects have special options that you can pass in to alter some of their default behaviors. Check out how we do that with class decorators!

```typescript=
...
const somePropOptions = {
    type: Object, // Prop's constructor function
    default: {}, // Prop's default value if it is not passed from parent
    required: true, // Throws console warning if required and not present
    validator: (v) => !!v // Throws console warning if validator returns falsey
}
@Prop(somePropOptions) someProp!: object;
...
```

#### listeners
`vm.$listeners` is an object that stores a component's parent events and handlers. The `vm.$listeners` object has keys that refer to the event name and values that are the parents event handlers.

```typescript=
const listeners = {
    event: onEvent: (param) => {} 
}
```

When wrapping a component, you can directly bind it's `$listener` object to a child to quickly pass event's into a child. This is an example of an implementation of the 'Event Bus' pattern

```htmlmixed=
...
<child-component v-bind="$props" v-on="$listeners" />
...
```

#### el
`vm.$el` is any object that stores the template DOM for your component. This is a DOM node of type `HTMLDivElement` by default. You can overide this `option` by binding to another element like so using class decorators.

```htmlmixed=
<div id="SomeDiv" >
...
</div>
```
```typescript=
...
@Component({
    el: '#SomeDiv'
})
...
```



#### emit
`vm.$emit` is a function used to emit events up to a components parent. It takes in two parameters. The first being the event name as a string and the second being the payload passed into the event handler. Here is an example of an event being emitted using class decorators

```typescript=
...
@Prop(Array) selections! Item[]
@Emit('update-selection') updateSelection(selection: Item) {
    return selection
}
...
```

Event names are automatically converted to lowercase before being emitted or set on a $listener object. It is best practice to use kebob casing over camel cases to prevent issues. Because event binding occurs in the template it is easy to add a handler to a $listener object that will never be emitted. One way I have found to prevent this from occurring is using an enum when binding the events and the same enum in the child when emitting the event. 

```typescript=
// util
export enum ChildEvents {
    updateSelection = 'update-selection',
}

// parent
<child-component v-on="{
    // use dynamic member accessor syntax for your object key
    [ChildEvents.updateSelection]: someEventHandler
}"
    
// child
@Emit(ChildEvents.updateSelection) updateSelection(selection: any) {
    return selection
}
```

### Lifecycle Hooks
![](https://i.imgur.com/KRUTYJq.png)

#### created
The created hook is called synchronously after the vm is instantiated. It has wrapped all of the data objects so that they are reactive but the template hasn't been mounted on `vm.$el`. You have no access to any of the template DOM.

#### mounted
This is the hook we use most. When this hook is called, your component DOM is mounted and all of your data is ready to be accessed. At this point, not all of your child components will have completely mounted. You can use `await this.$nextTick()` inside the mounted hook if you need child DOM to exist.

#### beforeDestroy
This hook is called right before an vm instance is destroyed. I use this hook for any type of cleanup activities that may need to be done. 



## Component Architecture

### Project Toadify!

An exercise in breaking a task down into code!
![](https://i.imgur.com/AKklemT.png)

#### What?

When I was thinking about what I should do for a live demo, I was listening to Spotify on my TV and using my phone to control my playlist. I thought, "How cool would it be to integrate spotify directly into our eTicketing platform?! Why? Because I can!" 

![](https://i.imgur.com/1YwPWhx.png)

Going to need a player! Something like this ^^

![](https://i.imgur.com/A04Rpn8.png)

I would also like some sort of playlist so I can choose which songs to play! ^^

I put some more thought into it and decided to create a proof of concept first... After working out all of the bugs... Then I can try and slip it into one of my PR's and see if I can slide it past Mike

#### Why?

Covered in the previous section.

#### How?

For the sake of time I am going to step through the thought process of how I built the MVP then we will take a look at the code!

Now that I know what I want to make, I start to break it down into units of work. 


##### Server

I am going to need a server to safely authenticate to Spotify via oAuth. It will need to keep track of my auth token and 'connect' my client to Spotify to sync up the state of my player. This is probably another talk entirely, so I will skip over the details.


##### Client

I am going to need a landing page to see my playlist and I will need a player to control my music.

```bash=
# component hierarchy
page
├── player
└── playlist
```
I am going to need a service to talk with the server. I am also going to need a 'single source of truth' for my client side state. One place I can go and see all of my state and its logical concerns. Let’s put this inside of the page and pass it's state up and down to the player and playlist using props and events!

I have planned out the basic architecture so lets start defining contracts!

##### Contracts
**Server**

- login to Spotify
- provide player state
- play selected song
- pause playback

**Client**

- service
    - login to Spotify
    - get player state
    - play track
    - pause playback
- page
    - manages application state
- player
    - props
        - track: TrackData
        - playing: Boolean
    - events
        - play
        - pause
        - previous
        - next
- playlist
    - props
        - tracks: TrackData[]
        - track: Track
        - playing: Boolean
    - events
        - play
        - pause

**Interfaces**

```typescript=
export interface PlayerState {
  tracks: TrackData[];
  track?: TrackData;
  playing: boolean;
}

export interface TrackData {
  _id: string;
  title: string;
  album: string;
  duration: number;
  image: string;
  url: string;
  addedBy: string;
  uri: string;
  trackUri: string;
};
```

### Demo Time!

*9f592d1db85622baa11855c7acb4290e4ae2e033*

[Spotify Playlist](https://open.spotify.com/playlist/2RS2LIA8oyHAwDJ4cyeuBf)

![](https://i.imgur.com/cOYaQyO.png)

### Reflection

#### Time to Prop-tomizing!

Props and events are great but what if I have deeply nested components? An event bus can be a lot of cognitive overhead when you're nesting deep.

One solution to this problem is transclusion! You can use slots to nest components within each other like the Russian "Babushka Dolls." This will flatten out your components and allow props and events to live in once place. Lets see an example of that!

![](https://i.imgur.com/hXnuAfV.png)

#### Vuex

Vuex is a mutable implementation of the flux pattern. It was created by Facebook to address some concerns they had scaling while using MVC. The Flux Pattern uses a unidirectional data flow, it has a cyclical flow of data and I find it very comfortable to use. 

![](https://i.imgur.com/ZnmezLV.png)

#### Refactor

Lets quickly refactor our components to use vuex!

`npm install vuex-class`

![](https://i.imgur.com/twkxhNH.png)




