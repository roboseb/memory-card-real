# Seb's Memory Card

---Devlog---

June 21st, 2022

    Worked on this a bit yesterday, and a tiny bit a few days before that. I think the issue yesterday was that I had taken two melatonin the night before instead of my usual one, causing my brain to short-circuit while attempting to understand react. Today, things are feeling pretty good and running pretty smoothly. Had a bug with cards no shuffling on click, then realized it was because arrays changing their item order does not count as inequality to their previous state, and therefore does not trigger a rerender. Now, I have a functioning score and cards that are pulled from the API. Just a few more things to add before I can start the styling, and I'm real pumped for that. 

    Essentially, you are taking cards from this guy's binder for your commander deck. It being commander/singleton, you can't use more than 1 of the same card and therefore the game of memory makes a bit of sense. Although the project being titled "memory card" still seems inaccurate to me. It should be either memory card game or memory game. The goal of the project isn't to create one memory card. 

    The more I work with react the less I understand it. I just want to reset an array to empty so that I can repopulate the binder with new cards. However, calling the usestate function to do this does nothing. Now, I boiled down the problem so all I had was a function the increments a state on click and it also does nothing. No idea what's going on.

    I don't know how, but it got worse. Spent a few hours just boiling down some react code to really simple stuff to see how it works, and I still have no fucking clue what update what when and where. Sometimes updating a value will rerender it correctly in the DOM and not change the read value, sometimes exactly the opposite. I'm really gonna have to just go through like the entire hook section again sadly. Aside from that, the setup does work the way I have it now. Why? No clue.

June 22nd, 2022

    Ok, so it more or less works as expected now. Just need to do some cute animating and stuff. I think that I may have found the issue I was having with usestate, but we'll get to that again when I need to implement something new.

---To-Do---

DONE-Generate new cards on current set finish
-style basic layout
-drag and drop cards
-3d transform on cards like in Gwent
-card backs shown on correct click, and moved to other pile 
-shuffling animation
-add static art
-add particle effects
-binder animation
-Explanation sidebar (What is the player doing?)
-wrong card animation
