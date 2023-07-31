---
layout: default
title: Session
nav_exclude: true
---

**Procedural Generation and Simulation**  


Prof. Dr. Lena Gieseke \| l.gieseke@filmuniversitaet.de  
Teaching Assistant: Sylvia Rybak \| sylvia.rybak@filmuniversitaet.de

---

![preview.png](spiders.png)
![see **preview.mp4**](preview.mp4)

# Final Project Description

## Summary
I created a procedural rigging and animation logic for simple multi-legged characters in **Unreal Engine** with the procedural rigging system **Control Rig**.
This Control Rig "script" works on any base rig, that:
+ only has legs, no other extremities (except the root bone)
+ the legs are on the ground in the base pose
+ the base pose is "balanced" (specifically the perceived center of mass should be balanced)

The Control Rig will create control bones 

**Source Files:**
https://drive.google.com/drive/folders/1OdflLL7jkyGoQg5njMIgNGlyl2RLTvBm?usp=sharing
(The relevant Level and other assets are in the FinalExercise folder in the project content)

## Concept

In procedural animation the movement of the character is determined programmatically. The general idea was to create a multi-legged creature, that can simply be moved. The appropriate animation of the legs will be solved by the animation logic.
For this Unreal provides the Control Rig system. Existing rigs can be extended, changed and moved with this visual scripting language.

## Tutorials used

### Using Control Rig in Unreal Engine
https://www.youtube.com/watch?v=y2WzNvJZk0E

This along with the (rather slim) [documentation](https://docs.unrealengine.com/5.2/en-US/control-rig-in-unreal-engine/)and [Epic Games video series](https://dev.epicgames.com/community/learning/courses/5vL/unreal-engine-creating-and-modifying-control-rig/DnO1/unreal-engine-creating-and-modifying-control-rig-overview) provided a nice introduction to the procedural rigging system in Unreal.

### "Step by Step" Procedural Animation
https://www.youtube.com/watch?v=vKiqs_h1WXM

This also has a spider and I broadly based my approach on this. For some reason I decided to not "follow along" and deviate from the tutorial rather early.

### The Rain World Animation Process
https://www.youtube.com/watch?v=sVntwsrjNe4

Technically not a tutorial, but this talk about the procedural animation of the game Rain World was the primary inspiration for researching procedural animation. The key points I took from this talk is that it's surprisingly easy to "fake" physics or complexity in general. More specifically, the logic to find the ideal foot placement was inspired by one of the techniques showcased in this talk.


## Implementation

I nested a lot of logic into functions to keep the node tree (and my sanity) in order.
![](functions%20and%20variables.jpg)

Below you can see the main part of the logic, albeit abstracted by the mentioned local functions.
![](IK%20and%20Position%20Logic.jpg)

See this debug video for a basic visualization of the "walk" logic
![see **debug.mp4**](debug.mp4)
The green lines represent the vector from the origin to the ideal leg positions. The red lines the vector from the origin to the current leg position. If the angle between the real position and the respective ideal position is too large, or if their distance is too large (the exact value is arbitrary), then the leg will be moved to the ideal position. Otherwise the leg will be "stuck" to the last position in world space.

I also created a small Blueprint class which moves the Creature to a random position in a constant interval.

## Results

The final spider control rig provides a "jagged" walking animation for any skeletal mesh that fulfilles the aforementioned prerequisites. It can be moved on the x and y axis as well as rotated on the z axis. It can also be enabled to frequently move in a random direction.


## Project Reflection & Discussion

While it pains me a little that I didn't get to implement some features taht I initially envisioned, I still learned a lot about procedural rigging and Control Rig.
For my taste I learned a little *too much* about the quirks of Control Rig and how to deal with them. I also struggled with frequent crashes and even file corruption of my control rig asset. Regrettably I didn't have a recent backup, so I had to recreate the bulk of that progress. In general the friction with Unreal Engine was frustrating and did not completely outweigh the positive feelings when things finally started to work.

Looking forward I have a lot of ideas I would like to try in the context of procedural animation and rigging. I'm happy that I completed my first (slightly agonizing) step into this field.

### To implement
+ actual "step" / lerping of current position to ideal position
+ a properly modelled and rigged creature
+ include obstacles when calculating ideal leg position (through sphere casting)
+ allow up movement / climbing

## Lessions Learned
+ go immediatly for a bare bones solution
+ don't get stuck with details or "nice to have" features before something is actually working
+ test the whole "pipeline"/system as early as possbile
+ git commit after **every** step forward in development


---