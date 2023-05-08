---
layout: default
title: Session
nav_exclude: true
---

**Procedural Generation and Simulation**


Prof. Dr. Lena Gieseke \| l.gieseke@filmuniversitaet.de
Teaching Assistant: Sylvia Rybak \| sylvia.rybak@filmuniversitaet.de

---

# Session 02 - Beauty in Maths (10 points)

This session is due on **Tuesday, May 8th** and we will discuss the results on Wednesday, May 10th.

This assignment should take <= 4h. If you need longer, please comment on that in your submission.


## The Theory

* Re-cap [Chapter 03 - Beauty in Maths](../02_scripts/pgs_ss23_03_mathsbeauty_script.html)

*On a side note:* This script includes formulas and GitHub's markdown preview will not display them. To read the script with properly set formulas, you have the following options:

* Read the script [online](https://ctechfilmuniversity.github.io/lecture_ss23_procedural_generation_and_simulation/02_scripts/pgs_ss23_03_mathsbeauty_script.html) (this links to an online `.html` version of the script - in case you do not see the proper formulas, try refreshing the page, that usually helps, don't ask me why)
* Download the script folder and open [pgs_ss23_03_mathsbeauty_script.html](../../02_scripts/pgs_ss23_03_mathsbeauty_script.html) locally in your browser.
* Download the script folder and open [pgs_ss23_03_mathsbeauty_script.md](../../02_scripts/pgs_ss23_03_mathsbeauty_script.md) in Visual Studio Code with the [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) plugin installed. Then the preview of the `.md` within VSCode will render the formulas nicely.


## Task 02.01 - Creative Project Development Numbers and Curves

Develop a creative and / or visual and / or auditive concept in regard to one of the topics of Chapter 3, be it a number or numbers, spirals or specific curves, or all of them. The project doesn't need to be executable by you but you should be able to plan it thoroughly. Imagine it as if you are the creative and technical director but you don't have to do everything yourself. You can use any setup, framework, tool, etc. you like for this concept, it does not have to be with Unreal.

This concept should ideally include

- the idea and goal,
- references and inspiration (feel free to investigate your topic further),
- the specific concept,
- optional: concept sketches,
- execution and implementation details on how to do it.


*Submission*: Your concept.

### Clelia dance

An interactive audio visualisation based on [Clelia Curves](https://en.wikipedia.org/wiki/Cl%C3%A9lie).
The visualisation should be a projection as part of a dancefloor or club scenario.

Visually, we see the curves wrapping or wandering around invisible spheres. So we get the idea of the spheres but without seeing them explicitly. Individual spheres can be different simply by their index.

![clelia curve on a sphere ](https://upload.wikimedia.org/wikipedia/commons/4/45/Kugel-clelia-14-3040.svg)
The representation of the curves themselves can take different shapes, depending on the underlying audio data. In the image the curve is a continuous line, but I imagine them particle-like, following the direction of the curve (indicated by arrows in the image). Like an old-fashioned mouse-pointer with tails.


![clelia c](https://upload.wikimedia.org/wikipedia/commons/7/7e/Kugel-clelia-beisp.svg)
We get different curves based on parameter c. Image 2 shows nine different curve shapes. I would simply map the range 1 - 9 to these nine values of c to decide which c to use at any given moment.

How do we get the input? I'd mark up a rectangle on the dancefloor with neon tape and have a camera pointed at the space (maybe from the top?). The camera is connected to a program that uses computer vision to count people within the square and forwards it the visualisation program. The count of people is used in the mapping of c.

eg:
- Noone in the square: no curve, maybe just audio-reactive particles.
- One person in the square: mapping to c = 1/4
- Eight people in the square: mapping to c = 4

![concept](img/ctech-clelia-dance.png)



## Unreal

### Task 02.02 - Procedural Generation Plugin

Unreal released with version 5.2 a brand new plugin for procedural generation - which is of course quite exciting for a course called "Procedural Generation & Simulation" 😁. The plugin will allow us to work with a node graph and is with that similar to Houdini.

The bad news are that we must have Unreal version 5.2 for using the plugin. So go ahead and add Unreal version 5.2 in your Library. 5.2. is still in Preview, meaning it is not officially published yet, but so far I didn't have any issues with this release.

The goal of this task is to build a forest-like environment through which a player can run, with a procedural approach with a PCGVolume.

To get there, I recommend to follow these tutorials:
* [Adrien Logut: UE5.2 Procedural Generation Plugin - Ep1 - Introduction](https://www.youtube.com/watch?v=hjk9308SCeE&t=61s)
* [Adrien Logut: UE5.2 Procedural Generation Plugin - Ep 2 - Bounds and exclusions](https://www.youtube.com/watch?v=LyPK7MZT1pM&t=0s)
* [Adrien Logut: UE5.2 Procedural Generation Plugin - Ep 3 - Mesh sampler, Density filtering and Subgraphs](https://www.youtube.com/watch?v=ZXh6oesGTGg)

For this task, only the content of episode 1 is a hard requirement. It is up to you how much from episodes 2 and 3 you want to add.

Try to design the scene a bit in which ever visual direction you want. Your final images should look somewhat interesting.

Hints
* You do not need to build Unreal, as said in the video. Unreal 5.2 is now available in the Library.
    * Test early if 5.2 and the PCG plugin is running on your computer. If not get in touch with me asap!
* There is an [un-official text-based summary of episode 1](https://www.quodsoler.com/blog/intro-to-unreal-procedural-content-generation-framework) of the video tutorials.
* I recommend to start with a "Third Person" template for your scene.
* If you get an  “Lighting Needs to be Rebuilt” error, go to the menu "Build" in the menu bar and select "Rebuild lighting".
* Make the PCG Volume small and set the "Points Per Square Meter" (in the Surface Sampler node in the PCG graph) to a low number in case your computer slows down. Your final scene does not to have a high density of meshes.
* You can use any assets you want and the result does not need to look like a forest at all. Just distribute other objects in a forest-like manner.
* For adding assets (in the tutorial the "temperate Vegetation: Spruce Forest" is used and works well in 5.2) from to market place that are officially not compatible with 5.2 you can use [the following approach](https://dev.epicgames.com/community/learning/tutorials/6G1D/unreal-engine-5-how-to-use-assets-that-are-not-compatible-with-ue5-in-ue5):

![pcg_01](img/pcg_01.png)
![pcg_02](img/pcg_02.png)


Check the [Unreal Script](../../02_scripts/pgs_ss23_02_unreal_script.md#procedural-content-generation-plugin) for more resources regarding the new Procedural Content Generation plugin.


*Submission*: At least one preview image (linked here).


![](img/forest1.png)

![](img/forest2.png)


Eventually, we also want to render videos and if you are interested, have a look into the topic yourself. But for this submission a video is not a requirement.


## Learnings

### Task 02.03

Please summarize your personal learnings (text or bullet points - whatever you prefer). What was challenging for you in this session? How did you challenge yourself?

- Lots of fun with the pgc plugin! The design of the nodes feels very intuitive and straight forward
- I also played around in landscape mode a little bit, that seems so powerful, too! I might look into it as well if I find some time
- Disabling collision on static meshes to improve performance is such a good tipp. But you have to do it for _all_ meshes in the Mesh Enntries list, which can get annoying when you have a lot of them... I definitely reach the limits of my laptop pretty quickly
- I didn't go for all the assets in the tutorials because they're just too big. It's like Epic assumes everyone is working on a 1TB machine and can quickly download 13GB of assets?


---

Answer all questions directly in a copy of this file and **also link and display all of your images in that file**. Submit your copy as `pgs_ss23_XX_lastname.md` in your assignments folder (replace the XX with the number of the session).


---

**Happy Proceduraling!**