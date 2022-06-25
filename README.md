# Seb's Memory Card
---Features---

-Memory card game

-Click each card on a page only once

-Cards shuffle on each click, whether the card was right or wrong.

-Track your current points as well as high score. 

-Cards pulled from a MtG API

-Responsive desktop layout, no mobile support though

-Pierre the octopus

-Fun colours

-Custom spinning pierre animation used in a few places

-Custom dust and landing animations.

-Card binder is animated when shuffling and generating new cards

-Generate cards button (this resets your current score)

-Lore button

-Many animations minor and major for almost every interaction

---Devlog---

June 21st, 2022

    Worked on this a bit yesterday, and a tiny bit a few days before that. I think the issue yesterday was that I had taken two melatonin the night before instead of my usual one, causing my brain to short-circuit while attempting to understand react. Today, things are feeling pretty good and running pretty smoothly. Had a bug with cards no shuffling on click, then realized it was because arrays changing their item order does not count as inequality to their previous state, and therefore does not trigger a rerender. Now, I have a functioning score and cards that are pulled from the API. Just a few more things to add before I can start the styling, and I'm real pumped for that. 

    Essentially, you are taking cards from this guy's binder for your commander deck. It being commander/singleton, you can't use more than 1 of the same card and therefore the game of memory makes a bit of sense. Although the project being titled "memory card" still seems inaccurate to me. It should be either memory card game or memory game. The goal of the project isn't to create one memory card. 

    The more I work with react the less I understand it. I just want to reset an array to empty so that I can repopulate the binder with new cards. However, calling the usestate function to do this does nothing. Now, I boiled down the problem so all I had was a function the increments a state on click and it also does nothing. No idea what's going on.

    I don't know how, but it got worse. Spent a few hours just boiling down some react code to really simple stuff to see how it works, and I still have no fucking clue what update what when and where. Sometimes updating a value will rerender it correctly in the DOM and not change the read value, sometimes exactly the opposite. I'm really gonna have to just go through like the entire hook section again sadly. Aside from that, the setup does work the way I have it now. Why? No clue.

June 22nd, 2022

    Ok, so it more or less works as expected now. Just need to do some cute animating and stuff. I think that I may have found the issue I was having with usestate, but we'll get to that again when I need to implement something new.

June 23rd, 2022

    I think I'm roughly 2.5 days into this project, and despite being held back by learning react, I feel like there's not too much left to add here. I have a functioning game, some cool animations, and it's all built on API calls and react. 

June 24th, 2022

    Welcome to the final day. Just a couple things left to clean up, but the overall project is looking pretty good. Colour scheme is fun, and I am in love with Pierre the octopus.

    Looks pretty good, might be obvious as usual that I created this first in a half-width window, and then added a media query for wide screen. It changes the layout a bit though, so I think it looks alright. I also wrote a short story hidden behind an info button, lol.

---To-Do---

DONE-Generate new cards on current set finish
DONE-style basic layout
CANCEL-drag and drop cards
CANCEL-3d transform on cards like in Gwent
DONE-card backs shown on correct click, and moved to other pile 
DONE-shuffling animation
DONE-add static art
DONE-add particle effects
DONE-binder animation
DONE-Explanation sidebar (What is the player doing?)
DONE-wrong card animation
DONE-add restart button
DONE-better generating cards message
DONE-Finish styling
DONE-fix conditional component return
DONE-wide desktop layout